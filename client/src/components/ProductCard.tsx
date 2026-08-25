import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const [ordered, setOrdered] = useState(false);

  const displayImage = product.croppedImageUrl || product.originalScreenshotUrl;

  const telegramOrderUrl = `https://t.me/+85592917831?text=${encodeURIComponent(
    `Hello Classy Bling! I would like to order:\nProduct: ${product.name}\nPrice: $${product.price.toFixed(2)} USD (~${Math.round(product.price * 4100).toLocaleString()} ៛)\nBrand: ${product.brand}`
  )}`;

  // Convert USD to approximate KHR
  const khrPrice = Math.round(product.price * 4100).toLocaleString();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrdered(true);
    setTimeout(() => setOrdered(false), 2000);
    window.open(telegramOrderUrl, '_blank');
  };

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="group flex flex-col cursor-pointer select-none font-sans transition-transform duration-200 active:scale-[0.98] bg-white dark:bg-zinc-900/60 p-2 sm:p-3 rounded-2xl border border-slate-200/70 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 shadow-2xs hover:shadow-md transition-all"
    >
      {/* 3D Product Image Container */}
      <div className="relative aspect-square w-full rounded-xl bg-[#f7f5f2] dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/60 overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:shadow-sm">
        
        {/* Stock Status Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs ${
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

        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = product.originalScreenshotUrl;
          }}
        />
      </div>

      {/* Product Info & Action Row */}
      <div className="pt-2 pb-0.5 flex flex-col space-y-1">
        
        {/* Price Row with Circular (+) Quick Order Button */}
        <div className="flex items-center justify-between gap-1">
          <div>
            <div className="text-xs sm:text-sm font-black text-[#229ED9] dark:text-[#38bdf8] leading-tight">
              {khrPrice} ៛
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400">
              ${product.price.toFixed(2)} USD
            </div>
          </div>

          {/* Circular (+) Order Button (touch-optimized 34px-36px) */}
          <button
            onClick={handleQuickAdd}
            aria-label={`Order ${product.name} on Telegram`}
            title="Order directly on Telegram"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#229ED9] hover:bg-[#1d8cc2] text-white flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all shrink-0 min-w-[32px] min-h-[32px]"
          >
            {ordered ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />}
          </button>
        </div>

        {/* Bold Product Name */}
        <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-[#229ED9] dark:group-hover:text-[#38bdf8] transition-colors min-h-[28px] sm:min-h-[32px]">
          {product.name}
        </h3>

      </div>

    </div>
  );
};
