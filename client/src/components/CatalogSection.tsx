import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  XLg, 
  ArrowRepeat, 
  BoxSeam, 
  Sliders, 
  ChevronDown,
  CheckLg
} from 'react-bootstrap-icons';

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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const brandOptions = [
    'All Brands',
    'Pop Mart',
    'Baby Three',
    'Disney',
    'Sanrio',
    'Nommi',
    'Classy Bling Arcade'
  ];

  const seriesOptions = [
    'All Series',
    'The Monsters Tasty Macarons',
    'Sunset Concert Series',
    'Pocket Bunny Series',
    'Zodiac Star Signs',
    'Doll Machine Game Series'
  ];

  const priceOptions = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $14', value: 'under_12' },
    { label: '$14 – $18', value: '12_15' },
    { label: '$18 & Above', value: 'over_15' }
  ];

  const handleBrandSelect = (brand: string) => {
    setActiveDropdown(null);
    if (brand === 'All Brands') {
      onSelectCategory('All');
    } else {
      onSearchChange(brand);
    }
  };

  const handleSeriesSelect = (series: string) => {
    setActiveDropdown(null);
    if (series === 'All Series') {
      onSearchChange('');
    } else {
      onSearchChange(series);
    }
  };

  const handlePriceSelect = (val: string) => {
    setActiveDropdown(null);
    onSelectSubFilter(val);
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8" id="catalog">
      
      {/* Sticky Compact Search & Filter Controls */}
      <div className="sticky top-14 sm:top-16 z-30 bg-[#FBFBFA]/95 dark:bg-[#121214]/95 backdrop-blur-md pt-2 pb-3 mb-4 sm:mb-6 border-b border-[#EAE7E1] dark:border-[#2C2C30]">
        
        {/* Top Row: Search Input + Filter Drawer Button + Sort */}
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          
          {/* Minimalist Search Field */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] dark:text-[#A1A1AA]" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search collectible, series, or character..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-[#EAE7E1] dark:border-[#2C2C30] bg-white dark:bg-[#18181B] text-[#1A1A1A] dark:text-[#F4F4F5] text-xs sm:text-sm focus:outline-none focus:border-[#C25E3E] transition-colors"
            />
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#71717A] hover:text-[#1A1A1A]"
              >
                <XLg className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Drawer Button */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#EAE7E1] dark:border-[#2C2C30] bg-white dark:bg-[#18181B] text-xs font-semibold text-[#1A1A1A] dark:text-[#F4F4F5] hover:border-[#D6D2C9] transition-colors shrink-0 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {selectedSubFilter !== 'all' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C25E3E]" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="shrink-0">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort products"
              className="text-xs font-semibold bg-white dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] rounded-lg px-2.5 py-2 text-[#1A1A1A] dark:text-[#F4F4F5] focus:outline-none focus:border-[#C25E3E] cursor-pointer"
            >
              <option value="newest">Newest Drops</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Filter Chips Row: All | Brand | Series | Category | Price */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-xs">
          
          {/* 'All' Chip */}
          <button
            onClick={() => {
              onSelectCategory('All');
              onSelectSubFilter('all');
              onSearchChange('');
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
              selectedCategory === 'All' && selectedSubFilter === 'all' && !search
                ? 'bg-[#1A1A1A] dark:bg-[#F4F4F5] text-white dark:text-[#1A1A1A] font-semibold'
                : 'bg-white dark:bg-[#18181B] text-[#71717A] dark:text-[#A1A1AA] border border-[#EAE7E1] dark:border-[#2C2C30] hover:text-[#1A1A1A]'
            }`}
          >
            All
          </button>

          {/* Category Chips */}
          {['Plush Dolls', 'Blind Box', 'Limited Edition', 'Action Figures'].map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(selectedCategory === cat ? 'All' : cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] dark:bg-[#F4F4F5] text-white dark:text-[#1A1A1A] font-semibold'
                  : 'bg-white dark:bg-[#18181B] text-[#71717A] dark:text-[#A1A1AA] border border-[#EAE7E1] dark:border-[#2C2C30] hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Brand Dropdown Chip */}
          <div className="relative shrink-0">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'brand' ? null : 'brand')}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#18181B] text-[#71717A] dark:text-[#A1A1AA] border border-[#EAE7E1] dark:border-[#2C2C30] hover:text-[#1A1A1A] font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Brand</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {activeDropdown === 'brand' && (
              <div className="absolute top-full mt-1.5 left-0 z-50 w-44 rounded-lg bg-white dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] shadow-md py-1">
                {brandOptions.map((b) => (
                  <button
                    key={b}
                    onClick={() => handleBrandSelect(b)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#202024] transition-colors"
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Series Dropdown Chip */}
          <div className="relative shrink-0">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'series' ? null : 'series')}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#18181B] text-[#71717A] dark:text-[#A1A1AA] border border-[#EAE7E1] dark:border-[#2C2C30] hover:text-[#1A1A1A] font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Series</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {activeDropdown === 'series' && (
              <div className="absolute top-full mt-1.5 left-0 z-50 w-56 rounded-lg bg-white dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] shadow-md py-1">
                {seriesOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSeriesSelect(s)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#202024] transition-colors truncate"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Dropdown Chip */}
          <div className="relative shrink-0">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
              className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1 cursor-pointer ${
                selectedSubFilter !== 'all'
                  ? 'bg-[#1A1A1A] text-white dark:bg-[#F4F4F5] dark:text-[#1A1A1A] border-transparent'
                  : 'bg-white dark:bg-[#18181B] text-[#71717A] dark:text-[#A1A1AA] border-[#EAE7E1] dark:border-[#2C2C30]'
              }`}
            >
              <span>Price</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {activeDropdown === 'price' && (
              <div className="absolute top-full mt-1.5 left-0 z-50 w-40 rounded-lg bg-white dark:bg-[#18181B] border border-[#EAE7E1] dark:border-[#2C2C30] shadow-md py-1">
                {priceOptions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => handlePriceSelect(p.value)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1A1A1A] dark:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#202024] transition-colors flex items-center justify-between"
                  >
                    <span>{p.label}</span>
                    {selectedSubFilter === p.value && <CheckLg className="w-3 h-3 text-[#C25E3E]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Product Grid Area (Mobile: 2 columns, Desktop: 4 columns) */}
      <div>
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <ArrowRepeat className="w-6 h-6 text-[#C25E3E] animate-spin" />
            <p className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA]">
              Loading catalog...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] dark:bg-[#1F1F23] border border-[#EAE7E1] dark:border-[#2C2C30] mx-auto flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] mb-3">
              <BoxSeam className="w-6 h-6" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
              No matching collectibles found
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">
              Try changing the category or clearing your search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
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

      {/* Filter Drawer / Slide-Over */}
      {filterDrawerOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-xs select-none"
          onClick={() => setFilterDrawerOpen(false)}
        >
          <div
            className="w-full max-w-xs sm:max-w-sm h-full bg-[#FBFBFA] dark:bg-[#121214] border-l border-[#EAE7E1] dark:border-[#2C2C30] p-6 overflow-y-auto flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE7E1] dark:border-[#2C2C30]">
                <h3 className="text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                  Filter Catalog
                </h3>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  aria-label="Close filters"
                  className="p-1 rounded-lg text-[#71717A] hover:text-[#1A1A1A]"
                >
                  <XLg className="w-4 h-4" />
                </button>
              </div>

              {/* Status Filter */}
              <div>
                <span className="text-[11px] font-bold text-[#8C7E72] uppercase tracking-wider block mb-2">
                  Availability
                </span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => onSelectSubFilter(selectedSubFilter === 'in_stock' ? 'all' : 'in_stock')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between border transition-colors ${
                      selectedSubFilter === 'in_stock'
                        ? 'bg-[#1A1A1A] text-white border-transparent'
                        : 'bg-white dark:bg-[#18181B] border-[#EAE7E1] dark:border-[#2C2C30] text-[#1A1A1A] dark:text-[#F4F4F5]'
                    }`}
                  >
                    <span>In Stock Only</span>
                    {selectedSubFilter === 'in_stock' && <CheckLg className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div>
                <span className="text-[11px] font-bold text-[#8C7E72] uppercase tracking-wider block mb-2">
                  Categories
                </span>
                <div className="space-y-1">
                  {['All', 'Plush Dolls', 'Blind Box', 'Limited Edition', 'Action Figures'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => onSelectCategory(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        selectedCategory === cat
                          ? 'font-bold text-[#C25E3E] bg-[#FDF4F0] dark:bg-[#2C1A14]'
                          : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Ranges */}
              <div>
                <span className="text-[11px] font-bold text-[#8C7E72] uppercase tracking-wider block mb-2">
                  Price Range
                </span>
                <div className="space-y-1">
                  {priceOptions.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => onSelectSubFilter(p.value)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        selectedSubFilter === p.value
                          ? 'font-bold text-[#C25E3E] bg-[#FDF4F0] dark:bg-[#2C1A14]'
                          : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Reset & Apply */}
            <div className="pt-6 border-t border-[#EAE7E1] dark:border-[#2C2C30] flex gap-2">
              <button
                onClick={() => {
                  onSelectCategory('All');
                  onSelectSubFilter('all');
                  onSearchChange('');
                  setFilterDrawerOpen(false);
                }}
                className="flex-1 py-2.5 rounded-lg border border-[#EAE7E1] dark:border-[#2C2C30] text-xs font-semibold text-[#71717A] hover:text-[#1A1A1A]"
              >
                Reset All
              </button>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#C25E3E] text-white text-xs font-semibold hover:bg-[#A94F32]"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
