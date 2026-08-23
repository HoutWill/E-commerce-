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
    `Hello Classy Bling! I would like to order:\nProduct: ${product.name}\nPrice: $${product.price.toFixed(2)} USD\nBrand: ${product.brand}`
  )}`;

  // Convert USD to approximate KHR (4000-4100 KHR per USD)
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
      className="group flex flex-col cursor-pointer select-none font-sans transition-transform duration-200 active:scale-[0.99]"
    >
      {/* 100% Customer Clean 3D Product Image Container */}
      <div className="relative aspect-square w-full rounded-2xl bg-[#f7f5f2] dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:shadow-lg">
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

      {/* Product Info & Action Row matching cafe/POS reference */}
      <div className="pt-2.5 pb-1 flex flex-col space-y-0.5">
        
        {/* Price Row with Circular (+) Quick Order Button */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-[#229ED9] dark:text-[#38bdf8] flex items-center gap-1">
              <span>{khrPrice} ៛</span>
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400">
              ${product.price.toFixed(2)}
            </div>
          </div>

          {/* Circular (+) Order Button */}
          <button
            onClick={handleQuickAdd}
            aria-label={`Order ${product.name}`}
            title="Order directly on Telegram"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#229ED9] hover:bg-[#1d8cc2] text-white flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all"
          >
            {ordered ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />}
          </button>
        </div>

        {/* Bold Product Name below price */}
        <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors pt-0.5">
          {product.name}
        </h3>

      </div>

    </div>
  );
};
