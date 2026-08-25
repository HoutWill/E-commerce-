import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { Plus, Check, Sparkles, ShoppingBag } from 'lucide-react';

interface ShowcaseShelfProps {
  products: Product[];
  onOpenModal: (product: Product) => void;
}

export const ShowcaseShelf: React.FC<ShowcaseShelfProps> = ({ products, onOpenModal }) => {
  // Dynamically adapt shelf rows to match exact screen layout (2 on mobile, 3 on tablet, 4 on desktop)
  const [columns, setColumns] = useState(() => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setColumns(2);
      else if (window.innerWidth < 1024) setColumns(3);
      else setColumns(4);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group products into tiers so each shelf plank runs continuously under each visual row
  const tiers: Product[][] = [];
  for (let i = 0; i < products.length; i += columns) {
    tiers.push(products.slice(i, i + columns));
  }

  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#fdfdfd] dark:bg-[#111115] border-[6px] sm:border-[10px] border-[#e8ecf1] dark:border-[#27272d] shadow-xl transition-all">
      
      {/* Bookshelf Crown Header & Ambient Light */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-gradient-to-b from-white to-[#f4f6f9] dark:from-[#18181f] dark:to-[#121217] border-b-2 border-[#e2e8f0] dark:border-[#2b2b34] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            Classy Bling Showcase Closet
          </span>
        </div>
        <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400">
          {products.length} Collectibles on Shelf
        </div>
      </div>

      {/* Multi-Tier Bookshelf Display */}
      <div className="divide-y-0">
        {tiers.map((tierProducts, tierIdx) => (
          <div key={`shelf-tier-${tierIdx}`} className="relative group/tier pt-2 sm:pt-4">
            
            {/* Overhead LED Ambient Glow strip under top shelf / ceiling */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/90 via-slate-100/40 to-transparent dark:from-white/10 dark:via-sky-400/5 dark:to-transparent pointer-events-none" />

            {/* Product items standing on this shelf level */}
            <div 
              className="grid gap-2 sm:gap-4 px-2 sm:px-6 pb-2 items-end relative z-10"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {tierProducts.map((product) => (
                <ShelfItem
                  key={product.id}
                  product={product}
                  onOpenModal={onOpenModal}
                />
              ))}
            </div>

            {/* Thick Continuous White Shelf Board (Runs 100% across the closet) */}
            <div className="relative w-full z-20">
              {/* Shelf Top Surface Bevel */}
              <div className="h-2 w-full bg-gradient-to-b from-white to-[#f1f5f9] dark:from-[#32323a] dark:to-[#222228] border-t border-white dark:border-white/10" />
              
              {/* Shelf Front Plank Face (Thickness) */}
              <div className="h-3 sm:h-4 w-full bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] dark:from-[#222228] dark:to-[#16161b] border-t border-white/60 dark:border-zinc-700/40 border-b border-[#94a3b8]/40 dark:border-black/60 flex items-center justify-center shadow-xs">
                <div className="w-12 h-0.5 bg-slate-300 dark:bg-zinc-700 rounded-full opacity-60" />
              </div>
              
              {/* Under-Shelf Realistic Drop Shadow casting onto the tier below */}
              <div className="h-4 sm:h-5 w-full bg-gradient-to-b from-slate-900/15 via-slate-900/5 to-transparent dark:from-black/60 dark:via-black/20 pointer-events-none" />
            </div>

          </div>
        ))}
      </div>

      {/* Bookshelf Base Plinth */}
      <div className="py-3 bg-gradient-to-t from-[#e2e8f0]/80 to-[#f8fafc] dark:from-[#18181f] dark:to-[#111115] border-t-2 border-[#cbd5e1] dark:border-[#27272a] text-center">
        <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-[#229ED9]" />
          Authentic Designer Art Toys & Blind Boxes • Tap to Order
        </p>
      </div>

    </div>
  );
};

interface ShelfItemProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

const ShelfItem: React.FC<ShelfItemProps> = ({ product, onOpenModal }) => {
  const [ordered, setOrdered] = useState(false);

  const displayImage = product.croppedImageUrl || product.originalScreenshotUrl;
  const khrPrice = Math.round(product.price * 4100).toLocaleString();

  const telegramOrderUrl = `https://t.me/+85592917831?text=${encodeURIComponent(
    `Hello Classy Bling! I would like to order:\nProduct: ${product.name}\nPrice: $${product.price.toFixed(2)} USD (~${khrPrice} ៛)\nBrand: ${product.brand}`
  )}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrdered(true);
    setTimeout(() => setOrdered(false), 2000);
    window.open(telegramOrderUrl, '_blank');
  };

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="group flex flex-col justify-end items-center cursor-pointer select-none transition-all duration-150"
    >
      {/* 3D Box standing directly on the Shelf */}
      <div className="relative w-full aspect-square max-w-[210px] flex flex-col items-center justify-end">
        
        {/* Stock Status Badge */}
        <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 z-20">
          <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-2xs ${
            product.stockStatus === 'In Stock'
              ? 'bg-emerald-500 text-white'
              : product.stockStatus === 'Low Stock'
              ? 'bg-amber-500 text-white'
              : product.stockStatus === 'Pre-order'
              ? 'bg-sky-500 text-white'
              : 'bg-rose-500 text-white'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {product.stockStatus || 'In Stock'}
          </span>
        </div>

        {/* 3D Box Image with Smooth Hover Lift Animation */}
        <div className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out group-hover:-translate-y-2 z-10">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain pointer-events-none drop-shadow-sm group-hover:drop-shadow-md transition-all duration-200"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = product.originalScreenshotUrl;
            }}
          />
        </div>

        {/* Contact Drop Shadow on the Shelf Floor */}
        <div 
          className="w-[85%] h-2.5 mx-auto -mt-1 transition-all duration-200 group-hover:w-[75%] group-hover:opacity-70 z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, transparent 80%)'
          }}
        />
      </div>

      {/* Boutique Magnetic Price Tag on Shelf Lip */}
      <div className="w-full mt-2 bg-white dark:bg-[#1c1c24] rounded-xl p-2 sm:p-2.5 border border-slate-200/90 dark:border-zinc-700/80 shadow-xs group-hover:shadow-md group-hover:border-[#229ED9]/60 dark:group-hover:border-[#38bdf8]/60 transition-all duration-150">
        
        {/* Price & Telegram Order Button */}
        <div className="flex items-center justify-between gap-1">
          <div>
            <div className="text-xs sm:text-sm font-black text-[#229ED9] dark:text-[#38bdf8] leading-tight">
              {khrPrice} ៛
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400">
              ${product.price.toFixed(2)} USD
            </div>
          </div>

          {/* Quick Add / Order button */}
          <button
            onClick={handleQuickAdd}
            aria-label={`Order ${product.name} on Telegram`}
            title="Order directly on Telegram"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#229ED9] hover:bg-[#1d8cc2] text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all shrink-0 min-w-[28px] min-h-[28px]"
          >
            {ordered ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />}
          </button>
        </div>

        {/* Product Title */}
        <h3 className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-tight line-clamp-2 leading-snug mt-1 group-hover:text-[#229ED9] dark:group-hover:text-[#38bdf8] transition-colors min-h-[26px] sm:min-h-[30px]">
          {product.name}
        </h3>

      </div>

    </div>
  );
};
