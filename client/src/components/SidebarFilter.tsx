import React from 'react';
import { RotateCcw, Check, CheckSquare, Square, Flame, CheckCircle2 } from 'lucide-react';

interface SidebarFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  brands: string[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  selectedPriceRange: string;
  onSelectPriceRange: (range: string) => void;
  totalCount: number;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  brands,
  selectedBrand,
  onSelectBrand,
  inStockOnly,
  onToggleInStock,
  selectedPriceRange,
  onSelectPriceRange,
  totalCount
}) => {
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $10', value: '0-10' },
    { label: '$10 - $14', value: '10-14' },
    { label: '$14 - $18', value: '14-18' },
    { label: '$18 & Above', value: '18-999' },
  ];

  const handleReset = () => {
    onSelectCategory('All');
    onSelectBrand('All');
    onSelectPriceRange('all');
    if (inStockOnly) onToggleInStock();
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedBrand !== 'All' ||
    selectedPriceRange !== 'all' ||
    inStockOnly;

  return (
    <aside className="w-full lg:w-60 xl:w-64 shrink-0 space-y-6 select-none font-sans text-slate-800 dark:text-zinc-200">
      
      {/* Top Quick Checkboxes matching screenshot */}
      <div className="space-y-3.5 pb-5 border-b border-slate-200 dark:border-zinc-800">
        
        {/* POP NOW Check */}
        <div
          onClick={() => {
            const el = document.getElementById('pop-now');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex items-center gap-3 cursor-pointer group hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
        >
          <div className="w-4 h-4 rounded border border-slate-300 dark:border-zinc-700 flex items-center justify-center group-hover:border-rose-500 transition-colors">
            <Flame className="w-3 h-3 text-[#E50012]" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide">POP NOW</span>
        </div>

        {/* Local Shipping / In Stock Check */}
        <div
          onClick={onToggleInStock}
          className="flex items-center gap-3 cursor-pointer group hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <div
            className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              inStockOnly
                ? 'bg-slate-900 dark:bg-zinc-100 border-slate-900 dark:border-zinc-100 text-white dark:text-zinc-900'
                : 'border-slate-300 dark:border-zinc-700 group-hover:border-slate-500'
            }`}
          >
            {inStockOnly && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-wide">In Stock (Local Dispatch)</span>
        </div>

      </div>

      {/* Category Section */}
      <div className="space-y-3 pb-5 border-b border-slate-200 dark:border-zinc-800">
        <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Category
        </h4>
        <div className="space-y-2.5">
          {['All', ...categories].map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <div
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="flex items-center gap-3 cursor-pointer group transition-colors"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-zinc-100 border-slate-900 dark:border-zinc-100 text-white dark:text-zinc-900'
                      : 'border-slate-300 dark:border-zinc-700 group-hover:border-slate-500'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span
                  className={`text-xs sm:text-sm transition-colors ${
                    isSelected
                      ? 'font-bold text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'All Categories' : cat}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-3 pb-5 border-b border-slate-200 dark:border-zinc-800">
        <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Price Range
        </h4>
        <div className="space-y-2.5">
          {priceRanges.map((range) => {
            const isSelected = selectedPriceRange === range.value;
            return (
              <div
                key={range.value}
                onClick={() => onSelectPriceRange(range.value)}
                className="flex items-center gap-3 cursor-pointer group transition-colors"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-zinc-100 border-slate-900 dark:border-zinc-100 text-white dark:text-zinc-900'
                      : 'border-slate-300 dark:border-zinc-700 group-hover:border-slate-500'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span
                  className={`text-xs sm:text-sm transition-colors ${
                    isSelected
                      ? 'font-bold text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white'
                  }`}
                >
                  {range.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand & Series Section */}
      {brands.length > 0 && (
        <div className="space-y-3 pb-5 border-b border-slate-200 dark:border-zinc-800">
          <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Brand & Series
          </h4>
          <div className="space-y-2.5">
            {['All', ...brands].map((brand) => {
              const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
              return (
                <div
                  key={brand}
                  onClick={() => onSelectBrand(brand)}
                  className="flex items-center gap-3 cursor-pointer group transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-zinc-100 border-slate-900 dark:border-zinc-100 text-white dark:text-zinc-900'
                        : 'border-slate-300 dark:border-zinc-700 group-hover:border-slate-500'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs sm:text-sm transition-colors ${
                      isSelected
                        ? 'font-bold text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                  >
                    {brand === 'All' ? 'All Brands' : brand}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset Action */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}

    </aside>
  );
};
