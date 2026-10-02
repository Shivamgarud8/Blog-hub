import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, List, BookOpen, Trash2, Edit3, Download, RefreshCw, Eye, Plus, Calendar, Clock, Sparkles } from 'lucide-react';
import { Blog } from '../types';

interface MyBlogsViewProps {
  blogs: Blog[];
  onCreateBlog: () => void;
  onViewBlog: (blog: Blog) => void;
  onEditBlog: (blog: Blog) => void;
  onDeleteBlog: (blogId: number) => Promise<void>;
  onRegenerateBlog: (blog: Blog) => Promise<void>;
  onExportBlog: (blog: Blog) => void;
}

export const MyBlogsView: React.FC<MyBlogsViewProps> = ({
  blogs,
  onCreateBlog,
  onViewBlog,
  onEditBlog,
  onDeleteBlog,
  onRegenerateBlog,
  onExportBlog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);

  // Filter blogs
  const filtered = blogs.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === 'All' || b.blog_type.toLowerCase() === selectedType.toLowerCase();
    const matchStatus = selectedStatus === 'All' || b.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchSearch && matchType && matchStatus;
  });

  const handleDeleteConfirm = async (id: number) => {
    if (confirm('Are you sure you want to permanently delete this blog post from PostgreSQL?')) {
      setDeletingId(id);
      try {
        await onDeleteBlog(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleRegenerateClick = async (blog: Blog) => {
    setRegeneratingId(blog.id);
    try {
      await onRegenerateBlog(blog);
    } finally {
      setRegeneratingId(null);
    }
  };

  // Distinct blog types present in collection
  const availableTypes = ['All', ...Array.from(new Set(blogs.map((b) => b.blog_type)))];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-rose-100 pb-5">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-stone-900">My Articles</h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse, preview, export, or edit all your AI-generated and written articles
          </p>
        </div>

        <button
          onClick={onCreateBlog}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/90 p-3 rounded-2xl border border-rose-200/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, topic, or keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs text-stone-900 bg-rose-50/20 rounded-xl border border-rose-100 focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:border-rose-400"
          >
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Formats' : type}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:border-rose-400"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-1 border border-rose-100 rounded-xl p-0.5 bg-rose-50/40">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Blog Cards Display */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-rose-200 bg-white/70">
          <BookOpen className="h-12 w-12 text-rose-300 mx-auto mb-3" />
          <h3 className="font-editorial text-xl font-bold text-stone-800">
            {blogs.length === 0 ? 'Your story starts here.' : 'No matching articles found.'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {blogs.length === 0
              ? 'Create your first AI-powered blog with customizable depth, tone, and multi-format export.'
              : 'Try adjusting your search criteria or clearing filters to see existing drafts.'}
          </p>
          {blogs.length === 0 && (
            <button
              onClick={onCreateBlog}
              className="mt-5 px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
            >
              Create Blog
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((blog) => (
            <div
              key={blog.id}
              className="group flex flex-col justify-between rounded-2xl border border-rose-200/80 bg-white p-5 shadow-xs hover:shadow-md hover:border-rose-300 transition-all"
            >
              <div>
                {/* Thumbnail */}
                {blog.featured_image && (
                  <div className="overflow-hidden rounded-xl h-44 mb-4 bg-rose-50 cursor-pointer" onClick={() => onViewBlog(blog)}>
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Metadata - Zero Pill Discipline */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-rose-700">{blog.blog_type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{blog.tone}</span>
                  <span aria-hidden="true">·</span>
                  <span>{blog.word_count} words</span>
                </div>

                <h3
                  onClick={() => onViewBlog(blog)}
                  className="font-editorial text-lg font-bold text-stone-900 group-hover:text-rose-950 transition-colors line-clamp-2 leading-snug cursor-pointer"
                >
                  {blog.title}
                </h3>

                <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {blog.subtitle || blog.topic}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-rose-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-stone-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewBlog(blog)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Reading View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEditBlog(blog)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Edit Content"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRegenerateClick(blog)}
                    disabled={regeneratingId === blog.id}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Regenerate with AI"
                  >
                    <RefreshCw className={`h-4 w-4 ${regeneratingId === blog.id ? 'animate-spin text-rose-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => onExportBlog(blog)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Download Formats"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(blog.id)}
                    disabled={deletingId === blog.id}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border border-rose-200/80 bg-white overflow-hidden shadow-xs">
          <div className="divide-y divide-rose-100">
            {filtered.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-rose-50/30 transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  {blog.featured_image && (
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="h-14 w-20 rounded-lg object-cover border border-rose-100 shrink-0"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1">
                      <span className="font-semibold text-rose-700">{blog.blog_type}</span>
                      <span aria-hidden="true">·</span>
                      <span>{blog.tone}</span>
                      <span aria-hidden="true">·</span>
                      <span>{blog.word_count} words</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3
                      onClick={() => onViewBlog(blog)}
                      className="font-editorial text-base font-bold text-stone-900 hover:text-rose-900 cursor-pointer"
                    >
                      {blog.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => onViewBlog(blog)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => onEditBlog(blog)}
                    className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:bg-rose-50 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onExportBlog(blog)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-50 rounded-lg"
                    title="Export"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(blog.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
