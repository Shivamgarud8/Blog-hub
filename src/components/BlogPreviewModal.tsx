import React from 'react';
import { X, Calendar, Clock, User, Download, Edit3, Share2, Sparkles, BookOpen } from 'lucide-react';
import { Blog } from '../types';

interface BlogPreviewModalProps {
  blog: Blog | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (blog: Blog) => void;
  onOpenExport: (blog: Blog) => void;
}

export const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({
  blog,
  isOpen,
  onClose,
  onEdit,
  onOpenExport,
}) => {
  if (!isOpen || !blog) return null;

  const readMinutes = Math.max(1, Math.ceil(blog.word_count / 200));

  // Render markdown with high aesthetic typography
  const renderFormattedMarkdown = (raw: string) => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="my-4 overflow-x-auto rounded-xl bg-stone-900 p-4 text-xs text-rose-100 font-mono shadow-inner">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }
      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Markdown Headings
      if (line.startsWith('# ')) {
        // Skip first H1 if it repeats title
        if (index > 2) {
          elements.push(
            <h1 key={index} className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 mt-8 mb-4">
              {line.replace('# ', '')}
            </h1>
          );
        }
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-8 mb-3 pb-1 border-b border-rose-100">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="font-editorial text-xl font-bold text-stone-800 mt-6 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="my-4 border-l-4 border-rose-500 bg-rose-50/50 py-3 px-5 text-sm sm:text-base italic text-stone-700 rounded-r-xl">
            {line.replace('> ', '').replace(/\*/g, '')}
          </blockquote>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={index} className="ml-4 list-disc text-sm sm:text-base text-stone-700 my-1 leading-relaxed">
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      } else if (line.trim().startsWith('![') && line.includes('](')) {
        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          elements.push(
            <div key={index} className="my-6 overflow-hidden rounded-2xl border border-rose-200 shadow-sm">
              <img src={match[2]} alt={match[1]} className="w-full object-cover max-h-96" />
              {match[1] && <p className="p-2 text-center text-xs text-stone-500 italic bg-rose-50/40">{match[1]}</p>}
            </div>
          );
        }
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={index} className="my-3 text-sm sm:text-base text-stone-800 leading-relaxed font-sans">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm p-4 sm:p-6 lg:p-10 flex justify-center">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-rose-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Sticky Action Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-rose-100 bg-white/95 px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-rose-600 uppercase tracking-wider">Reading View</span>
            <span aria-hidden="true">·</span>
            <span>{blog.language}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(blog)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5 text-stone-500" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onOpenExport(blog)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <article className="p-6 sm:p-12 max-w-3xl mx-auto space-y-6">
          {/* Metadata Section - Zero-pill compliant */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 pb-2">
            <span className="font-semibold text-rose-700">{blog.blog_type}</span>
            <span aria-hidden="true">·</span>
            <span>{blog.tone} Tone</span>
            <span aria-hidden="true">·</span>
            <span>Audience: {blog.target_audience}</span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-[1.18]">
            {blog.title}
          </h1>

          {/* Subtitle */}
          {blog.subtitle && (
            <p className="text-lg sm:text-xl text-stone-600 font-sans leading-relaxed italic border-l-2 border-rose-300 pl-4">
              {blog.subtitle}
            </p>
          )}

          {/* Author Card & Meta */}
          <div className="flex items-center justify-between py-4 border-y border-rose-100 text-xs text-stone-600">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                {blog.author_name ? blog.author_name[0] : 'P'}
              </div>
              <div>
                <p className="font-semibold text-stone-900">{blog.author_name || 'Editorial Contributor'}</p>
                <div className="flex items-center gap-2 text-stone-500 text-[11px]">
                  <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span aria-hidden="true">·</span>
                  <span>~{readMinutes} min read</span>
                  <span aria-hidden="true">·</span>
                  <span>{blog.word_count} words</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenExport(blog)}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Formats</span>
            </button>
          </div>

          {/* Featured Hero Image */}
          {blog.featured_image && (
            <div className="my-6 overflow-hidden rounded-2xl border border-rose-100 shadow-md">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          )}

          {/* Formatted Content */}
          <div className="prose prose-stone max-w-none pt-2 font-sans text-stone-800">
            {renderFormattedMarkdown(blog.content)}
          </div>

          {/* Keywords / Tags - Zero Pill Discipline */}
          {blog.keywords && (
            <div className="pt-8 border-t border-rose-100">
              <div className="text-xs text-stone-500 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-stone-700">Tags:</span>
                {blog.keywords.split(',').map((kw, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="text-rose-600 hover:underline cursor-pointer">{kw.trim()}</span>
                    {i < arr.length - 1 && <span aria-hidden="true">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
