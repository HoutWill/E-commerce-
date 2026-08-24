import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  image: string;
  title: string;
  alt: string;
  targetId: string;
}

export const PromoCarousel: React.FC = () => {
  const slides: BannerSlide[] = [
    {
      id: 'classybling-baby-three',
      image: '/banner_classybling_babythree.png',
      title: 'Baby Three Zodiac & Plush Series Drop',
      alt: 'Classy Bling Baby Three Zodiac Blind Box Official Banner',
      targetId: 'pop-now'
    },
    {
      id: 'classybling-nommi-plush',
      image: '/banner_classybling_nommi.png',
      title: 'Nommi Pinky Energy & Disney Stitch Plush Drops',
      alt: 'Classy Bling Nommi Pinky Energy Plush Blind Box Official Banner',
      targetId: 'pop-now'
    },
    {
      id: 'classybling-space-molly',
      image: '/banner_classybling_spacemolly.png',
      title: 'Mega Space Molly 100% & Pop Mart Drops',
      alt: 'Classy Bling Mega Space Molly Blind Box Official Banner',
      targetId: 'pop-now'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const handleBannerClick = () => {
    const el = document.getElementById(slides[currentIndex].targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="w-full relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-1 sm:pb-2 select-none"
      id="promotions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Container with Touch Swipe */}
      <div
        onClick={handleBannerClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[16/9] sm:aspect-[2.39/1] min-h-[170px] sm:min-h-[280px] md:min-h-[360px] rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-md bg-slate-100 dark:bg-zinc-900 group cursor-pointer"
      >
        {/* Slides Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        ))}

        {/* Left Arrow Navigation (visible on hover / tablet+) */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="hidden sm:flex absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Navigation (visible on hover / tablet+) */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="hidden sm:flex absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Top-Right Slide Indicator Dots */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-6 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 sm:px-2.5 py-1 rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all rounded-full ${
                idx === currentIndex
                  ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-[#E50012]'
                  : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
