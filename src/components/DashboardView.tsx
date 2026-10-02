import React from 'react';
import { PenTool, BookOpen, Clock, CheckCircle2, FileText, ArrowRight, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { User, Blog, UserStats } from '../types';

interface DashboardViewProps {
  currentUser: User;
  stats: UserStats | null;
  recentBlogs: Blog[];
  onCreateBlog: () => void;
  onViewBlog: (blog: Blog) => void;
  onEditBlog: (blog: Blog) => void;
  onViewAllBlogs: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  stats,
  recentBlogs,
  onCreateBlog,
  onViewBlog,
  onEditBlog,
  onViewAllBlogs,
}) => {
  // Determine dynamic greeting based on local time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-rose-100/70 via-pink-50/60 to-white p-6 sm:p-8 rounded-2xl border border-rose-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5 text-rose-600" />
            <span>Author Studio</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
            {greeting}, <span className="text-rose-600">{currentUser.full_name}</span>
          </h1>
          <p className="mt-1 text-sm text-stone-700">
            You have crafted <span className="font-semibold text-rose-700">{stats?.total_blogs || 0} blogs</span> totaling <span className="font-semibold text-stone-800">{(stats?.total_words || 0).toLocaleString()} words</span>.
          </p>
        </div>

        <button
          onClick={onCreateBlog}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-xl shadow-md shadow-rose-300/40 transition-all hover:scale-[1.02] active:scale-[0.98] self-start md:self-auto"
        >
          <PenTool className="h-4 w-4" />
          <span>Create New Blog</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/90 p-5 rounded-2xl border border-rose-200/70 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-700 uppercase tracking-wide">Total Blogs</span>
            <div className="h-8 w-8 rounded-lg bg-rose-100/80 flex items-center justify-center text-rose-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-editorial text-stone-900">{stats?.total_blogs || 0}</span>
            <span className="text-xs text-stone-700">articles</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-700">Persisted in PostgreSQL 18</p>
        </div>

        <div className="bg-white/90 p-5 rounded-2xl border border-rose-200/70 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-700 uppercase tracking-wide">Words Generated</span>
            <div className="h-8 w-8 rounded-lg bg-rose-100/80 flex items-center justify-center text-rose-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-editorial text-stone-900">
              {(stats?.total_words || 0).toLocaleString()}
            </span>
            <span className="text-xs text-stone-700">words</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-700">Avg {Math.round((stats?.total_words || 0) / Math.max(stats?.total_blogs || 1, 1))} words/blog</p>
        </div>

        <div className="bg-white/90 p-5 rounded-2xl border border-rose-200/70 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-700 uppercase tracking-wide">Published</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-editorial text-stone-900">{stats?.published_blogs || 0}</span>
            <span className="text-xs text-stone-700">ready to read</span>
          </div>
          <p className="mt-1 text-[11px] text-stone-700">Available for export & share</p>
        </div>

        <div className="bg-white/90 p-5 rounded-2xl border border-rose-200/70 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-700 uppercase tracking-wide">Top Domain</span>
            <div className="h-8 w-8 rounded-lg bg-rose-100/80 flex items-center justify-center text-rose-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold font-editorial text-stone-900 truncate">
              {stats?.top_category || 'Educational'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-stone-700">Primary writing specialization</p>
        </div>
      </div>

      {/* Recent Blogs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-stone-900">Recent Articles</h2>
            <p className="text-xs text-stone-700">Your latest AI-generated drafts and published works</p>
          </div>
          <button
            onClick={onViewAllBlogs}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            <span>View All ({stats?.total_blogs || 0})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {recentBlogs.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-rose-200 bg-white/60">
            <BookOpen className="h-10 w-10 text-rose-300 mx-auto mb-3" />
            <h3 className="font-editorial text-lg font-bold text-stone-800">Your story starts here.</h3>
            <p className="text-xs text-stone-700 mt-1 max-w-sm mx-auto">
              You haven't generated any blogs yet. Pick a topic and watch AI compose a publication-grade article.
            </p>
            <button
              onClick={onCreateBlog}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
            >
              Create Blog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBlogs.slice(0, 3).map((blog) => (
              <div
                key={blog.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-rose-200/80 bg-white/95 p-5 shadow-xs hover:shadow-md hover:border-rose-300 transition-all"
              >
                <div>
                  {blog.featured_image && (
                    <div className="overflow-hidden rounded-xl h-40 mb-4 bg-rose-50">
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Clean unboxed metadata with zero-pill discipline */}
                  <div className="flex items-center gap-2 text-xs text-stone-700 mb-2">
                    <span className="font-semibold text-rose-700">{blog.blog_type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{blog.tone}</span>
                    <span aria-hidden="true">·</span>
                    <span>{blog.word_count} words</span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-stone-900 group-hover:text-rose-950 transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="mt-2 text-xs text-stone-700 line-clamp-2 leading-relaxed">
                    {blog.subtitle || blog.topic}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-rose-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditBlog(blog)}
                      className="px-2.5 py-1 text-stone-700 hover:text-stone-900 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onViewBlog(blog)}
                      className="px-2.5 py-1 text-rose-600 font-semibold hover:bg-rose-50 rounded-md transition-colors"
                    >
                      Read
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
