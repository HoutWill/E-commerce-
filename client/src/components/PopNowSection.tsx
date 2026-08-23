import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Send, Sparkles, X, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';

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

export const PopNowSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedBox, setSelectedBox] = useState<PopBoxItem | null>(null);

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
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleExploreMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="pop-now">
      
      {/* Section Header Matching Reference */}
      <div className="flex flex-col items-center justify-center text-center mb-8 space-y-1.5">
        <div className="flex items-center gap-2.5">
          {/* Red POP NOW badge */}
          <div className="px-2 py-1 rounded bg-[#E50012] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center justify-center">
            POP NOW
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-display">
            POP NOW
          </h2>
        </div>

        <a
          href="#catalog"
          onClick={handleExploreMore}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
        >
          Explore More Series &gt;
        </a>
      </div>

      {/* 3D Pop Up Carousel Container */}
      <div className="relative group">
        
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Previous 3D Blind Box"
          className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 shadow-md border border-slate-200 dark:border-zinc-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          aria-label="Next 3D Blind Box"
          className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 shadow-md border border-slate-200 dark:border-zinc-700 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto pb-6 pt-4 px-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {popBoxes.map((box) => (
            <div
              key={box.id}
              className="snap-start shrink-0 w-[260px] sm:w-[300px] flex flex-col items-center text-center group/card cursor-pointer"
              onClick={() => setSelectedBox(box)}
            >
              {/* 3D Box Container with Pop Up Lift Effect */}
              <div className="relative aspect-[3/4] w-full flex items-center justify-center mb-4 transition-all duration-300 transform group-hover/card:-translate-y-3 group-hover/card:scale-105">
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-full h-full object-contain filter drop-shadow-md group-hover/card:drop-shadow-2xl transition-all"
                  loading="lazy"
                />

                {/* Quick 3D Pop view hover tag */}
                <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity bg-slate-900/80 dark:bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>3D View</span>
                </div>
              </div>

              {/* Product Title */}
              <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 line-clamp-2 px-1 mb-2 leading-snug min-h-[36px]">
                {box.name}
              </h3>

              {/* Price Tag ($XX.XX / PICK) */}
              <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mb-3">
                ${box.price.toFixed(2)} <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">/ PICK</span>
              </div>

              {/* Action Button Matching Reference */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBox(box);
                }}
                className="w-36 py-2 px-4 rounded-md border border-slate-900 dark:border-zinc-300 bg-transparent text-slate-900 dark:text-zinc-100 text-xs font-bold uppercase tracking-wider hover:bg-slate-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-slate-900 transition-all active:scale-95 shadow-xs"
              >
                Pick Now
              </button>

            </div>
          ))}
        </div>

      </div>

      {/* 3D Pop Up Inspection Modal */}
      {selectedBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 dark:bg-black/85 backdrop-blur-md animate-fade-in">
          
          <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto transition-colors">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50 dark:bg-zinc-950">
              <div className="flex items-center gap-2.5">
                <div className="px-2 py-0.5 rounded bg-[#E50012] text-white text-[10px] font-black uppercase tracking-wider">
                  POP NOW
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    3D Studio Blind Box Picker
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {selectedBox.brand} • {selectedBox.series}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBox(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              
              {/* 3D Standing Box Media */}
              <div className="aspect-[3/4] w-full rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-4 flex items-center justify-center overflow-hidden shadow-inner">
                <img
                  src={selectedBox.image}
                  alt={selectedBox.name}
                  className="w-full h-full object-contain filter drop-shadow-xl transform hover:scale-105 transition-transform"
                />
              </div>

              {/* Box Details & Telegram Direct Pick */}
              <div className="space-y-4">
                
                <div>
                  <span className="text-xs font-bold text-[#E50012] uppercase tracking-wider">
                    {selectedBox.brand}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug mt-0.5">
                    {selectedBox.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                    {selectedBox.description}
                  </p>
                </div>

                {/* Chase Rate & Authenticity */}
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 text-xs">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{selectedBox.secretRate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>100% Genuine Sealed Factory Box</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    ${selectedBox.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">USD / BLIND BOX PICK</span>
                </div>

                {/* Action Order Button */}
                <div className="pt-2">
                  <a
                    href={`https://t.me/+85592917831?text=${encodeURIComponent(
                      `Hello Classy Bling! I want to Pick & Unbox:\n📦 Product: ${selectedBox.name}\n💰 Price: $${selectedBox.price.toFixed(2)} USD\nSeries: ${selectedBox.series}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1d8cc2] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Pick & Order on Telegram</span>
                  </a>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};
