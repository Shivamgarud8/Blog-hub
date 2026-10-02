import React, { useState } from 'react';
import { Sparkles, Wand2, Upload, X, Image as ImageIcon, ChevronDown, ChevronUp, Sliders, Languages, Users, Layers, MessageSquare, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { BlogGenerateRequest, User } from '../types';

interface CreateBlogStudioProps {
  currentUser: User | null;
  onGenerate: (req: BlogGenerateRequest) => Promise<void>;
  isGenerating: boolean;
}

export const CreateBlogStudio: React.FC<CreateBlogStudioProps> = ({
  currentUser,
  onGenerate,
  isGenerating,
}) => {
  // Topic
  const [topic, setTopic] = useState('');

  // Length
  const [blogLength, setBlogLength] = useState<'Short' | 'Medium' | 'Long' | 'Custom'>('Medium');
  const [customWordCount, setCustomWordCount] = useState<number>(1200);

  // Blog Type (14 cards)
  const blogTypes = [
    { id: 'Casual', desc: 'Relaxed & approachable' },
    { id: 'Technical', desc: 'Architecture & code deep-dives' },
    { id: 'Professional', desc: 'Industry executive insights' },
    { id: 'Storytelling', desc: 'Narrative arcs & human stakes' },
    { id: 'Educational', desc: 'Structured pedagogy & clarity' },
    { id: 'Advanced', desc: 'Specialized expert analysis' },
    { id: 'Beginner Friendly', desc: 'Intuitive zero-jargon guides' },
    { id: 'Tutorial', desc: 'Step-by-step practical walk-through' },
    { id: 'How-To', desc: 'Action-oriented implementation' },
    { id: 'Opinion', desc: 'Persuasive thought leadership' },
    { id: 'News Style', desc: 'Objective journalistic briefing' },
    { id: 'Research Style', desc: 'Data-grounded academic analysis' },
    { id: 'Marketing', desc: 'Compelling brand growth hooks' },
    { id: 'Creative', desc: 'Poetic, artistic & metaphorical' },
  ];
  const [selectedType, setSelectedType] = useState('Educational');

  // Tone (9 cards)
  const tones = [
    'Professional',
    'Friendly',
    'Casual',
    'Technical',
    'Educational',
    'Inspirational',
    'Creative',
    'Storytelling',
    'Conversational',
  ];
  const [selectedTone, setSelectedTone] = useState('Professional');

  // Audience (8 options)
  const audiences = [
    'Students',
    'Developers',
    'Professionals',
    'Business Owners',
    'General Audience',
    'Beginners',
    'Advanced Users',
    'Researchers',
  ];
  const [selectedAudience, setSelectedAudience] = useState('General Audience');

  // Language
  const languages = [
    { code: 'English', label: 'English (US/UK)' },
    { code: 'Hindi', label: 'हिन्दी (Hindi)' },
    { code: 'Spanish', label: 'Español' },
    { code: 'French', label: 'Français' },
    { code: 'German', label: 'Deutsch' },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Additional Details
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [importantPoints, setImportantPoints] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.full_name || '');

  // Image Uploads & Featured
  const [uploadedImages, setUploadedImages] = useState<{ url: string; name: string }[]>([]);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState<string | null>(null);
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);

  // Generation stages for realistic cinematic UX
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const sampleTopics = [
    'The future of artificial intelligence in healthcare',
    'Building resilient distributed architectures in 2026',
    'Mindful engineering: Balancing velocity with mental health',
    'The philosophy of clean code and functional design',
    'Quantum computing breakthroughs and real-world impacts',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      setImageError('You can upload a maximum of 5 images per blog.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setImageError(`Unsupported format '${file.name}'. Allowed: PNG, JPG, WEBP.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError(`File '${file.name}' exceeds the 5MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [
            ...prev,
            { url: event.target!.result as string, name: file.name },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateAiFeaturedImage = async () => {
    if (!topic.trim()) {
      setImageError('Please enter a topic first before generating a featured image.');
      return;
    }
    setIsGeneratingAiImage(true);
    setImageError(null);
    try {
      // Pick a curated image according to topic
      const curated = [
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      ];
      await new Promise((r) => setTimeout(r, 1000));
      const idx = Math.abs(topic.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % curated.length;
      setFeaturedImageUrl(curated[idx]);
    } catch {
      setImageError('Could not generate image. Please try again.');
    } finally {
      setIsGeneratingAiImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setImageError('Please enter a blog topic to generate.');
      return;
    }

    // Cycle stages during real generation
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < 4 ? prev + 1 : prev));
    }, 600);

    try {
      await onGenerate({
        topic: topic.trim(),
        blog_length: blogLength,
        custom_word_count: customWordCount,
        blog_type: selectedType,
        tone: selectedTone,
        target_audience: selectedAudience,
        language: selectedLanguage,
        keywords: keywords.trim() || undefined,
        important_points: importantPoints.trim() || undefined,
        additional_instructions: additionalInstructions.trim() || undefined,
        author_name: authorName.trim() || currentUser?.full_name,
        featured_image_url: featuredImageUrl || undefined,
        uploaded_image_urls: uploadedImages.map((img) => img.url),
      });
    } finally {
      clearInterval(interval);
      setCurrentStageIndex(0);
    }
  };

  const stages = [
    'Analyzing your topic and context...',
    'Structuring your narrative outline...',
    'Composing comprehensive body sections...',
    'Synthesizing real-world examples & case studies...',
    'Polishing editorial tone and key takeaways...',
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Generation Stage Overlay Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md transition-all">
          <div className="mx-4 max-w-md w-full rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-rose-200 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30">
              <Sparkles className="h-7 w-7 animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            <h3 className="font-editorial text-2xl font-bold text-stone-900">Crafting Your Masterpiece</h3>
            <p className="mt-2 text-xs font-medium text-rose-700 h-6">
              {stages[currentStageIndex]}
            </p>

            {/* Stage Indicators */}
            <div className="mt-6 flex justify-center gap-1.5">
              {stages.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= currentStageIndex ? 'w-8 bg-rose-500' : 'w-2 bg-rose-200'
                  }`}
                />
              ))}
            </div>

            <p className="mt-6 text-[11px] text-stone-600">
              Writing structured sections, verifying outline depth, and tuning cadence.
            </p>
          </div>
        </div>
      )}

      {/* Main Studio Card */}
      <div className="rounded-3xl border border-rose-200/80 bg-white/95 p-6 sm:p-10 shadow-xl shadow-rose-900/5 backdrop-blur-sm">
        {/* Header */}
        <div className="border-b border-rose-100 pb-6 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-2">
            <Wand2 className="h-4 w-4" />
            <span>AI Editorial Studio</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
            Generate an AI-Crafted Blog
          </h1>
          <p className="mt-2 text-sm text-stone-700">
            Define your topic, tone, and depth. BloomScript synthesizes publication-grade editorial articles with structured headings and persistent database storage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Topic Input */}
          <div className="space-y-3">
            <label htmlFor="topic-input" className="block text-sm font-semibold text-stone-900">
              Blog Topic <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The future of artificial intelligence in healthcare and clinical diagnosis..."
                required
                className="w-full rounded-xl border border-rose-200 bg-rose-50/20 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-600 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all"
              />
            </div>

            {/* Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-stone-700 mr-1">Inspirations:</span>
              {sampleTopics.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTopic(item)}
                  className="rounded-lg bg-rose-50/70 hover:bg-rose-100 px-2.5 py-1 text-xs text-rose-700 border border-rose-200/60 transition-colors"
                >
                  {item.length > 32 ? item.substring(0, 32) + '...' : item}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Blog Length */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-stone-900">
                Desired Article Length
              </label>
              {blogLength === 'Custom' && (
                <span className="text-xs font-semibold text-rose-600">
                  ~{customWordCount} words
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'Short', words: '~500 words', desc: 'Snackable brief' },
                { id: 'Medium', words: '~1000 words', desc: 'Standard editorial' },
                { id: 'Long', words: '~2000 words', desc: 'Comprehensive guide' },
                { id: 'Custom', words: '300 - 4000', desc: 'Custom slider' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBlogLength(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    blogLength === opt.id
                      ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-200 shadow-xs'
                      : 'border-rose-100 hover:border-rose-300 bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-stone-900">{opt.id}</p>
                  <p className="text-[11px] font-medium text-rose-600">{opt.words}</p>
                  <p className="text-[10px] text-stone-700 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            {blogLength === 'Custom' && (
              <div className="mt-3 p-4 rounded-xl bg-rose-50/30 border border-rose-100 space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>300 words (Micro-essay)</span>
                  <span className="font-bold text-rose-600">{customWordCount} words</span>
                  <span>4000 words (Whitepaper)</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="4000"
                  step="100"
                  value={customWordCount}
                  onChange={(e) => setCustomWordCount(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 3. Blog Type (14 Selectable Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-stone-900">
                Blog Style & Format
              </label>
              <span className="text-xs text-rose-600 font-medium">Selected: {selectedType}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {blogTypes.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-200'
                        : 'border-rose-100 hover:border-rose-200 bg-white'
                    }`}
                  >
                    <p className={`text-xs font-semibold ${isSelected ? 'text-rose-900' : 'text-stone-800'}`}>
                      {type.id}
                    </p>
                    <p className="text-[10px] text-stone-700 line-clamp-1 mt-0.5">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Tone & Audience Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tone */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-stone-900">
                Narrative Tone
              </label>
              <div className="grid grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTone(t)}
                    className={`py-2 px-2 text-center rounded-lg text-xs font-medium border transition-all ${
                      selectedTone === t
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white border-rose-200/80 text-stone-700 hover:bg-rose-50/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-stone-900">
                Target Audience
              </label>
              <div className="grid grid-cols-2 gap-2">
                {audiences.map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setSelectedAudience(aud)}
                    className={`py-2 px-3 text-left rounded-lg text-xs font-medium border transition-all truncate ${
                      selectedAudience === aud
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-white border-rose-200/80 text-stone-700 hover:bg-rose-50/50'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Language */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-stone-900">
              Language
            </label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedLanguage === lang.code
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white border-rose-200/80 text-stone-700 hover:bg-rose-50/50'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Featured Image and Image Uploads */}
          <div className="space-y-4 pt-2 border-t border-rose-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Visual Assets & Featured Image</h3>
                <p className="text-xs text-stone-700">Upload illustration photos or generate an AI concept</p>
              </div>
              <button
                type="button"
                onClick={handleGenerateAiFeaturedImage}
                disabled={isGeneratingAiImage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-100/70 hover:bg-rose-200/80 rounded-lg transition-all"
              >
                {isGeneratingAiImage ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                )}
                <span>Generate Featured Image</span>
              </button>
            </div>

            {/* Featured Image Preview if selected */}
            {featuredImageUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-rose-200 h-44 bg-stone-100">
                <img
                  src={featuredImageUrl}
                  alt="Featured Concept"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFeaturedImageUrl('')}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-2 left-3 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Active Featured Image
                </div>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div className="rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/20 p-6 text-center hover:border-rose-400 transition-colors">
              <Upload className="mx-auto h-8 w-8 text-rose-400 mb-2" />
              <p className="text-xs font-medium text-stone-700">
                Drag and drop your images here, or{' '}
                <label className="text-rose-600 font-semibold cursor-pointer hover:underline">
                  browse files
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp, image/jpg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-[11px] text-stone-700 mt-1">PNG, JPG, WEBP up to 5MB each (Max 5 images)</p>
            </div>

            {/* Uploaded images strip */}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative h-20 w-24 rounded-lg overflow-hidden border border-rose-200">
                    <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(idx)}
                      className="absolute top-1 right-1 p-0.5 bg-rose-600 text-white rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imageError && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}
          </div>

          {/* 7. Collapsible Advanced Instructions */}
          <div className="pt-2 border-t border-rose-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left py-2 text-xs font-semibold text-stone-700 hover:text-stone-900"
            >
              <span>Additional Editorial Instructions & SEO (Optional)</span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4 rounded-2xl bg-rose-50/30 p-5 border border-rose-100 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Primary & SEO Keywords
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="e.g., AI diagnostics, healthcare workflows, oncology"
                      className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Author Attribution Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g., Dr. Priya Sharma"
                      className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Key Points or Milestones to Cover
                  </label>
                  <textarea
                    rows={2}
                    value={importantPoints}
                    onChange={(e) => setImportantPoints(e.target.value)}
                    placeholder="e.g., Emphasize recent 2026 clinical trials, explain doctor-in-the-loop validation..."
                    className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Custom Editorial Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="e.g., Keep analogies intuitive, cite empirical studies, avoid overly technical jargon..."
                    className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="flex w-full items-center justify-center gap-2 py-4 px-6 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-800 rounded-2xl shadow-lg shadow-rose-300/50 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
            >
              <Wand2 className="h-5 w-5" />
              <span>Generate Structured Blog Post</span>
            </button>
            <p className="text-center text-[11px] text-stone-700 mt-2">
              Generates a structured outline, multi-section text, conclusion, and key takeaways stored directly in PostgreSQL 18.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
