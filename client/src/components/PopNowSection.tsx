import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Send, Sparkles, X, ShieldCheck, Flame, Pause, Play } from 'lucide-react';

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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    onModalChange?.(Boolean(selectedBox));
  }, [selectedBox, onModalChange]);

  const popBoxes: PopBoxItem[] = [
    {
      id: 'labubu_macaron',
      name: 'Pop Mart Labubu Tasty Macarons Series',
      series: 'The Monsters Tasty Macarons',
      brand: 'Pop Mart',
      price: 19.50,
      image: '/3d_boxes/labubu_macaron_box_ai.jpg',
      secretRate: '1/72 Secret Chestnut Macaron Chase',
      description: 'Viral fluffy vinyl plush monster with mischievous sharp tooth smile holding a strawberry macaron.'
    },
    {
      id: 'crybaby_concert',
      name: 'Pop Mart CRYBABY Sunset Concert Series',
      series: 'Sunset Concert Rock Band',
      brand: 'Pop Mart',
      price: 16.50,
      image: '/3d_boxes/crybaby_concert_box_ai.jpg',
      secretRate: '1/144 Ultra Rare Golden Guitarist',
      description: 'Rockstar blonde girl in leather jacket with electric guitar, star tears, and band accessories.'
    },
    {
      id: 'zootopia_fox',
      name: 'Disney Zootopia Nick Wilde Series 1',
      series: 'Zootopia Art Toy Collection',
      brand: 'Disney x Pop Mart',
      price: 14.00,
      image: '/3d_boxes/zootopia_fox_box_ai.jpg',
      secretRate: '1/72 Secret Gold Badge Officer',
      description: 'Official Disney licensed Nick Wilde collectible in green shirt and tie on white studio podium.'
    },
    {
      id: 'kuromi_dreamland',
      name: 'Sanrio Kuromi Dreamland Starry Series',
      series: 'Kuromi Star Magic Vol. 1',
      brand: 'Sanrio',
      price: 12.50,
      image: '/3d_boxes/kuromi_dreamland_box_ai.jpg',
      secretRate: '1/96 Secret Midnight Glitter Chase',
      description: 'Sanrio licensed gothic jester hat Kuromi with magical star wand on a pastel lavender podium.'
    },
    {
      id: 'kfc_dimoo',
      name: 'Pop Mart KFC x DIMOO Aviator Series',
      series: 'Pilot Colonel 35th Anniversary',
      brand: 'Pop Mart x KFC',
      price: 14.00,
      image: '/3d_boxes/kfc_dimoo_box_ai.jpg',
      secretRate: '1/144 Golden Colonel Secret',
      description: 'Limited edition DIMOO pilot in aviator jacket with cloud hair and signature fried chicken bucket.'
    },
    {
      id: 'hirono_mischief',
      name: 'Pop Mart Hirono Little Mischief Series',
      series: 'Hirono Streetwear Edition',
      brand: 'Pop Mart',
      price: 15.00,
      image: '/3d_boxes/hirono_mischief_box_ai.jpg',
      secretRate: '1/72 The Vagrant Secret Chase',
      description: 'Moody expressive boy in oversized textured streetwear hoodie on a minimalist concrete pedestal.'
    },
    {
      id: 'yumi_dream',
      name: 'YuMi Dreamy Girl Collection Vol. 1',
      series: 'Pastel Gothic Lolita Series',
      brand: 'DOTEBABY',
      price: 14.00,
      image: '/3d_boxes/yumi_dream_box_ai.jpg',
      secretRate: '1/72 Secret Starlight Princess',
      description: 'Anime twintail pink haired cutie in lolita dress with silver foil star accents on studio podium.'
    },
    {
      id: 'baby_three_bunny',
      name: 'Baby Three 3-Year-Old Cutie Series',
      series: 'Cutie Plush Series',
      brand: 'Baby Three',
      price: 12.50,
      image: '/3d_boxes/baby_three_bunny_box_ai.jpg',
      secretRate: '1/72 Secret Fluffy Angel Bunny',
      description: 'Soft pastel plush bunny doll with large glossy starry eyes and cute lace collar.'
    },
    {
      id: 'cinnamoroll_bakery',
      name: 'Sanrio Cinnamoroll Cloud Bakery Series',
      series: 'Sweet Pastry Collection',
      brand: 'Sanrio',
      price: 13.00,
      image: '/3d_boxes/cinnamoroll_bakery_box_ai.jpg',
      secretRate: '1/96 Rainbow Cupcake Chase',
      description: 'Fluffy white puppy Cinnamoroll wearing a baker chef hat holding a warm cinnamon pastry roll.'
    },
    {
      id: 'mini_animal',
      name: 'Baby Three Mini Animal Party Series',
      series: 'Mini Animals Vol. 1',
      brand: 'Baby Three',
      price: 14.00,
      image: '/3d_boxes/mini_animal_box_ai.jpg',
      secretRate: '1/72 Secret Golden Panda',
      description: 'Chibi baby panda in sweet animal onesie on a soft lavender studio display.'
    },
    {
      id: 'fantasy_world',
      name: 'Fantasy World Pastel Plush Bunny',
      series: 'Pastel Fantasy Series',
      brand: 'Baby Three',
      price: 14.00,
      image: '/3d_boxes/fantasy_world_box_ai.jpg',
      secretRate: '1/72 Secret Glitter Wing Fairy',
      description: 'Dreamy sky-blue and pastel pink fairy bunny with sparkling eyes and delicate wings.'
    },
    {
      id: 'samuel_ocean',
      name: 'Samuel Ocean Series Shark Hood',
      series: 'Deep Ocean Friends',
      brand: 'MEI YI YOU ART TOY',
      price: 13.00,
      image: '/3d_boxes/samuel_ocean_box_ai.jpg',
      secretRate: '1/96 Secret Hammerhead Chase',
      description: 'Plush doll in cute blue shark hooded onesie with white teeth on an ocean gradient studio pedestal.'
    },
    {
      id: 'skullpanda_sound',
      name: 'Pop Mart SKULLPANDA The Sound Series',
      series: 'The Sound Avant-Garde',
      brand: 'Pop Mart',
      price: 15.00,
      image: '/3d_boxes/skullpanda_sound_box_ai.jpg',
      secretRate: '1/144 The Silence Secret Chase',
      description: 'Matte black box with iridescent holographic lettering featuring avant-garde earbuds cyber girl.'
    }
  ];

  // Duplicate for seamless infinite loop
  const loopBoxes = [...popBoxes, ...popBoxes];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleExploreMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-hidden" id="pop-now">
      
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center text-center mb-5 sm:mb-8 space-y-1.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Red POP NOW badge */}
          <div className="px-2 py-0.5 sm:py-1 rounded bg-[#E50012] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
            <Flame className="w-3 h-3 fill-current animate-pulse" />
            <span>POP NOW</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-display">
            POP NOW Drops
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#catalog"
            onClick={handleExploreMore}
            className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            Explore More Series &gt;
          </a>

          {/* Pause / Play Loop Toggle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-all cursor-pointer"
            title={isPaused ? "Resume Auto Scroll" : "Pause Auto Scroll"}
          >
            {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
            <span>{isPaused ? "Play" : "Pause"}</span>
          </button>
        </div>
      </div>

      {/* Pop Up Carousel Container with Left/Right Arrows */}
      <div 
        className="relative group/track overflow-hidden py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Left Arrow Button (Desktop/Tablet) */}
        <button
          onClick={() => scroll('left')}
          aria-label="Previous Blind Box"
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-zinc-900/95 text-slate-800 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 shadow-xl border border-slate-200/80 dark:border-zinc-700 items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow Button (Desktop/Tablet) */}
        <button
          onClick={() => scroll('right')}
          aria-label="Next Blind Box"
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 dark:bg-zinc-900/95 text-slate-800 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 shadow-xl border border-slate-200/80 dark:border-zinc-700 items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-xs"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Animated Infinite Loop Scroll Track */}
        <div
          ref={scrollRef}
          className={`flex gap-4 sm:gap-6 pb-4 pt-2 px-1 ${
            isPaused ? 'overflow-x-auto no-scrollbar scroll-smooth' : 'animate-loop-scroll'
          }`}
          style={isPaused ? { animationPlayState: 'paused' } : undefined}
        >
          {loopBoxes.map((box, idx) => (
            <div
              key={`${box.id}-${idx}`}
              className="shrink-0 w-[220px] sm:w-[270px] flex flex-col items-center text-center group/card cursor-pointer bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-300"
              onClick={() => setSelectedBox(box)}
            >
              {/* Product Box Image Container */}
              <div className="relative aspect-[1/1] w-full rounded-xl bg-slate-50 dark:bg-zinc-950 p-2 sm:p-2.5 flex items-center justify-center mb-3 transition-all duration-300 transform group-hover/card:-translate-y-2 group-hover/card:scale-102 border border-slate-100 dark:border-zinc-800/80 overflow-hidden">
                <img
                  src={box.image}
                  alt={box.name}
                  className="w-full h-full object-contain filter drop-shadow-sm group-hover/card:drop-shadow-lg transition-all"
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
                className="w-full py-2 px-3 rounded-xl border border-slate-900 dark:border-zinc-300 bg-transparent text-slate-900 dark:text-zinc-100 text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-slate-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-slate-900 transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                Pick Now
              </button>

            </div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-center gap-1 text-[11px] font-medium text-slate-400 dark:text-zinc-500 pt-1">
          <span>← Auto-scrolling loop • Touch to inspect →</span>
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
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-slate-50/40 dark:bg-zinc-900/40">
              {/* Product Box Image */}
              <div className="w-48 sm:w-60 shrink-0 aspect-[1/1] rounded-2xl bg-white dark:bg-zinc-950 p-3 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-center shadow-lg">
                <img
                  src={selectedBox.image}
                  alt={selectedBox.name}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between space-y-3 sm:space-y-4 text-left w-full">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    In Stock • Ready to Ship
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {selectedBox.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {selectedBox.description}
                  </p>
                </div>

                {/* Secret Chase Rate */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{selectedBox.secretRate}</span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    ${selectedBox.price.toFixed(2)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#229ED9]">
                    ({Math.round(selectedBox.price * 4100).toLocaleString()} ៛)
                  </span>
                </div>

                {/* Order Action Button */}
                <a
                  href={`https://t.me/+85592917831?text=${encodeURIComponent(`Hello Classy Bling! I want to pick & order: ${selectedBox.name} ($${selectedBox.price.toFixed(2)})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1e8bc0] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Direct Order via Telegram</span>
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Guaranteed Authentic • Brand New Sealed Blind Box</span>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
