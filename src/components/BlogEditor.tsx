import React, { useState, useRef } from 'react';
import { Bold, Italic, Heading1, Heading2, Heading3, Quote, List, ListOrdered, Code, Image as ImageIcon, Link as LinkIcon, Undo, Redo, Save, Eye, ArrowLeft, Check, Sparkles, Clock, FileText } from 'lucide-react';
import { Blog } from '../types';

interface BlogEditorProps {
  blog: Blog;
  onSave: (updatedBlog: Partial<Blog>) => Promise<void>;
  onPreview: (blog: Blog) => void;
  onBack: () => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  blog,
  onSave,
  onPreview,
  onBack,
}) => {
  const [title, setTitle] = useState(blog.title);
  const [subtitle, setSubtitle] = useState(blog.subtitle || '');
  const [content, setContent] = useState(blog.content);
  const [featuredImage, setFeaturedImage] = useState(blog.featured_image || '');
  const [status, setStatus] = useState<'draft' | 'published'>(blog.status);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Calculate live stats
  const words = content.match(/\b\w+\b/g)?.length || 0;
  const characters = content.length;
  const readMinutes = Math.max(1, Math.ceil(words / 200));

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 10);
  };

  const handleSave = async (newStatus?: 'draft' | 'published') => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      const targetStatus = newStatus || status;
      await onSave({
        title,
        subtitle,
        content,
        featured_image: featuredImage,
        status: targetStatus,
      });
      if (newStatus) setStatus(newStatus);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewClick = () => {
    onPreview({
      ...blog,
      title,
      subtitle,
      content,
      featured_image: featuredImage,
      word_count: words,
      status,
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-100 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center gap-2.5">
          {savedSuccess && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <Check className="h-3.5 w-3.5" />
              <span>Saved successfully</span>
            </span>
          )}

          {/* Status selector */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 focus:outline-none focus:border-rose-400"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          {/* Preview button */}
          <button
            onClick={handlePreviewClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-stone-800 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg shadow-xs transition-all"
          >
            <Eye className="h-3.5 w-3.5 text-rose-500" />
            <span>Reading View</span>
          </button>

          {/* Save button */}
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="rounded-3xl border border-rose-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-rose-900/5">
        {/* Title & Subtitle */}
        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post Title..."
            className="w-full font-editorial text-2xl sm:text-4xl font-bold text-stone-900 border-none px-0 py-1 focus:outline-none focus:ring-0 placeholder:text-stone-300"
          />

          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Add an evocative subtitle or thesis..."
            className="w-full text-base sm:text-lg text-stone-500 italic border-none px-0 py-1 focus:outline-none focus:ring-0 placeholder:text-stone-300"
          />
        </div>

        {/* Featured Image URL Input */}
        <div className="mb-6 flex items-center gap-3 p-3 bg-rose-50/40 rounded-xl border border-rose-100 text-xs">
          <ImageIcon className="h-4 w-4 text-rose-500 shrink-0" />
          <span className="font-medium text-stone-600 shrink-0">Featured Image URL:</span>
          <input
            type="text"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-transparent border-none text-xs text-stone-800 focus:outline-none placeholder:text-stone-400"
          />
        </div>

        {/* Formatting Toolbar */}
        <div className="sticky top-16 z-20 mb-4 flex flex-wrap items-center gap-1 rounded-xl border border-rose-200/80 bg-stone-50/90 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => insertFormatting('# ')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('## ')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('### ')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors"
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-stone-300 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors font-bold"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors italic"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-stone-300 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting('> ')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('- ')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors"
            title="Bullet list"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('1. ')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors"
            title="Numbered list"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('```\n', '\n```')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors"
            title="Code block"
          >
            <Code className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-stone-300 mx-1" />
          <button
            type="button"
            onClick={() => insertFormatting('[Link text](', ')')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors"
            title="Insert link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('![Image alt](', ')')}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-rose-100 rounded transition-colors"
            title="Insert image markdown"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Main Content Area */}
        <textarea
          ref={textareaRef}
          rows={22}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Compose your editorial article here..."
          className="w-full resize-y rounded-xl border border-rose-100 bg-transparent p-4 text-sm sm:text-base text-stone-800 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
        />

        {/* Footer Stats Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-rose-100 pt-4 text-xs text-stone-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-stone-400" />
              <span>{words} words</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{characters} characters</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-stone-400" />
              <span>~{readMinutes} min read</span>
            </span>
          </div>

          <div className="text-[11px] text-stone-400">
            Formatted in Markdown · Live synced with PostgreSQL 18
          </div>
        </div>
      </div>
    </div>
  );
};
