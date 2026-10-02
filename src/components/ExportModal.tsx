import React, { useState } from 'react';
import { X, FileText, Code, FileDown, Check, Printer } from 'lucide-react';
import { Blog } from '../types';

interface ExportModalProps {
  blog: Blog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ blog, isOpen, onClose }) => {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  if (!isOpen || !blog) return null;

  const triggerDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sanitizeFilename = (title: string, ext: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 40) + ext;
  };

  // 1. Markdown Export
  const handleExportMarkdown = () => {
    const md = `---
title: "${blog.title}"
subtitle: "${blog.subtitle || ''}"
author: "${blog.author_name || 'Author'}"
date: "${new Date(blog.created_at).toISOString().split('T')[0]}"
topic: "${blog.topic}"
type: "${blog.blog_type}"
tone: "${blog.tone}"
language: "${blog.language}"
word_count: ${blog.word_count}
featured_image: "${blog.featured_image || ''}"
---

# ${blog.title}

> *${blog.subtitle || ''}*

**Author:** ${blog.author_name || 'Author'}  
**Date:** ${new Date(blog.created_at).toLocaleDateString()}  
**Word Count:** ${blog.word_count} words  

${blog.featured_image ? `![Featured Image](${blog.featured_image})\n` : ''}

${blog.content}
`;
    triggerDownload(sanitizeFilename(blog.title, '.md'), md, 'text/markdown;charset=utf-8');
    setDownloadedFormat('markdown');
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  // 2. HTML Export
  const handleExportHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${blog.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", serif;
      max-width: 820px;
      margin: 40px auto;
      padding: 0 24px;
      line-height: 1.8;
      color: #1c1917;
      background: #fafaf9;
    }
    .container {
      background: white;
      padding: 48px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 2.5rem;
      margin-bottom: 0.25rem;
      color: #0c0a09;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 1.25rem;
      color: #57534e;
      font-style: italic;
      margin-bottom: 1.5rem;
    }
    .meta {
      font-size: 0.85rem;
      color: #78716c;
      border-bottom: 1px solid #f5f5f4;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    img.featured {
      width: 100%;
      max-height: 420px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    blockquote {
      border-left: 4px solid #f43f5e;
      background: #fff1f2;
      padding: 12px 20px;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      margin: 20px 0;
    }
    pre {
      background: #1c1917;
      color: #ffe4e6;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${blog.title}</h1>
    ${blog.subtitle ? `<div class="subtitle">${blog.subtitle}</div>` : ''}
    <div class="meta">By ${blog.author_name || 'Author'} · Published ${new Date(blog.created_at).toLocaleDateString()} · ${blog.word_count} words · Category: ${blog.blog_type}</div>
    ${blog.featured_image ? `<img src="${blog.featured_image}" class="featured" alt="${blog.title}">` : ''}
    <div class="content">
      ${blog.content.replace(/\n/g, '<br/>')}
    </div>
  </div>
</body>
</html>`;
    triggerDownload(sanitizeFilename(blog.title, '.html'), html, 'text/html;charset=utf-8');
    setDownloadedFormat('html');
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  // 3. PDF Export (High-Fidelity Printable Document)
  const handleExportPdf = () => {
    // Open a formatted print preview window that triggers the browser's native PDF generation
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups for this tab to generate your PDF document.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${blog.title} - PDF Export</title>
        <style>
          @page {
            margin: 20mm;
            size: A4 portrait;
          }
          body {
            font-family: 'Georgia', serif;
            color: #111;
            line-height: 1.7;
            padding: 0;
            margin: 0;
          }
          h1 {
            font-size: 28pt;
            margin-bottom: 6pt;
            line-height: 1.15;
            color: #000;
          }
          .subtitle {
            font-size: 14pt;
            color: #444;
            font-style: italic;
            margin-bottom: 14pt;
          }
          .meta {
            font-size: 10pt;
            color: #666;
            border-bottom: 1pt solid #ddd;
            padding-bottom: 8pt;
            margin-bottom: 18pt;
          }
          img.featured {
            max-width: 100%;
            height: auto;
            max-height: 260pt;
            object-fit: cover;
            border-radius: 4pt;
            margin-bottom: 18pt;
          }
          h2 {
            font-size: 18pt;
            margin-top: 18pt;
            margin-bottom: 8pt;
            border-bottom: 0.5pt solid #eee;
          }
          h3 {
            font-size: 13pt;
            margin-top: 12pt;
            margin-bottom: 4pt;
          }
          blockquote {
            border-left: 3pt solid #e11d48;
            padding-left: 10pt;
            margin-left: 0;
            color: #444;
            font-style: italic;
          }
          .footer {
            margin-top: 30pt;
            padding-top: 10pt;
            border-top: 0.5pt solid #ddd;
            font-size: 9pt;
            color: #888;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <h1>${blog.title}</h1>
        ${blog.subtitle ? `<div class="subtitle">${blog.subtitle}</div>` : ''}
        <div class="meta">By ${blog.author_name || 'Author'} | ${new Date(blog.created_at).toLocaleDateString()} | ${blog.word_count} words | ${blog.blog_type}</div>
        ${blog.featured_image ? `<img src="${blog.featured_image}" class="featured" />` : ''}
        <div>${blog.content.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')}</div>
        <div class="footer">
          <span>Generated with BloomScript AI Blog Studio</span>
          <span>PostgreSQL 18 Persistent Record #${blog.id}</span>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setDownloadedFormat('pdf');
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  // 4. DOCX / Rich Document Export
  const handleExportDocx = () => {
    // Generate an MS Word compliant XML / HTML-based doc file that opens natively in Microsoft Word, Google Docs, and LibreOffice
    const docxContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${blog.title}</title>
<style>
  body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.5; }
  h1 { font-size: 24pt; color: #1f2937; margin-bottom: 4pt; }
  .subtitle { font-size: 13pt; color: #4b5563; font-style: italic; margin-bottom: 12pt; }
  .meta { font-size: 9.5pt; color: #6b7280; margin-bottom: 20pt; border-bottom: 1pt solid #e5e7eb; padding-bottom: 8pt; }
  blockquote { border-left: 3pt solid #f43f5e; padding-left: 10pt; color: #374151; font-style: italic; }
</style>
</head>
<body>
  <h1>${blog.title}</h1>
  ${blog.subtitle ? `<div class="subtitle">${blog.subtitle}</div>` : ''}
  <div class="meta">Author: ${blog.author_name || 'Author'} | Date: ${new Date(blog.created_at).toLocaleDateString()} | Words: ${blog.word_count}</div>
  <div>${blog.content.replace(/\n/g, '<br/>')}</div>
</body>
</html>`;
    triggerDownload(sanitizeFilename(blog.title, '.doc'), docxContent, 'application/msword;charset=utf-8');
    setDownloadedFormat('docx');
    setTimeout(() => setDownloadedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-5">
          <div>
            <h3 className="font-editorial text-xl font-bold text-stone-900">Download & Export Blog</h3>
            <p className="text-xs text-stone-500">Choose your preferred format for publishing</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Markdown */}
          <button
            onClick={handleExportMarkdown}
            className="flex items-center justify-between w-full p-3.5 rounded-xl border border-rose-100 hover:border-rose-300 hover:bg-rose-50/50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                <Code className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Markdown (.md)</p>
                <p className="text-[11px] text-stone-500">With YAML frontmatter and headings</p>
              </div>
            </div>
            {downloadedFormat === 'markdown' ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <FileDown className="h-4 w-4 text-stone-400" />
            )}
          </button>

          {/* HTML */}
          <button
            onClick={handleExportHtml}
            className="flex items-center justify-between w-full p-3.5 rounded-xl border border-rose-100 hover:border-rose-300 hover:bg-rose-50/50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Styled HTML Document (.html)</p>
                <p className="text-[11px] text-stone-500">Self-contained editorial web page</p>
              </div>
            </div>
            {downloadedFormat === 'html' ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <FileDown className="h-4 w-4 text-stone-400" />
            )}
          </button>

          {/* PDF */}
          <button
            onClick={handleExportPdf}
            className="flex items-center justify-between w-full p-3.5 rounded-xl border border-rose-100 hover:border-rose-300 hover:bg-rose-50/50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                <Printer className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Printable PDF (.pdf)</p>
                <p className="text-[11px] text-stone-500">Clean typography with page break styles</p>
              </div>
            </div>
            {downloadedFormat === 'pdf' ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <FileDown className="h-4 w-4 text-stone-400" />
            )}
          </button>

          {/* Word DOCX */}
          <button
            onClick={handleExportDocx}
            className="flex items-center justify-between w-full p-3.5 rounded-xl border border-rose-100 hover:border-rose-300 hover:bg-rose-50/50 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Microsoft Word (.doc / .docx)</p>
                <p className="text-[11px] text-stone-500">Opens in Word, Google Docs & LibreOffice</p>
              </div>
            </div>
            {downloadedFormat === 'docx' ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <FileDown className="h-4 w-4 text-stone-400" />
            )}
          </button>
        </div>

        <div className="mt-6 border-t border-rose-100 pt-4 text-center">
          <p className="text-[11px] text-stone-400">
            Exported documents preserve title, subtitle, author, metadata, and images.
          </p>
        </div>
      </div>
    </div>
  );
};
