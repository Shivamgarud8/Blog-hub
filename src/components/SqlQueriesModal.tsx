import React, { useState } from 'react';
import { X, Database, Copy, Check, Terminal, Server, Shield } from 'lucide-react';

interface SqlQueriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlQueriesModal: React.FC<SqlQueriesModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const queries = [
    {
      title: '1. Connect to PostgreSQL 18 via Docker',
      type: 'bash',
      code: 'docker exec -it blog-gen-postgres psql -U blog_user -d blog_gen',
      desc: 'Interactive psql prompt directly inside the running container.',
    },
    {
      title: '2. List all Tables in Database',
      type: 'sql',
      code: '\\dt+',
      desc: 'Shows users, blogs, and blog_images with disk sizes.',
    },
    {
      title: '3. Describe Users Table Schema',
      type: 'sql',
      code: '\\d+ users',
      desc: 'Inspect columns, types, indexes, and constraints.',
    },
    {
      title: '4. Describe Blogs Table Schema',
      type: 'sql',
      code: '\\d+ blogs',
      desc: 'Inspect blog table schema and foreign keys.',
    },
    {
      title: '5. Select All Users (Sanitized - No Password Hashes)',
      type: 'sql',
      code: 'SELECT id, full_name, email, mobile_number, profession, gender, age, is_active, created_at FROM users ORDER BY id ASC;',
      desc: 'Fetches all registered accounts safely.',
    },
    {
      title: '6. Select Recent Blogs with Word Counts',
      type: 'sql',
      code: 'SELECT id, user_id, title, blog_type, tone, language, word_count, created_at FROM blogs ORDER BY created_at DESC LIMIT 10;',
      desc: 'Fetches most recent blogs created with word count and metadata.',
    },
    {
      title: '7. Relational JOIN: Blogs with Author Profile',
      type: 'sql',
      code: `SELECT 
    b.id AS blog_id, 
    b.title, 
    b.blog_type, 
    b.word_count, 
    u.full_name AS author_name, 
    u.email AS author_email, 
    b.created_at AS published_at 
FROM blogs b
INNER JOIN users u ON b.user_id = u.id
ORDER BY b.created_at DESC;`,
      desc: 'Demonstrates foreign key relational join between blogs and users.',
    },
    {
      title: '8. Author Aggregate Metrics (Top Creators)',
      type: 'sql',
      code: `SELECT 
    u.id AS user_id, 
    u.full_name, 
    COUNT(b.id) AS total_blogs, 
    COALESCE(SUM(b.word_count), 0) AS total_words_written 
FROM users u
LEFT JOIN blogs b ON u.id = b.user_id
GROUP BY u.id, u.full_name
ORDER BY total_blogs DESC;`,
      desc: 'Group by aggregation calculating total output per creator.',
    },
    {
      title: '9. Check Database Size on Disk',
      type: 'sql',
      code: "SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size_pretty FROM pg_database WHERE datname = 'blog_gen';",
      desc: 'Displays storage footprint of the persistent postgres_data volume.',
    },
    {
      title: '10. Create Full Database Backup Dump',
      type: 'bash',
      code: 'docker exec blog-gen-postgres pg_dump -U blog_user -d blog_gen > blog_gen_backup.sql',
      desc: 'Dumps entire schema and relational rows to host disk.',
    },
    {
      title: '11. Restore Database from Dump',
      type: 'bash',
      code: 'cat blog_gen_backup.sql | docker exec -i blog-gen-postgres psql -U blog_user -d blog_gen',
      desc: 'Restores schema and data seamlessly.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-rose-200 my-8 max-h-[88vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-xs">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-stone-900">PostgreSQL 18 Query Handbook</h3>
              <p className="text-xs text-stone-500">Live query snippets & commands documented from query.md</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Security and Persistence Callout */}
        <div className="mb-4 flex items-center gap-3 p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-xs text-stone-700">
          <Shield className="h-4 w-4 text-rose-600 shrink-0" />
          <div>
            <span>PostgreSQL 18 container runs on internal Docker network. Persistent volume: </span>
            <code className="font-mono bg-white px-1 py-0.5 rounded text-rose-700 font-bold">postgres_data</code>
            <span>. Password hashes are never shown in sample logs.</span>
          </div>
        </div>

        {/* Query list */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {queries.map((q, idx) => (
            <div key={idx} className="rounded-xl border border-stone-200 bg-stone-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">{q.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-200 text-stone-700 rounded">
                  {q.type.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-stone-600">{q.desc}</p>
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-stone-950 p-3 text-xs font-mono text-rose-100 pr-10">
                  <code>{q.code}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(q.code, idx)}
                  className="absolute right-2 top-2 p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors"
                  title="Copy command"
                >
                  {copiedIndex === idx ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-stone-500">
          <span>Complete administration guide available in project root: query.md</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
          >
            Close Handbook
          </button>
        </div>
      </div>
    </div>
  );
};
