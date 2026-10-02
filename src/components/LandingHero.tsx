import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Database, FileDown, BookOpen, Layers, Feather, Cpu, Image as ImageIcon } from 'lucide-react';

interface LandingHeroProps {
  onStartCreating: () => void;
  onExploreFeatures: () => void;
  onTryDemo: () => void;
  onPreviewSample: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartCreating,
  onExploreFeatures,
  onTryDemo,
  onPreviewSample,
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Cinematic ambient rose glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-rose-200/40 via-pink-100/30 to-amber-100/20 blur-3xl opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-[380px] w-[380px] rounded-full bg-rose-300/20 blur-2xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Sub-header Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 px-3.5 py-1 text-xs font-medium text-rose-800 border border-rose-200/80 shadow-xs mb-6 backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
            <span>FastAPI · PostgreSQL 18 · Dockerized · AI Editorial Studio</span>
          </div>

          {/* Cinematic Title */}
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-stone-900 max-w-4xl leading-[1.12]">
            Create Beautiful <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 italic">Blogs</span> With AI
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl text-stone-700 leading-relaxed font-sans">
            Turn your ideas into beautifully written, structured, and visually engaging blogs in seconds.
            Crafted for creators, engineers, and researchers with full database persistence and rich export.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onStartCreating}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-700 hover:to-rose-700 rounded-xl shadow-md shadow-rose-300/50 hover:shadow-lg hover:shadow-rose-300/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Start Creating</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onTryDemo}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-stone-800 bg-white/90 hover:bg-rose-50/80 border border-rose-200 rounded-xl shadow-xs hover:border-rose-300 transition-all"
            >
              <Feather className="h-4 w-4 text-rose-500" />
              <span>Try Demo Account</span>
            </button>

            <button
              onClick={onExploreFeatures}
              className="px-5 py-3 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
            >
              Explore Features
            </button>
          </div>

          {/* Trust points */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-700">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>JWT Authentication & Bcrypt</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="h-4 w-4 text-rose-500" />
              <span>PostgreSQL 18 Persistent Volume</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileDown className="h-4 w-4 text-rose-500" />
              <span>Export to PDF, HTML, Markdown, DOCX</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Sample Blog Card Preview */}
        <div className="mt-14 relative max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-rose-200/80 bg-white/95 p-4 sm:p-6 shadow-xl shadow-rose-900/5 backdrop-blur-sm">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-medium text-stone-600">Sample AI Generation Output</span>
              </div>
              <button
                onClick={onPreviewSample}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
              >
                <span>Read Full Article</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Sample Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1">
                <img
                  src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80"
                  alt="Generative AI"
                  className="w-full h-44 object-cover rounded-xl border border-rose-100 shadow-xs"
                />
              </div>
              <div className="md:col-span-2 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-700">
                  <span className="font-semibold text-rose-700">Technical</span>
                  <span aria-hidden="true">·</span>
                  <span>Inspirational Tone</span>
                  <span aria-hidden="true">·</span>
                  <span>4 min read</span>
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  The Renaissance of Generative Intelligence: Redefining Digital Craftsmanship
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 line-clamp-2">
                  How thoughtful human direction and neural synthesis are forging an unprecedented creative paradigm across modern engineering and writing...
                </p>
                <div className="pt-2 flex items-center justify-between text-xs text-stone-700">
                  <span>Author: Priya Sharma</span>
                  <span className="font-medium text-emerald-600">Generated in 2.1s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mt-20 sm:mt-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
              Crafted With Engineering Discipline & Editorial Taste
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              A complete system built from first principles with modern tools, clean architecture, and delightful aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="rounded-2xl border border-rose-200/70 bg-white/80 p-6 shadow-xs hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900 mb-2">Structured AI Prompt Engine</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Generates cohesive articles with magnetic headlines, engaging introductions, deeply developed sections, real-world examples, and synthesized takeaways.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-200/70 bg-white/80 p-6 shadow-xs hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900 mb-2">PostgreSQL 18 Persistence</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Real normalized schema with foreign keys, index optimization, and persistent Docker volume storage. Data survives container restarts and upgrades.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-200/70 bg-white/80 p-6 shadow-xs hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <ImageIcon className="h-5 w-5" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900 mb-2">Image Uploads & AI Visuals</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Drag-and-drop image uploads with MIME validation and size limits, plus AI-generated featured images tuned to your topic and tone.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-200/70 bg-white/80 p-6 shadow-xs hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <Feather className="h-5 w-5" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900 mb-2">Rich Text Studio Editor</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Intuitive WYSIWYG formatting with headings, blockquotes, code blocks, bullet points, live word counting, and instant read-time estimation.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-200/70 bg-white/80 p-6 shadow-xs hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <FileDown className="h-5 w-5" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900 mb-2">Multi-Format Export</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Export seamlessly to Markdown (.md), clean standalone HTML (.html), printable PDF (.pdf) with dedicated print stylesheet, and Word (.docx).
              </p>
            </div>

            <div className="rounded-2xl border border-rose-200/70 bg-white/80 p-6 shadow-xs hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-stone-900 mb-2">Bilingual: English & Hindi</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Native support for English and Hindi (हिन्दी) editorial prose, with easily extensible language profiles for international scaling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
