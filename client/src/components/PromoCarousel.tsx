import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'react-bootstrap-icons';
import { api } from '../services/api';

export const PromoCarousel: React.FC = () => {
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(false);
  const [announcementText, setAnnouncementText] = useState<string>('');

  useEffect(() => {
    api.getSettings().then((data) => {
      if (data && typeof data === 'object') {
        if (typeof data.showAnnouncement === 'boolean') setShowAnnouncement(data.showAnnouncement);
        if (typeof data.announcementText === 'string') setAnnouncementText(data.announcementText);
      }
    }).catch(() => {});
  }, []);

  const scrollToCatalog = (category?: string) => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredCollections = [
    {
      title: 'Plush Dolls & Keychains',
      subtitle: 'Baby Three, Nommi, Disney Stitch',
      tag: 'VIRAL UNBOXING',
      image: '/3d_boxes/baby_three_bunny_box_ai.jpg'
    },
    {
      title: 'Space Molly & Blind Box',
      subtitle: 'Pop Mart 100% Sealed Series',
      tag: 'NEW RELEASE',
      image: '/3d_boxes/mega_space_molly_box_1787473086799.jpg'
    },
    {
      title: 'Desktop Arcade & Toys',
      subtitle: 'Rabbit Space Claw Machine & Limited Drops',
      tag: 'LIMITED EDITION',
      image: '/3d_boxes/claw_machine_rabbit_space_ai.jpg'
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2" id="hero">
      
      {/* Optional Announcement Banner */}
      {showAnnouncement && announcementText && announcementText.trim() !== '' && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#F5F3EF] dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] text-center">
          <p className="text-xs sm:text-sm font-medium text-[#71717A] dark:text-[#A1A1AA] leading-relaxed max-w-3xl mx-auto">
            {announcementText}
          </p>
        </div>
      )}

      {/* Hero Card: Clean, Purposeful Editorial Showcase */}
      <div className="w-full rounded-2xl bg-[#F5F3EF] dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] overflow-hidden p-6 sm:p-10 lg:p-12 transition-all">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Text Content */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8C7E72] dark:text-[#A1A1AA]">
                Curated Drops · 100% Genuine Sealed
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1A1A] dark:text-[#F4F4F5] leading-[1.15]">
              Curated Designer Toys & Sealed Blind Boxes
            </h1>

            <p className="text-sm sm:text-base text-[#71717A] dark:text-[#A1A1AA] max-w-xl leading-relaxed font-normal">
              Directly indexed from @classy.bling TikTok unboxings. Rare secret chase editions, authentic Pop Mart vinyl art figures, and collectible plush dolls.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToCatalog()}
                className="px-5 py-2.5 rounded-lg bg-[#C25E3E] hover:bg-[#A94F32] text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const popNowEl = document.getElementById('pop-now');
                  if (popNowEl) popNowEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-lg bg-transparent hover:bg-[#EAE7E1]/50 dark:hover:bg-[#2C2C30]/50 text-[#1A1A1A] dark:text-[#F4F4F5] border border-[#D6D2C9] dark:border-[#3F3F46] text-sm font-semibold transition-colors cursor-pointer"
              >
                POP NOW Drops
              </button>
            </div>
          </div>

          {/* Focal Product Photography */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[340px] sm:max-w-[380px] rounded-xl overflow-hidden bg-white dark:bg-[#202024] border border-[#EAE7E1] dark:border-[#2C2C30] shadow-xs flex items-center justify-center p-4">
              <img
                src="/3d_boxes/claw_machine_rabbit_space_ai.jpg"
                alt="Rabbit Space Mini Claw Machine"
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg bg-white/95 dark:bg-[#18181B]/95 border border-[#EAE7E1] dark:border-[#2C2C30] flex items-center justify-between shadow-2xs backdrop-blur-xs">
                <div>
                  <div className="text-[10px] font-semibold text-[#8C7E72] dark:text-[#A1A1AA] uppercase tracking-wider">NEW ARRIVAL</div>
                  <div className="text-xs font-bold text-[#1A1A1A] dark:text-[#F4F4F5] line-clamp-1">Rabbit Space Claw Machine</div>
                </div>
                <div className="text-sm font-extrabold text-[#C25E3E]">$25.00</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Featured Collections Immediately Below Hero */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
        {featuredCollections.map((col, idx) => (
          <div
            key={idx}
            onClick={() => scrollToCatalog()}
            className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] hover:border-[#D6D2C9] dark:hover:border-[#3F3F46] transition-all flex items-center justify-between gap-3 shadow-2xs"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8C7E72] dark:text-[#A1A1AA] tracking-wider uppercase">
                {col.tag}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#C25E3E] transition-colors line-clamp-1">
                {col.title}
              </h4>
              <p className="text-[11px] text-[#71717A] dark:text-[#A1A1AA] line-clamp-1 font-normal">
                {col.subtitle}
              </p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#F5F3EF] dark:bg-[#202024] border border-[#EAE7E1] dark:border-[#2C2C30] shrink-0 overflow-hidden p-1">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
