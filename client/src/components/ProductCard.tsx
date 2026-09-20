import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const displayImage = product.croppedImageUrl || product.originalScreenshotUrl;

  // Determine if a meaningful badge should be displayed
  const isNew = product.createdAt ? new Date(product.createdAt).getTime() > new Date('2026-09-01').getTime() : false;
  const isLimited = product.category === 'Limited Edition' || product.tags?.includes('Limited') || product.tags?.includes('Limited Edition');
  const isSoldOut = product.stockStatus === 'Out of Stock';

  const badgeText = isSoldOut ? 'SOLD OUT' : isLimited ? 'LIMITED' : isNew ? 'NEW' : null;
  const badgeColor = isSoldOut
    ? 'bg-zinc-800 text-white'
    : isLimited
    ? 'bg-[#B45309] text-white'
    : 'bg-[#C25E3E] text-white';

  return (
    <div
      data-testid="product-card"
      onClick={() => onOpenModal(product)}
      className="product-card group flex flex-col cursor-pointer select-none bg-white dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] hover:border-[#D6D2C9] dark:hover:border-[#3F3F46] p-2.5 sm:p-3 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-[0.99]"
    >
      {/* 1:1 Clean Product Image Well */}
      <div className="relative aspect-square w-full rounded-lg bg-[#F5F3EF] dark:bg-[#202024] overflow-hidden flex items-center justify-center mb-2.5 p-2 sm:p-3">
        {badgeText && (
          <span className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${badgeColor}`}>
            {badgeText}
          </span>
        )}

        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = product.originalScreenshotUrl;
          }}
        />
      </div>

      {/* Product Metadata */}
      <div className="flex flex-col justify-between flex-1 space-y-1">
        <div>
          {/* Series / Collection Label */}
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C7E72] dark:text-[#A1A1AA] tracking-wider uppercase block line-clamp-1">
            {product.series || product.brand || 'Designer Series'}
          </span>

          {/* Product Name */}
          <h3 className="text-xs sm:text-[13px] font-semibold text-[#1A1A1A] dark:text-[#F4F4F5] leading-snug line-clamp-1 group-hover:text-[#C25E3E] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price and Stock Row */}
        <div className="pt-1.5 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
            ${product.price.toFixed(2)}
          </span>

          <div className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.stockStatus === 'In Stock'
                  ? 'bg-emerald-500'
                  : product.stockStatus === 'Low Stock'
                  ? 'bg-amber-500'
                  : 'bg-zinc-400'
              }`}
            />
            <span className="text-[10px] sm:text-[11px] font-medium text-[#71717A] dark:text-[#A1A1AA]">
              {product.stockStatus || 'In Stock'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
