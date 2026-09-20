import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, XLg, Send } from 'react-bootstrap-icons';

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
      id: 'prod_claw_machine_rabbit_space',
      name: 'Rabbit Space Mini Arcade Claw Machine',
      series: 'Doll Machine Game Series',
      brand: 'Classy Bling Arcade',
      price: 25.00,
      image: '/3d_boxes/claw_machine_rabbit_space_ai.jpg',
      secretRate: 'Available in 3 Colors (Pink, Green, Yellow)',
      description: 'Authentic TikTok viral tabletop mini arcade claw machine (Size L) with motorized crane claw, 3 joystick controls, LED timer, sound effects, and doll capsules.'
    },
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
      name: 'Baby Three Pocket Bunny Treasure Series',
      series: 'Pocket Bunny Series 1',
      brand: 'Baby Three',
      price: 12.50,
      image: '/3d_boxes/baby_three_bunny_box_ai.jpg',
      secretRate: '1/96 Golden Crown Bunny Chase',
      description: 'Plush rabbit doll with glossy cartoon eyes in baby pink romper box.'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleExploreMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" id="pop-now">
      
      {/* Signature Section Header: Centered with Red POP NOW Badge */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E50012] text-white shadow-xs">
            POP NOW
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            POP NOW DROPS
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          <a
            href="#catalog"
            onClick={handleExploreMore}
            className="hover:underline text-slate-600 dark:text-zinc-300 font-medium cursor-pointer"
          >
            Explore More Series &gt;
          </a>
        </p>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1"
      >
        {popBoxes.map((box) => (
          <div
            key={box.id}
            onClick={() => setSelectedBox(box)}
            className="shrink-0 w-[190px] sm:w-[230px] rounded-xl bg-white dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] hover:border-[#D6D2C9] dark:hover:border-[#3F3F46] p-3 flex flex-col group cursor-pointer transition-all shadow-2xs"
          >
            {/* 1:1 Product Image */}
            <div className="relative aspect-square w-full rounded-lg bg-[#F5F3EF] dark:bg-[#202024] overflow-hidden p-2 flex items-center justify-center mb-2.5">
              <img
                src={box.image}
                alt={box.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {box.id === 'prod_claw_machine_rabbit_space' ? (
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[#C25E3E] text-white">
                  NEW
                </span>
              ) : (
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-white/90 dark:bg-[#18181B]/90 text-[#71717A] dark:text-[#A1A1AA] border border-[#EAE7E1] dark:border-[#2C2C30]">
                  POP
                </span>
              )}
            </div>

            {/* Product Meta */}
            <div className="flex-1 flex flex-col justify-between space-y-1">
              <div>
                <span className="text-[10px] font-semibold text-[#8C7E72] dark:text-[#A1A1AA] uppercase tracking-wider block line-clamp-1">
                  {box.series}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-[#1A1A1A] dark:text-[#F4F4F5] line-clamp-1 group-hover:text-[#C25E3E] transition-colors">
                  {box.name}
                </h3>
              </div>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-sm font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                  ${box.price.toFixed(2)}
                </span>
                <span className="text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
                  In Stock
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Detail for PopBox */}
      {selectedBox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in select-none"
          onClick={() => setSelectedBox(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] shadow-xl overflow-hidden p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBox(null)}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#71717A] hover:text-[#1A1A1A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#202024] transition-colors"
            >
              <XLg className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-xl bg-[#F5F3EF] dark:bg-[#202024] p-3 flex items-center justify-center shrink-0">
                <img
                  src={selectedBox.image}
                  alt={selectedBox.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2 text-left flex-1">
                <span className="text-[10px] uppercase font-bold text-[#8C7E72] dark:text-[#A1A1AA] tracking-wider">
                  {selectedBox.brand} · {selectedBox.series}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] dark:text-[#F4F4F5] leading-tight">
                  {selectedBox.name}
                </h3>
                <div className="text-lg font-extrabold text-[#C25E3E]">
                  ${selectedBox.price.toFixed(2)} USD
                </div>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                  {selectedBox.description}
                </p>

                <div className="pt-3">
                  <a
                    href={`https://t.me/+85592917831?text=${encodeURIComponent(
                      `Hello Classy Bling! I would like to order: ${selectedBox.name} ($${selectedBox.price.toFixed(2)})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#C25E3E] hover:bg-[#A94F32] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Order via Telegram</span>
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
