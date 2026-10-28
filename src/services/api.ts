import { User, Blog, BlogGenerateRequest, UserStats } from '../types';

// Empty by default: requests go to the same origin and the frontend server
// proxies /api and /uploads to the FastAPI backend (see nginx.conf / vite.config.ts).
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const TOKEN_KEY = 'bloomscript_token';
const USER_KEY = 'bloomscript_user';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function errorMessage(body: any, status: number): string {
  const detail = body?.detail;
  if (typeof detail === 'string') return detail;
  // FastAPI validation errors: [{ loc: [...], msg: '...' }]
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((d: any) => {
        const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : '';
        return field ? `${field}: ${d.msg}` : d.msg;
      })
      .join('; ');
  }
  return `Request failed (${status})`;
}

// Drop empty strings so optional fields (e.g. date_of_birth) are not rejected by validation
function clean<T extends object>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== '' && v !== undefined)
  ) as Partial<T>;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Cannot reach the BloomScript server. Please check that the backend is running.', 0);
  }

  if (res.status === 401 && token) {
    // Token expired or invalid: clear the session
    api.setCurrentUser(null);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(errorMessage(body, res.status), res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw || !this.getToken()) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (!user) {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  // Re-validates the stored token against the backend; returns null when signed out
  async fetchCurrentUser(): Promise<User | null> {
    if (!this.getToken()) return null;
    try {
      const user = await request<User>('/api/auth/me');
      this.setCurrentUser(user);
      return user;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return null;
      return this.getCurrentUser();
    }
  },

  async login(email: string, password: string): Promise<User> {
    const data = await request<{ access_token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
    this.setToken(data.access_token);
    const user = await request<User>('/api/auth/me');
    this.setCurrentUser(user);
    return user;
  },

  async register(data: {
    full_name: string;
    email: string;
    password: string;
    mobile_number?: string;
    date_of_birth?: string;
    gender?: string;
    profession?: string;
    education?: string;
    marital_status?: string;
    bio?: string;
  }): Promise<User> {
    const tokenData = await request<{ access_token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(clean(data)),
    });
    this.setToken(tokenData.access_token);
    const user = await request<User>('/api/auth/me');
    this.setCurrentUser(user);
    return user;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { id, email, is_active, created_at, blogs_count, ...editable } = updates as any;
    const user = await request<User>('/api/users/me/update', {
      method: 'PUT',
      body: JSON.stringify(clean(editable)),
    });
    this.setCurrentUser(user);
    return user;
  },

  async getUserStats(): Promise<UserStats | null> {
    if (!this.getToken()) return null;
    return request<UserStats>('/api/users/me/stats');
  },

  async getBlogs(params?: { search?: string; type?: string; status?: string }): Promise<Blog[]> {
    if (!this.getToken()) return [];
    const blogs: Blog[] = [];
    // The API pages results (max 50 per page); collect every page
    for (let page = 1; ; page++) {
      const q = new URLSearchParams({ page: String(page), limit: '50' });
      if (params?.search) q.set('search', params.search);
      if (params?.type && params.type !== 'All') q.set('blog_type', params.type);
      if (params?.status && params.status !== 'All') q.set('status', params.status.toLowerCase());
      const res = await request<{ total: number; blogs: Blog[] }>(`/api/blogs?${q}`);
      blogs.push(...res.blogs);
      if (blogs.length >= res.total || res.blogs.length === 0) break;
    }
    return blogs;
  },

  async getBlogById(id: number): Promise<Blog | null> {
    return request<Blog>(`/api/blogs/${id}`);
  },

  async generateBlog(req: BlogGenerateRequest): Promise<Blog> {
    return request<Blog>('/api/blogs/generate', {
      method: 'POST',
      body: JSON.stringify(clean(req)),
    });
  },

  async regenerateBlog(id: number): Promise<Blog> {
    return request<Blog>(`/api/blogs/${id}/regenerate`, { method: 'POST' });
  },

  async updateBlog(id: number, updates: Partial<Blog>): Promise<Blog> {
    const { title, subtitle, content, blog_type, tone, target_audience, language, keywords, status, featured_image } = updates;
    return request<Blog>(`/api/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(
        clean({ title, subtitle, content, blog_type, tone, target_audience, language, keywords, status, featured_image })
      ),
    });
  },

  async deleteBlog(id: number): Promise<void> {
    await request<void>(`/api/blogs/${id}`, { method: 'DELETE' });
  },

  async uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    const res = await request<{ image_url: string }>('/api/images/upload', { method: 'POST', body: form });
    return res.image_url;
  },

  async generateFeaturedImage(topic: string, tone: string): Promise<string> {
    const res = await request<{ image_url: string }>('/api/images/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, tone }),
    });
    return res.image_url;
  },
};
