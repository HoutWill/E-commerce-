import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

interface BannerSlide {
  id: string;
  image: string;
  alt: string;
}

export const PromoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const slides: BannerSlide[] = [
    {
      id: 'clawmachine',
      image: '/banner_classybling_clawmachine.png',
      alt: 'Classy Bling Rabbit Space Mini Arcade Claw Machine Special Promotion Banner'
    },
    {
      id: 'babythree',
      image: '/banner_classybling_babythree.png',
      alt: 'Classy Bling Baby Three Zodiac Blind Box Official Banner'
    },
    {
      id: 'nommi',
      image: '/banner_classybling_nommi.png',
      alt: 'Classy Bling Nommi Pinky Energy Plush Blind Box Official Banner'
    },
    {
      id: 'spacemolly',
      image: '/banner_classybling_spacemolly.png',
      alt: 'Classy Bling Mega Space Molly Blind Box Official Banner'
    }
  ];

  const totalSlides = slides.length;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  // 5-second interval timer with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handleBannerClick = () => {
    const el = document.getElementById('pop-now') || document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      next();
    } else if (diff < -50) {
      prev();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section
      className="w-full relative select-none"
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Container: Full Width Edge-to-Edge with compact height */}
      <div
        onClick={handleBannerClick}
        className="relative w-full aspect-[16/8] sm:aspect-[3.43/1] min-h-[160px] sm:min-h-[220px] md:min-h-[300px] lg:min-h-[340px] max-h-[420px] overflow-hidden bg-slate-100 dark:bg-zinc-900 group cursor-pointer border-b border-slate-200/80 dark:border-zinc-800"
      >
        {/* Slides */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              currentIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Left Arrow Navigation Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous Slide"
          className="hidden sm:flex absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
        >
          <ChevronLeft className="text-base sm:text-xl font-bold" />
        </button>

        {/* Right Arrow Navigation Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next Slide"
          className="hidden sm:flex absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
        >
          <ChevronRight className="text-base sm:text-xl font-bold" />
        </button>

        {/* Top-Right Slide Indicator Dots with Signature Red Active Pill */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-6 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 sm:px-2.5 py-1 rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all rounded-full cursor-pointer ${
                currentIndex === idx
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
