import { User, Blog, BlogGenerateRequest, UserStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Token storage key
const TOKEN_KEY = 'bloomscript_token';
const USER_KEY = 'bloomscript_user';
const BLOGS_KEY = 'bloomscript_blogs';

// Default initial demo user
const INITIAL_DEMO_USER: User = {
  id: 1,
  email: 'priya.sharma@example.com',
  full_name: 'Priya Sharma',
  mobile_number: '+91 9876543210',
  age: 26,
  date_of_birth: '1998-05-14',
  gender: 'Female',
  profession: 'AI Research Specialist & Content Creator',
  education: 'Master of Science in Computer Science',
  marital_status: 'Single',
  bio: 'Passionate technologist, writer, and researcher exploring the intersection of generative AI, ethical computing, and human creativity.',
  profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  is_active: true,
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  blogs_count: 2,
};

// Initial blogs
const INITIAL_BLOGS: Blog[] = [
  {
    id: 101,
    user_id: 1,
    title: 'The Renaissance of Generative Intelligence: Redefining Digital Craftsmanship',
    subtitle: 'How thoughtful human direction and neural synthesis are forging an unprecedented creative paradigm',
    topic: 'The future of artificial intelligence in creative workflows',
    content: `# The Renaissance of Generative Intelligence

> *How thoughtful human direction and neural synthesis are forging an unprecedented creative paradigm*

In an era characterized by exponential computational leaps, the discourse surrounding artificial intelligence has shifted from speculative curiosity to structural transformation. Writers, designers, and developers are no longer passive consumers of digital utilities; they have become conductors of sophisticated neural ensembles.

## 1. Beyond Automation: The Emergence of Co-Creation

Historically, technological disruptions sought to minimize human labor through sheer mechanical speed. From assembly lines to algorithmic compilers, the focus was throughput. Generative models, however, invert this dynamic. Rather than replacing human intent, they amplify conceptual velocity.

By offloading syntactic overhead—drafting structural outlines, verifying contextual citations, and harmonizing tonal cadences—creators preserve their cognitive bandwidth for philosophical framing and emotional resonance.

## 2. The Architectural Pillars of High-Impact Content

Sustainable editorial impact hinges on three interrelated disciplines:

1. **Epistemic Integrity**: Grounding computational synthesis in rigorous verifiable truths.
2. **Distinctive Voice**: Rejecting generic corporate uniformity in favor of nuanced, provocative perspectives.
3. **Architectural Clarity**: Structuring complex thematic arcs into intuitive cognitive pathways.

## Conclusion

The future belongs not to algorithms operating in isolation, nor to practitioners who resist technological evolution. It belongs to thoughtful craftspeople who wield intelligence as a brush—sculpting narratives that educate, inspire, and endure.

### Key Takeaways
- Generative AI functions as a creative cognitive amplifier, not a substitute for human taste.
- Thoughtful prompt architecture separates mundane summaries from seminal editorial thought.
- Long-term credibility requires unwavering commitment to authenticity and rigorous verification.`,
    blog_type: 'Technical',
    tone: 'Inspirational',
    target_audience: 'Developers',
    language: 'English',
    word_count: 420,
    keywords: 'Generative AI, Creative Workflows, Editorial Architecture',
    status: 'published',
    featured_image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'Priya Sharma',
    images: [],
  },
  {
    id: 102,
    user_id: 1,
    title: 'Mindful Engineering: Cultivating Focus in an Era of Hyper-Connectivity',
    subtitle: 'Practical mental models and architectural habits for deep work',
    topic: 'Focus and mindfulness for software engineers',
    content: `# Mindful Engineering: Cultivating Focus in an Era of Hyper-Connectivity

> *Practical mental models and architectural habits for deep work*

The modern engineering workspace is a battlefield of notifications, context switches, and cognitive fragmentation. While our developer tools have grown astronomically more powerful, our capacity for sustained, uninterrupted contemplation has never been more vulnerable.

## The Cognitive Cost of Context Switching

Every interruption leaves an attention residue. Research shows that recovering full immersion after a minor interruption takes upwards of 23 minutes. In software architecture, where mental call stacks are 7 levels deep, a single ping can demolish an entire conceptual framework.

## Strategies for Deep Intellectual Flow

- **Time-Blocked Deep Work Sprints**: Reserve uninterrupted 90-minute blocks for hard problem solving.
- **Asynchronous Communication Protocols**: Batch review pull requests and messages instead of reacting instantaneously.
- **Cognitive Decoupling**: Disconnect completely from screens during breaks to foster subconscious synthesis.

## Conclusion

Excellence in engineering is not measured by the velocity of your Slack replies, but by the elegance, resilience, and clarity of the systems you build. Protect your focus with the same rigor you apply to your production databases.`,
    blog_type: 'Educational',
    tone: 'Conversational',
    target_audience: 'Professionals',
    language: 'English',
    word_count: 350,
    keywords: 'Deep Work, Engineering Habits, Productivity',
    status: 'published',
    featured_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    author_name: 'Priya Sharma',
    images: [],
  },
];

// Helper to get local stored blogs
function getLocalBlogs(): Blog[] {
  const raw = localStorage.getItem(BLOGS_KEY);
  if (!raw) {
    localStorage.setItem(BLOGS_KEY, JSON.stringify(INITIAL_BLOGS));
    return INITIAL_BLOGS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_BLOGS;
  }
}

function saveLocalBlogs(blogs: Blog[]) {
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
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
    if (!raw) {
      // Default to demo user for frictionless sandbox exploration
      localStorage.setItem(USER_KEY, JSON.stringify(INITIAL_DEMO_USER));
      return INITIAL_DEMO_USER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_USER;
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

  async login(email: string, _password: string): Promise<User> {
    // Check if API backend is available
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: _password }),
        });
        if (res.ok) {
          const data = await res.json();
          this.setToken(data.access_token);
          // fetch current profile
          const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          if (meRes.ok) {
            const user = await meRes.json();
            this.setCurrentUser(user);
            return user;
          }
        }
      } catch (e) {
        console.warn('Backend not reached, using local session', e);
      }
    }

    // Local authentication fallback
    const user: User = {
      ...INITIAL_DEMO_USER,
      email: email.toLowerCase().trim(),
      full_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    };
    this.setToken('mock_jwt_token_' + Date.now());
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
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const tokenData = await res.json();
          this.setToken(tokenData.access_token);
          const meRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          });
          if (meRes.ok) {
            const user = await meRes.json();
            this.setCurrentUser(user);
            return user;
          }
        }
      } catch (e) {
        console.warn('Backend register fallback', e);
      }
    }

    const birthYear = data.date_of_birth ? new Date(data.date_of_birth).getFullYear() : 1998;
    const age = new Date().getFullYear() - birthYear;

    const newUser: User = {
      id: Math.floor(Math.random() * 1000) + 10,
      email: data.email.toLowerCase().trim(),
      full_name: data.full_name.trim(),
      mobile_number: data.mobile_number,
      age: isNaN(age) ? 25 : age,
      date_of_birth: data.date_of_birth,
      gender: data.gender || 'Not specified',
      profession: data.profession || 'Writer & Creator',
      education: data.education || 'Bachelor Degree',
      marital_status: data.marital_status || 'Single',
      bio: data.bio || 'New author on BloomScript AI Blog Studio.',
      profile_image: `https://api.dicebear.com/7.x/notionists/svg?seed=${data.email}`,
      is_active: true,
      created_at: new Date().toISOString(),
      blogs_count: 0,
    };

    this.setToken('mock_jwt_token_' + Date.now());
    this.setCurrentUser(newUser);
    return newUser;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = this.getCurrentUser() || INITIAL_DEMO_USER;
    const updated: User = { ...current, ...updates };
    this.setCurrentUser(updated);
    return updated;
  },

  async getUserStats(): Promise<UserStats> {
    const blogs = getLocalBlogs();
    const total_blogs = blogs.length;
    const total_words = blogs.reduce((acc, b) => acc + (b.word_count || 0), 0);
    const published_blogs = blogs.filter((b) => b.status === 'published').length;
    const draft_blogs = total_blogs - published_blogs;

    const categories = blogs.map((b) => b.blog_type);
    const top_category = categories.length > 0 ? categories[0] : 'Educational';

    const currentUser = this.getCurrentUser();
    return {
      total_blogs,
      total_words,
      published_blogs,
      draft_blogs,
      top_category,
      account_created_date: currentUser?.created_at || new Date().toISOString(),
    };
  },

  async getBlogs(params?: { search?: string; type?: string; status?: string }): Promise<Blog[]> {
    let blogs = getLocalBlogs();
    if (params?.search) {
      const q = params.search.toLowerCase();
      blogs = blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.topic.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q)
      );
    }
    if (params?.type && params.type !== 'All') {
      blogs = blogs.filter((b) => b.blog_type.toLowerCase() === params.type?.toLowerCase());
    }
    if (params?.status && params.status !== 'All') {
      blogs = blogs.filter((b) => b.status === params.status?.toLowerCase());
    }
    return blogs;
  },

  async getBlogById(id: number): Promise<Blog | null> {
    const blogs = getLocalBlogs();
    return blogs.find((b) => b.id === id) || null;
  },

  async generateBlog(req: BlogGenerateRequest): Promise<Blog> {
    // Simulate generation latency for delightful cinematic loader
    await new Promise((resolve) => setTimeout(resolve, 2200));

    const isHindi = req.language.toLowerCase() === 'hindi';
    const topic = req.topic.trim();
    const audience = req.target_audience;
    const tone = req.tone;
    const blogType = req.blog_type;
    const currentUser = this.getCurrentUser() || INITIAL_DEMO_USER;

    // Featured image resolution
    let featuredImage = req.featured_image_url;
    if (!featuredImage) {
      const curated = [
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      ];
      const idx = Math.abs(topic.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % curated.length;
      featuredImage = curated[idx];
    }

    let title = '';
    let subtitle = '';
    let markdown = '';

    if (isHindi) {
      title = `${topic}: एक संपूर्ण और व्यावहारिक मार्गदर्शिका`;
      subtitle = `${audience} के लिए ${blogType} दृष्टिकोण और भविष्य की संभावनाएं`;
      markdown = `# ${title}

> *${subtitle}*

आज के तेजी से बदलते डिजिटल युग में, **${topic}** एक अत्यंत प्रभावशाली और विचारणीय विषय बन चुका है। ${tone} दृष्टिकोण के साथ, इस लेख में हम इसके मूल सिद्धांतों, औद्योगिक अनुप्रयोगों और भविष्य की रणनीतियों पर विचार करेंगे।

## 1. आधारभूत संरचना और मुख्य सिद्धांत

किसी भी विषय को गहराई से समझने के लिए उसकी बुनियादी अवधारणाओं को जानना आवश्यक है। जब हम ${topic} का विश्लेषण करते हैं, तो तीन प्रमुख पहलू सामने आते हैं:
1. **स्पष्टता और प्रासंगिकता**: विषय की मूल आवश्यकताओं को समझना।
2. **व्यावहारिक उपयोगिता**: सिद्धांतों को वास्तविक कार्यप्रणाली में लागू करना।
3. **दीर्घकालिक प्रभाव**: भविष्य में आने वाले परिवर्तनों के लिए तैयार रहना।

${req.uploaded_image_urls && req.uploaded_image_urls[0] ? `![Uploaded Illustration](${req.uploaded_image_urls[0]})\n` : ''}

## 2. चुनौतियाँ और व्यावहारिक समाधान

हर नए प्रयोग के साथ कुछ चुनौतियाँ आती हैं। इस संदर्भ में सबसे महत्वपूर्ण बात यह है कि हम जोखिमों का पूर्व-मूल्यांकन करें और सुसंगत रणनीतियों का पालन करें।

## निष्कर्ष

संक्षेप में, **${topic}** केवल एक आधुनिक विचार नहीं है, बल्कि यह हमारे सोचने और काम करने के तरीके को नया आयाम देने की क्षमता रखता है। निरंतर अध्ययन और सकारात्मक दृष्टिकोण ही सफलता का मार्ग प्रशस्त करता है।

### मुख्य निष्कर्ष (Key Takeaways)
- ${topic} को अपनी दैनिक कार्ययोजना में शामिल करें।
- सैद्धांतिक ज्ञान के साथ-साथ व्यावहारिक अनुभव पर बल दें।
- नैतिक मानकों और गुणवत्ता से कभी समझौता न करें।`;
    } else {
      title = `The Definitive Blueprint to ${topic}: Trends, Mechanics & Strategy`;
      subtitle = `A ${tone.toLowerCase()} and ${blogType.toLowerCase()} masterclass designed for ${audience}`;
      markdown = `# ${title}

> *${subtitle}*

In an era defined by rapid acceleration and systemic transformation, **${topic}** has transcended from a specialized interest into a critical operational vector. For ${audience}, navigating this domain requires more than superficial awareness—it demands a grounded understanding of first principles, strategic leverage points, and sustainable execution frameworks.

## 1. Deconstructing the Foundations of ${topic}

To master any discipline, one must first isolate its structural pillars. Historically, conversations surrounding ${topic} were confined to theoretical conjecture. Today, however, the convergence of computational velocity, qualitative research, and open ecosystems has fundamentally altered the trajectory.

${req.uploaded_image_urls && req.uploaded_image_urls[0] ? `![Visual Insight](${req.uploaded_image_urls[0]})\n` : ''}

### Key Drivers Accelerating Change
- **Systemic Integration**: Moving away from isolated experiments toward cohesive, end-to-end workflows.
- **Cognitive Velocity**: Leveraging smart tools to eliminate boilerplate overhead and focus on creative synthesis.
- **Empirical Validation**: Relying on objective benchmarks rather than intuition alone.

## 2. Overcoming Friction: Common Pitfalls and Strategic Countermeasures

Even with the clearest roadmap, initiatives in this space face predictable headwinds. The most pervasive trap is premature optimization: spending excessive cognitive capital on marginal efficiencies before validating the foundational thesis.

> "True craftsmanship does not lie in the accumulation of tools, but in the intentionality with which each stroke is executed."

### Actionable Countermeasures
1. **Decompose Complexity**: Break monolithic challenges into self-contained, testable phases.
2. **Establish Short Feedback Loops**: Continuous micro-iterations beat delayed perfection.
3. **Maintain Architectural Guardrails**: Enforce consistency and security standards from day one.

## 3. An Actionable Playbook for ${audience}

Whether you are just getting started or scaling existing systems, follow this three-stage implementation blueprint:
- **Phase I (Baseline Discovery)**: Audit current workflows, identify recurring bottlenecks, and establish clear baseline metrics.
- **Phase II (Iterative Prototyping)**: Deploy targeted experiments, collect quantitative feedback, and refine your operational playbook.
- **Phase III (Ecosystem Mastery)**: Codify best practices into automated, repeatable workflows that scale gracefully.

## Conclusion

As we look toward the horizon, **${topic}** will continue to reshape expectations and redefine what is possible. By pairing rigorous domain knowledge with thoughtful, human-centric design, ${audience} can not only adapt to this evolving landscape, but actively shape its future.

### Key Takeaways
- Approach ${topic} with a first-principles mindset to avoid cargo-cult adoption.
- Short iteration cycles produce compounding insights and minimize operational risk.
- Protect cognitive focus and prioritize authentic craft over vanity throughput.`;
    }

    const words = markdown.match(/\b\w+\b/g)?.length || 500;

    const newBlog: Blog = {
      id: Date.now(),
      user_id: currentUser.id,
      title,
      subtitle,
      topic,
      content: markdown,
      blog_type: blogType,
      tone: tone,
      target_audience: audience,
      language: req.language,
      word_count: words,
      keywords: req.keywords || topic,
      status: 'published',
      featured_image: featuredImage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author_name: req.author_name || currentUser.full_name,
      images: req.uploaded_image_urls?.map((url, i) => ({
        id: Date.now() + i,
        image_path: url,
        image_url: url,
        alt_text: `Illustration ${i + 1}`,
        created_at: new Date().toISOString(),
      })) || [],
    };

    const existing = getLocalBlogs();
    const updatedBlogs = [newBlog, ...existing];
    saveLocalBlogs(updatedBlogs);

    // Update user blog count
    currentUser.blogs_count = updatedBlogs.length;
    this.setCurrentUser(currentUser);

    return newBlog;
  },

  async updateBlog(id: number, updates: Partial<Blog>): Promise<Blog> {
    const blogs = getLocalBlogs();
    const index = blogs.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Blog not found');

    const updatedBlog = {
      ...blogs[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    if (updates.content) {
      updatedBlog.word_count = updates.content.match(/\b\w+\b/g)?.length || 0;
    }
    blogs[index] = updatedBlog;
    saveLocalBlogs(blogs);
    return updatedBlog;
  },

  async deleteBlog(id: number): Promise<void> {
    const blogs = getLocalBlogs();
    const filtered = blogs.filter((b) => b.id !== id);
    saveLocalBlogs(filtered);

    const currentUser = this.getCurrentUser();
    if (currentUser) {
      currentUser.blogs_count = filtered.length;
      this.setCurrentUser(currentUser);
    }
  },

  async generateFeaturedImage(topic: string, _tone: string): Promise<string> {
    await new Promise((r) => setTimeout(r, 1200));
    const curated = [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    ];
    const idx = Math.abs(topic.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % curated.length;
    return curated[idx];
  },
};
