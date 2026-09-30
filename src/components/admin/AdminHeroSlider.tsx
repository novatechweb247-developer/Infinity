import React, { useState } from 'react';
import { UploadCloud, Check, Loader2 } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { HeroSlide } from '../../types';
import { ImageField } from './ImageField';

export function AdminHeroSlider() {
  const { draftContent, saveHeroSlides, publishDraft, isPublishing, showNotification } = useCMS();
  const rawSlides = Array.isArray(draftContent.heroSlides) ? draftContent.heroSlides : [];
  const [isPublishingLocal, setIsPublishingLocal] = useState(false);
  const [justPublished, setJustPublished] = useState(false);

  const handlePublishLiveNow = async () => {
    setIsPublishingLocal(true);
    const success = await publishDraft();
    setIsPublishingLocal(false);
    if (success) {
      setJustPublished(true);
      showNotification('✅ All 3 Hero slides published live across all browsers!', 'success');
      setTimeout(() => setJustPublished(false), 4000);
    }
  };

  // Exactly 3 slides: Slide 1, Slide 2, Slide 3
  const slides: HeroSlide[] = [
    rawSlides[0] || {
      id: 'slide-1',
      overline: 'Infinity Furnitures and Interior World Nigeria Limited',
      title: 'Design your space differently.',
      subtitle: 'Exceptional furniture and interior solutions crafted with timeless elegance.',
      primaryCtaText: 'Explore Collection',
      primaryCtaAction: 'collection',
      secondaryCtaText: 'Contact Us',
      secondaryCtaAction: 'contact',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85',
      enabled: true,
      order: 1,
    },
    rawSlides[1] || {
      id: 'slide-2',
      overline: 'Artisanal Woodworking & Seating',
      title: 'Craftsmanship that makes a statement.',
      subtitle: 'Handcrafted seating, tailored joinery, and sculptural pieces built to elevate refined contemporary living.',
      primaryCtaText: 'View Collection',
      primaryCtaAction: 'collection',
      secondaryCtaText: 'Contact Us',
      secondaryCtaAction: 'contact',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2000&q=85',
      enabled: true,
      order: 2,
    },
    rawSlides[2] || {
      id: 'slide-3',
      overline: 'Architectural Interiors',
      title: "We don't just furnish spaces. We transform them.",
      subtitle: 'From spatial planning to turnkey execution, our interior design solutions harmonize architectural rigor with emotional resonance.',
      primaryCtaText: 'Explore Interiors',
      primaryCtaAction: 'interiors',
      secondaryCtaText: 'Contact Us',
      secondaryCtaAction: 'contact',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85',
      enabled: true,
      order: 3,
    },
  ];

  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const activeEditingSlide = slides[activeSlideIndex] || slides[0];

  const handleUpdateActiveSlide = (updates: Partial<HeroSlide>) => {
    const newSlides = [...slides];
    newSlides[activeSlideIndex] = {
      ...newSlides[activeSlideIndex],
      ...updates,
      id: `slide-${activeSlideIndex + 1}`,
      order: activeSlideIndex + 1,
    };
    saveHeroSlides(newSlides);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#b89753] block">
            Visual Experience
          </span>
          <h2 className="text-2xl font-serif text-[#1a1a1a]">Hero Background Slides (3 Fixed Slides)</h2>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Configure Hero Slide 1, Slide 2, and Slide 3 independently. Use the "Save Draft" or "Publish Changes" button in the top bar to apply updates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Fixed 3 Slides Tabs */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block px-1">
            Hero Slides (Exactly 3)
          </span>
          {slides.map((slide, index) => {
            const isSelected = index === activeSlideIndex;
            const slideName = `Hero Slide ${index + 1}`;
            return (
              <div
                key={slide.id || `slide-${index + 1}`}
                onClick={() => setActiveSlideIndex(index)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 bg-white ${
                  isSelected
                    ? 'border-[#b89753] ring-4 ring-[#b89753]/15 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 flex items-center justify-center">
                    {slide.image ? (
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[8px] uppercase font-semibold text-neutral-400">Image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-[#1a1a1a] truncate">{slideName}</h4>
                    <p className="text-[11px] text-neutral-400 truncate">{slide.title}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Slide Editor Form */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#b89753] block">
                Independent Editor
              </span>
              <h3 className="text-lg font-serif text-[#1a1a1a]">
                Editing Hero Slide {activeSlideIndex + 1}
              </h3>
            </div>
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-medium">
              Slide {activeSlideIndex + 1} of 3
            </span>
          </div>

          <ImageField
            label={`Hero Slide ${activeSlideIndex + 1} Background Image`}
            value={activeEditingSlide.image || ''}
            onChange={(url) => handleUpdateActiveSlide({ image: url })}
            category="Hero"
          />

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
              Overline / Eyebrow Text
            </label>
            <input
              type="text"
              value={activeEditingSlide.overline || ''}
              onChange={(e) => handleUpdateActiveSlide({ overline: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#b89753]"
              placeholder="e.g. Infinity Furnitures and Interior World Nigeria Limited"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
              Main Headline Title
            </label>
            <input
              type="text"
              value={activeEditingSlide.title || ''}
              onChange={(e) => handleUpdateActiveSlide({ title: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-serif text-[#1a1a1a] focus:outline-none focus:border-[#b89753]"
              placeholder="e.g. Design your space differently."
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
              Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={activeEditingSlide.subtitle || ''}
              onChange={(e) => handleUpdateActiveSlide({ subtitle: e.target.value, description: e.target.value })}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#b89753] resize-none"
              placeholder="Exceptional furniture and interior solutions..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
                Primary Button Text
              </label>
              <input
                type="text"
                value={activeEditingSlide.primaryCtaText || ''}
                onChange={(e) => handleUpdateActiveSlide({ primaryCtaText: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#b89753]"
                placeholder="e.g. Explore Collection"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={activeEditingSlide.secondaryCtaText || ''}
                onChange={(e) => handleUpdateActiveSlide({ secondaryCtaText: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-[#1a1a1a] focus:outline-none focus:border-[#b89753]"
                placeholder="e.g. Contact Us"
              />
            </div>
          </div>

          {/* Direct Publish Live Bar */}
          <div className="pt-5 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-[11px] text-neutral-400">
              Editing Slide {activeSlideIndex + 1} of 3. Click below to publish updates live across all browsers and devices.
            </span>
            <button
              type="button"
              onClick={handlePublishLiveNow}
              disabled={isPublishing || isPublishingLocal}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                justPublished
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1a1a1a] text-white hover:bg-[#b89753] hover:text-[#1a1a1a]'
              } disabled:opacity-50`}
            >
              {justPublished ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Published Live!</span>
                </>
              ) : isPublishing || isPublishingLocal ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Publish Hero Slides Live</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
