import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, Sparkles, X, ShieldCheck, Flame } from 'lucide-react';

interface PopBoxItem {
  id: string;
  name: string;
  series: string;
  brand: string;
  price: number;
  image: string;
  secretRate: string;
  description: string;
}

interface PopNowSectionProps {
  onModalChange?: (isOpen: boolean) => void;
}

export const PopNowSection: React.FC<PopNowSectionProps> = ({ onModalChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedBox, setSelectedBox] = useState<PopBoxItem | null>(null);

  useEffect(() => {
    onModalChange?.(Boolean(selectedBox));
  }, [selectedBox, onModalChange]);

  const popBoxes: PopBoxItem[] = [
    {
      id: 'baby_three_zodiac',
      name: 'Baby Three Zodiac Series - Vinyl Plush Pendant Blind Box',
      series: 'Baby Three Zodiac 12 Signs',
      brand: 'Baby Three',
      price: 12.50,
      image: '/3d_boxes/baby_three_zodiac_studio_box_1787476804515.jpg',
      secretRate: '1/72 Secret Chase (Golden Dragon)',
      description: 'Tactile plush doll with moving animated eyes, plush fur suit, and sealed foil blind bag.'
    },
    {
      id: 'mega_space_molly',
      name: 'MEGA SPACE MOLLY 100% Series 02 - Collector Blind Box',
      series: 'Space Molly Explorer Edition',
      brand: 'Pop Mart',
      price: 18.00,
      image: '/3d_boxes/mega_space_molly_box_1787473086799.jpg',
      secretRate: '1/144 Ultra Rare Galaxy Chase',
      description: 'Iconic space helmet with openable glass visor, metallic spacesuit paint, and movable blaster.'
    },
    {
      id: 'nommi_pinky_energy',
      name: 'Nommi Pinky Energy Series - Soft Plush Charm Blind Box',
      series: 'Nommi High Energy Collection',
      brand: 'TOP TOY x SURE FUN',
      price: 14.00,
      image: '/3d_boxes/nommi_pinky_energy_box_1787473059976.jpg',
      secretRate: '1/96 Secret Sweet Berry Chase',
      description: 'Super soft weighted plush charm with embroidered facial features and gold chain clasp.'
    },
    {
      id: 'baby_three_lolita',
      name: 'Baby Three Lolita Dream Series - Doll Plush Pendant Blind Box',
      series: 'Lolita Tea Party Edition',
      brand: 'Baby Three',
      price: 13.00,
      image: '/3d_boxes/baby_three_lolita_dream_box_1787473539024.jpg',
      secretRate: '1/72 Secret Royal Princess Chase',
      description: 'Delicate lace ruffled dress with bonnet, soft pastel colorway, and rotating liquid eyes.'
    },
    {
      id: 'molly_baking_time',
      name: 'Molly Baking Time Series - Vinyl Art Toy Blind Box',
      series: 'Molly Sweet Bakery',
      brand: 'Pop Mart',
      price: 15.50,
      image: '/3d_boxes/molly_baking_time_box_1787473509030.jpg',
      secretRate: '1/144 Golden Croissant Secret',
      description: 'Chef apron and bakery utensils accessory kit with detailed matte vinyl finish.'
    },
    {
      id: 'stitch_sleep_box',
      name: 'Disney Stitch Sweet Dreams - Plush Pendant Blind Box',
      series: 'Stitch Sleepy Series',
      brand: 'Disney x Pop Mart',
      price: 13.50,
      image: '/3d_boxes/stitch_sleep_box_1787473179186.jpg',
      secretRate: '1/72 Sleeping Nightcap Chase',
      description: 'Plush sleepy stitch with pajama cap, soft pillow accessory, and authentic Disney hologram seal.'
    },
    {
      id: 'baby_molly_baby_tabby',
      name: 'Baby Molly Baby Tabby Series - Vinyl Figure Blind Box',
      series: 'Baby Molly Kitten Club',
      brand: 'Pop Mart',
      price: 16.00,
      image: '/3d_boxes/baby_molly_baby_tabby_box_1787473570037.jpg',
      secretRate: '1/144 Calico Cat Secret',
      description: 'Cute kitten ears hoodie with baby pacifier and soft flocked tail.'
    },
    {
      id: 'yumi_edm_festival',
      name: 'Yumi EDM Festival Series - Cyber Vinyl Blind Box',
      series: 'Yumi Neon Beats',
      brand: 'Yumi Studio',
      price: 15.00,
      image: '/3d_boxes/yumi_edm_festival_box_1787473599903.jpg',
      secretRate: '1/96 Holographic DJ Secret',
      description: 'Glow-in-the-dark headphones and neon rave outfit with UV reactive paint.'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleExploreMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8" id="pop-now">
      
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-5 sm:mb-8 space-y-1.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Red POP NOW badge */}
          <div className="px-2 py-0.5 sm:py-1 rounded bg-[#E50012] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current" />
            <span>POP NOW</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-display">
            POP NOW Drops
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#catalog"
            onClick={handleExploreMore}
            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            Explore More Series &gt;
          </a>
        </div>
      </div>

      {/* Pop Up Carousel Container */}
      <div className="relative group">
        
        {/* Left Arrow Button (Desktop/Tablet) */}
        <button
          onClick={() => scroll('left')}
          aria-label="Previous Blind Box"
          className="hidden sm:flex absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 shadow-md border border-slate-200 dark:border-zinc-700 items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button (Desktop/Tablet) */}
        <button
          onClick={() => scroll('right')}
          aria-label="Next Blind Box"
          className="hidden sm:flex absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 shadow-md border border-slate-200 dark:border-zinc-700 items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 px-1 scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {popBoxes.map((box) => (
            <div
              key={box.id}
              className="snap-start shrink-0 w-[210px] sm:w-[270px] flex flex-col items-center text-center group/card cursor-pointer bg-slate-50/60 dark:bg-zinc-900/40 p-3 sm:p-4 rounded-2xl border border-slate-200/70 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
              onClick={() => setSelectedBox(box)}
            >
              {/* Product Box Image Container */}
              <div className="relative aspect-[3/4] w-full rounded-xl bg-white dark:bg-zinc-950 p-2 sm:p-3 flex items-center justify-center mb-3 transition-all duration-300 transform group-hover/card:-translate-y-2 group-hover/card:scale-102 border border-slate-200/60 dark:border-zinc-800/60 shadow-xs">
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-full h-full object-contain filter drop-shadow-md group-hover/card:drop-shadow-xl transition-all"
                  loading="lazy"
                />
              </div>

              {/* Product Title */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 line-clamp-2 px-1 mb-1.5 leading-snug min-h-[32px] sm:min-h-[36px]">
                {box.name}
              </h3>

              {/* Price Tag ($XX.XX / PICK) */}
              <div className="text-xs sm:text-base font-black text-slate-900 dark:text-white mb-2.5 flex items-center justify-center gap-1">
                <span>${box.price.toFixed(2)}</span>
                <span className="text-[10px] sm:text-xs font-bold text-[#229ED9]">
                  ({Math.round(box.price * 4100).toLocaleString()} ៛)
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBox(box);
                }}
                className="w-full py-2 px-3 rounded-xl border border-slate-900 dark:border-zinc-300 bg-transparent text-slate-900 dark:text-zinc-100 text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-slate-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-slate-900 transition-all active:scale-95 shadow-xs"
              >
                Pick Now
              </button>

            </div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-center gap-1 text-[11px] font-medium text-slate-400 dark:text-zinc-500 pt-1">
          <span>← Swipe to discover more series →</span>
        </div>

      </div>

      {/* Pop Up Inspection Modal */}
      {selectedBox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 dark:bg-black/90 backdrop-blur-md animate-fade-in select-none"
          onClick={() => setSelectedBox(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/90 dark:bg-zinc-950/90 shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="px-2 py-0.5 rounded bg-[#E50012] text-white text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>POP NOW</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    {selectedBox.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 line-clamp-1">
                    {selectedBox.brand} • {selectedBox.series}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBox(null)}
                aria-label="Close modal"
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:items-center no-scrollbar">
              
              {/* Product Box Showcase */}
              <div className="w-full max-h-[240px] sm:max-h-[340px] aspect-square rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-slate-100 dark:from-zinc-950 dark:to-zinc-900 border border-slate-200/80 dark:border-zinc-800 p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-inner relative group">
                <img
                  src={selectedBox.image}
                  alt={selectedBox.name}
                  className="w-full h-full object-contain filter drop-shadow-xl transform hover:scale-105 transition-transform"
                />

                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Sealed Box</span>
                </div>
              </div>

              {/* Box Details & Telegram Direct Pick */}
              <div className="space-y-3.5 sm:space-y-4 flex flex-col justify-between pt-1">
                
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-black text-[#E50012] uppercase tracking-wider">
                      {selectedBox.brand}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold">
                      {selectedBox.series}
                    </span>
                  </div>
                  
                  <h4 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedBox.name}
                  </h4>
                  
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    {selectedBox.description}
                  </p>
                </div>

                {/* Chase Rate & Authenticity */}
                <div className="space-y-1.5 sm:space-y-2 p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-[11px] sm:text-xs">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedBox.secretRate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] sm:text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>100% Genuine Sealed Factory Box</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 flex items-center justify-between">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      ${selectedBox.price.toFixed(2)} USD
                    </div>
                    <div className="text-xs font-black text-[#229ED9]">
                      ~ {Math.round(selectedBox.price * 4100).toLocaleString()} ៛
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-tight text-right">
                    Direct Pick
                  </span>
                </div>

                {/* Action Order Button */}
                <div className="pt-1">
                  <a
                    href={`https://t.me/+85592917831?text=${encodeURIComponent(
                      `Hello Classy Bling! I want to Pick & Unbox:\n📦 Product: ${selectedBox.name}\n💰 Price: $${selectedBox.price.toFixed(2)} USD (~${Math.round(selectedBox.price * 4100).toLocaleString()} ៛)\nSeries: ${selectedBox.series}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1d8cc2] text-white font-black text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.98] min-h-[48px]"
                  >
                    <Send className="w-4 h-4 fill-current" />
                    <span>Pick & Order on Telegram</span>
                  </a>
                  <p className="text-[10px] sm:text-[11px] text-center text-slate-400 dark:text-zinc-500 font-medium mt-1.5">
                    Fast Telegram dispatch • Instant verification
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};
