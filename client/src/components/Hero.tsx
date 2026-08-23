import React from 'react';
import { 
  Search, 
  X, 
  CheckCircle2, 
  SlidersHorizontal, 
  LayoutGrid, 
  Heart, 
  Package, 
  Sparkles, 
  Tag, 
  ArrowUpDown,
  RotateCcw,
  Layers
} from 'lucide-react';

interface HeroProps {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  brands: string[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  sort: string;
  onSortChange: (sort: string) => void;
  totalProducts: number;
  inStockCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  search,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  brands,
  selectedBrand,
  onSelectBrand,
  inStockOnly,
  onToggleInStock,
  sort,
  onSortChange,
  totalProducts,
  inStockCount
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'all':
        return LayoutGrid;
      case 'plush dolls':
        return Heart;
      case 'blind box':
        return Package;
      case 'action figures':
        return Sparkles;
      default:
        return Tag;
    }
  };

  const hasActiveFilters = search !== '' || selectedCategory !== 'All' || selectedBrand !== 'All' || inStockOnly;

  const handleResetFilters = () => {
    onSearchChange('');
    onSelectCategory('All');
    onSelectBrand('All');
    if (inStockOnly) onToggleInStock();
    onSortChange('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 space-y-4" id="catalog">
      
      {/* Main Filter Bar Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 sm:p-5 shadow-sm space-y-4 transition-colors">
        
        {/* Top Row: Search & Quick Actions */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products by title, character, brand (e.g. Labubu, Baby Three, Nommi)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700/80 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: In Stock Toggle + Sort */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            
            {/* In Stock Only Switch */}
            <button
              onClick={onToggleInStock}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                inStockOnly
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${inStockOnly ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
              <span>In Stock ({inStockCount})</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value)}
                  aria-label="Sort products"
                  className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>

        </div>

        {/* Categories Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 sm:w-20 shrink-0">
              Categories:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', ...categories].map((cat) => {
                const IconComponent = getCategoryIcon(cat);
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200/60 dark:border-zinc-800'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-zinc-400'}`} />
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Brands Bar */}
        {brands.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 sm:w-20 shrink-0">
                Brands:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', ...brands].map((brand) => {
                  const isSelected = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      onClick={() => onSelectBrand(brand)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                          : 'bg-slate-100 dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200/60 dark:border-zinc-800'
                      }`}
                    >
                      <span>{brand}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters & Summary Bar */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 dark:text-zinc-500 font-medium">Active:</span>
              
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 font-medium">
                  <span>Search: "{search}"</span>
                  <button onClick={() => onSearchChange('')} className="hover:text-rose-900 dark:hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-medium">
                  <span>Category: {selectedCategory}</span>
                  <button onClick={() => onSelectCategory('All')} className="hover:text-slate-900 dark:hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrand !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 font-medium">
                  <span>Brand: {selectedBrand}</span>
                  <button onClick={() => onSelectBrand('All')} className="hover:text-slate-900 dark:hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
                  <span>In Stock Only</span>
                  <button onClick={onToggleInStock} className="hover:text-emerald-900 dark:hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {/* Clear All Reset Button */}
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-slate-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
