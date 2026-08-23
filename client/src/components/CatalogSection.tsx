import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Package, 
  Heart, 
  Sparkles, 
  Flame, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  Search, 
  X, 
  LayoutGrid,
  Loader2,
  PackageOpen
} from 'lucide-react';

interface CatalogSectionProps {
  products: Product[];
  isLoading: boolean;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSubFilter: string;
  onSelectSubFilter: (sub: string) => void;
  search: string;
  onSearchChange: (q: string) => void;
  sort: string;
  onSortChange: (s: string) => void;
  onOpenModal: (product: Product) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  isLoading,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSubFilter,
  onSelectSubFilter,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onOpenModal,
}) => {
  // Top category tabs matching screenshot
  const topTabs = [
    { label: 'All Items', value: 'All' },
    { label: 'Plush Dolls', value: 'Plush Dolls' },
    { label: 'Blind Box', value: 'Blind Box' },
    { label: 'Action Figures', value: 'Action Figures' },
    { label: 'POP NOW Drops', value: 'POP NOW' },
  ];

  // Left vertical sub-filter icon rail matching screenshot
  const iconRailItems = [
    { label: 'All', value: 'all', icon: Plus },
    { label: 'Plush', value: 'plush', icon: Heart },
    { label: 'Box', value: 'box', icon: Package },
    { label: 'Rare', value: 'rare', icon: Sparkles },
    { label: 'In Stock', value: 'in_stock', icon: CheckCircle2 },
    { label: '< $12', value: 'under_12', icon: DollarSign },
    { label: '$12-$15', value: '12_15', icon: DollarSign },
    { label: '$15+', value: 'over_15', icon: Flame },
  ];

  const handleTopTabClick = (val: string) => {
    if (val === 'POP NOW') {
      const el = document.getElementById('pop-now');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onSelectCategory(val);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6" id="catalog">
      
      {/* Top Header Category Tabs matching screenshot (Beverages / Bakery / Retail style) */}
      <div className="border-b border-slate-200 dark:border-zinc-800 mb-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 sm:gap-10 pb-0.5 min-w-max">
          {topTabs.map((tab) => {
            const isActive = selectedCategory.toLowerCase() === tab.value.toLowerCase() || (tab.value === 'POP NOW' && false);
            return (
              <button
                key={tab.value}
                onClick={() => handleTopTabClick(tab.value)}
                className={`pb-3 text-sm sm:text-base font-bold transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'text-[#229ED9] dark:text-[#38bdf8] font-black'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#229ED9] dark:bg-[#38bdf8] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by character, series, or brand..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs sm:text-sm focus:outline-none focus:border-[#229ED9] transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">Sort:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort products"
            className="text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#229ED9] cursor-pointer"
          >
            <option value="newest">Featured & Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Two Column Layout: Left Icon Rail + Right Product Grid matching screenshot */}
      <div className="flex items-start gap-4 sm:gap-6">
        
        {/* Left Subcategory Vertical Icon Rail */}
        <div className="flex flex-col gap-3 shrink-0 py-1 select-none w-14 sm:w-16">
          {iconRailItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedSubFilter === item.value;
            return (
              <button
                key={item.value}
                onClick={() => onSelectSubFilter(item.value)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
                  isSelected
                    ? 'border-2 border-[#229ED9] bg-white dark:bg-zinc-900 shadow-md text-[#229ED9]'
                    : 'border border-slate-200/60 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/50 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'
                }`}
                title={item.label}
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mb-1">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-[#229ED9] stroke-[2.5]' : ''}`} />
                </div>
                <span className={`text-[10px] font-bold tracking-tight text-center leading-none ${isSelected ? 'text-[#229ED9]' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Product Grid */}
        <div className="flex-1">
          
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 text-[#229ED9] animate-spin" />
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 mx-auto flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-4 shadow-xs">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching products
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Try switching the category or resetting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenModal={onOpenModal}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
