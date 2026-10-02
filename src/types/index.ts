export interface User {
  id: number;
  email: string;
  full_name: string;
  mobile_number?: string;
  age?: number;
  date_of_birth?: string;
  gender?: string;
  profession?: string;
  education?: string;
  marital_status?: string;
  bio?: string;
  profile_image?: string;
  is_active: boolean;
  created_at: string;
  blogs_count: number;
}

export interface BlogImage {
  id: number;
  blog_id?: number;
  image_path: string;
  image_url: string;
  alt_text?: string;
  created_at: string;
}

export interface Blog {
  id: number;
  user_id: number;
  title: string;
  subtitle?: string;
  topic: string;
  content: string;
  blog_type: string;
  tone: string;
  target_audience: string;
  language: string;
  word_count: number;
  keywords?: string;
  status: 'draft' | 'published';
  featured_image?: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
  images?: BlogImage[];
}

export interface BlogGenerateRequest {
  topic: string;
  blog_length: 'Short' | 'Medium' | 'Long' | 'Custom';
  custom_word_count?: number;
  blog_type: string;
  tone: string;
  target_audience: string;
  language: string;
  keywords?: string;
  important_points?: string;
  additional_instructions?: string;
  author_name?: string;
  featured_image_url?: string;
  uploaded_image_urls?: string[];
}

export interface UserStats {
  total_blogs: number;
  total_words: number;
  published_blogs: number;
  draft_blogs: number;
  top_category: string;
  account_created_date: string;
}
