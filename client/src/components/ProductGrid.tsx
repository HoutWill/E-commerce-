import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { PackageOpen, Bot, Loader2 } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onOpenModal: (product: Product) => void;
  onOpenBotStudio: () => void;
  sort: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onOpenModal,
  onOpenBotStudio,
  sort,
  onSortChange,
  totalCount
}) => {
  if (isLoading) {
    return (
      <div className="flex-1 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-rose-600 dark:text-rose-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
          Loading catalog products...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 mx-auto flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-4 shadow-xs">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          No matching products found
        </h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
          Try clearing your search query or reset your price and category filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Top Sort & Count Bar */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Showing {products.length} of {totalCount} Items
        </span>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 dark:text-zinc-500 hidden sm:inline">Sort:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort products"
            className="text-xs font-bold bg-transparent border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="newest">Featured & Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid of 4 Columns matching screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenModal={onOpenModal}
          />
        ))}
      </div>
    </div>
  );
};
