import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FloatingPetals } from './components/FloatingPetals';
import { LandingHero } from './components/LandingHero';
import { DashboardView } from './components/DashboardView';
import { CreateBlogStudio } from './components/CreateBlogStudio';
import { BlogEditor } from './components/BlogEditor';
import { BlogPreviewModal } from './components/BlogPreviewModal';
import { ExportModal } from './components/ExportModal';
import { MyBlogsView } from './components/MyBlogsView';
import { ProfileView } from './components/ProfileView';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { SqlQueriesModal } from './components/SqlQueriesModal';
import { api } from './services/api';
import { User, Blog, UserStats, BlogGenerateRequest } from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);

  // Active blog for editing or previewing
  const [activeEditingBlog, setActiveEditingBlog] = useState<Blog | null>(null);
  const [activePreviewBlog, setActivePreviewBlog] = useState<Blog | null>(null);
  const [activeExportBlog, setActiveExportBlog] = useState<Blog | null>(null);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSqlQueriesOpen, setIsSqlQueriesOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial load
  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);
    loadBlogsAndStats();
  }, []);

  const loadBlogsAndStats = async () => {
    const loadedBlogs = await api.getBlogs();
    setBlogs(loadedBlogs);
    const loadedStats = await api.getUserStats();
    setStats(loadedStats);
  };

  // Auth Handlers
  const handleLogin = async (email: string, pass: string) => {
    const user = await api.login(email, pass);
    setCurrentUser(user);
    await loadBlogsAndStats();
    showToast(`Welcome back, ${user.full_name}!`);
    setCurrentTab('dashboard');
  };

  const handleRegister = async (data: any) => {
    const user = await api.register(data);
    setCurrentUser(user);
    await loadBlogsAndStats();
    showToast(`Account registered successfully for ${user.full_name}!`);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    api.setCurrentUser(null);
    setCurrentUser(null);
    showToast('Signed out successfully.');
    setCurrentTab('landing');
  };

  // Blog Handlers
  const handleGenerateBlog = async (req: BlogGenerateRequest) => {
    setIsGenerating(true);
    try {
      const generated = await api.generateBlog(req);
      await loadBlogsAndStats();
      showToast('Structured article generated successfully with PostgreSQL persistence!');
      setActiveEditingBlog(generated);
      setCurrentTab('editor');
    } catch (err: any) {
      showToast(err?.message || 'Error generating blog. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveBlog = async (updates: Partial<Blog>) => {
    if (!activeEditingBlog) return;
    try {
      const updated = await api.updateBlog(activeEditingBlog.id, updates);
      setActiveEditingBlog(updated);
      await loadBlogsAndStats();
      showToast('Article saved successfully.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to save changes.', 'error');
    }
  };

  const handleDeleteBlog = async (blogId: number) => {
    try {
      await api.deleteBlog(blogId);
      await loadBlogsAndStats();
      showToast('Article deleted from PostgreSQL.');
      if (activeEditingBlog?.id === blogId) {
        setActiveEditingBlog(null);
        setCurrentTab('my-blogs');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete blog.', 'error');
    }
  };

  const handleRegenerateBlog = async (blog: Blog) => {
    showToast('Regenerating blog copy with AI engine...');
    setIsGenerating(true);
    try {
      const req: BlogGenerateRequest = {
        topic: blog.topic,
        blog_length: 'Medium',
        blog_type: blog.blog_type,
        tone: blog.tone,
        target_audience: blog.target_audience,
        language: blog.language,
        keywords: blog.keywords,
        author_name: blog.author_name,
        featured_image_url: blog.featured_image,
      };
      const regenerated = await api.generateBlog(req);
      // Update existing content
      await api.updateBlog(blog.id, {
        title: regenerated.title,
        subtitle: regenerated.subtitle,
        content: regenerated.content,
        word_count: regenerated.word_count,
      });
      // Remove temporary entry
      await api.deleteBlog(regenerated.id);
      await loadBlogsAndStats();
      showToast('Article regenerated successfully!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<User>) => {
    try {
      const updated = await api.updateProfile(updates);
      setCurrentUser(updated);
      showToast('Author profile updated in PostgreSQL.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update profile.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-rose-50/30 text-stone-900 selection:bg-rose-200 selection:text-rose-900">
      {/* Background Floating Petals Canvas */}
      <FloatingPetals />

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'editor' && !activeEditingBlog && blogs.length > 0) {
            setActiveEditingBlog(blogs[0]);
          }
          setCurrentTab(tab);
        }}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenSqlQueries={() => setIsSqlQueriesOpen(true)}
        onLogout={handleLogout}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-stone-900 px-4 py-3 text-xs font-medium text-white shadow-xl border border-stone-800 animate-in slide-in-from-bottom-5 duration-200">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 relative z-10">
        {currentTab === 'landing' && (
          <LandingHero
            onStartCreating={() => setCurrentTab('create')}
            onExploreFeatures={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onTryDemo={() => {
              handleLogin('priya.sharma@example.com', 'password123');
            }}
            onPreviewSample={() => {
              if (blogs.length > 0) {
                setActivePreviewBlog(blogs[0]);
              }
            }}
          />
        )}

        {currentTab === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            stats={stats}
            recentBlogs={blogs}
            onCreateBlog={() => setCurrentTab('create')}
            onViewBlog={(blog) => setActivePreviewBlog(blog)}
            onEditBlog={(blog) => {
              setActiveEditingBlog(blog);
              setCurrentTab('editor');
            }}
            onViewAllBlogs={() => setCurrentTab('my-blogs')}
          />
        )}

        {currentTab === 'create' && (
          <CreateBlogStudio
            currentUser={currentUser}
            onGenerate={handleGenerateBlog}
            isGenerating={isGenerating}
          />
        )}

        {currentTab === 'editor' && activeEditingBlog && (
          <BlogEditor
            blog={activeEditingBlog}
            onSave={handleSaveBlog}
            onPreview={(blog) => setActivePreviewBlog(blog)}
            onBack={() => setCurrentTab('my-blogs')}
          />
        )}

        {currentTab === 'my-blogs' && (
          <MyBlogsView
            blogs={blogs}
            onCreateBlog={() => setCurrentTab('create')}
            onViewBlog={(blog) => setActivePreviewBlog(blog)}
            onEditBlog={(blog) => {
              setActiveEditingBlog(blog);
              setCurrentTab('editor');
            }}
            onDeleteBlog={handleDeleteBlog}
            onRegenerateBlog={handleRegenerateBlog}
            onExportBlog={(blog) => setActiveExportBlog(blog)}
          />
        )}

        {currentTab === 'profile' && currentUser && (
          <ProfileView
            currentUser={currentUser}
            stats={stats}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-rose-200/60 bg-white/70 backdrop-blur-xs py-8 text-xs text-stone-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-base font-bold text-stone-900">
              Bloom<span className="text-rose-600 italic">Script</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>AI Editorial Studio with PostgreSQL 18 & FastAPI</span>
          </div>

          <div className="flex items-center gap-4 text-stone-700">
            <button onClick={() => setIsSqlQueriesOpen(true)} className="hover:text-rose-600 transition-colors">
              Postgres 18 Query Handbook
            </button>
            <span aria-hidden="true">·</span>
            <span>Docker Compose Ready</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Format Export</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BlogPreviewModal
        blog={activePreviewBlog}
        isOpen={!!activePreviewBlog}
        onClose={() => setActivePreviewBlog(null)}
        onEdit={(blog) => {
          setActivePreviewBlog(null);
          setActiveEditingBlog(blog);
          setCurrentTab('editor');
        }}
        onOpenExport={(blog) => {
          setActiveExportBlog(blog);
        }}
      />

      <ExportModal
        blog={activeExportBlog}
        isOpen={!!activeExportBlog}
        onClose={() => setActiveExportBlog(null)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => setIsRegisterOpen(true)}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => setIsLoginOpen(true)}
      />

      <SqlQueriesModal
        isOpen={isSqlQueriesOpen}
        onClose={() => setIsSqlQueriesOpen(false)}
      />
    </div>
  );
}

export default App;
