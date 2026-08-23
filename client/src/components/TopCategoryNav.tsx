import React from 'react';
import { Sparkles, Flame, ChevronDown } from 'lucide-react';

interface TopCategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const TopCategoryNav: React.FC<TopCategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const navItems = [
    { label: 'ALL PRODUCTS', value: 'All', hasDropdown: false },
    { label: 'POP NOW', value: 'POP NOW', isSpecial: true, hasDropdown: false },
    { label: 'PLUSH DOLLS', value: 'Plush Dolls', hasDropdown: false },
    { label: 'BLIND BOX', value: 'Blind Box', hasDropdown: false },
    { label: 'ACTION FIGURES', value: 'Action Figures', hasDropdown: false },
    { label: 'BABY THREE', value: 'Baby Three', isBrand: true, hasDropdown: false },
    { label: 'POP MART', value: 'Pop Mart', isBrand: true, hasDropdown: false },
    { label: 'TELEGRAM ORDERS', value: 'telegram', isAction: true, hasDropdown: false },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (item.value === 'POP NOW') {
      const el = document.getElementById('pop-now');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (item.isAction) {
      window.open('https://t.me/+85592917831', '_blank');
    } else {
      onSelectCategory(item.value);
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full border-b border-slate-200 dark:border-zinc-800/90 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md sticky top-18 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:justify-center gap-1 sm:gap-6 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold tracking-wider uppercase">
          
          {navItems.map((item) => {
            const isSelected = selectedCategory.toLowerCase() === item.value.toLowerCase();
            return (
              <button
                key={item.label}
                onClick={() => handleClick(item)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                  item.isSpecial
                    ? 'text-[#E50012] font-black hover:bg-rose-50 dark:hover:bg-rose-950/50'
                    : isSelected
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 font-black'
                    : 'text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900'
                }`}
              >
                {item.isSpecial && <Flame className="w-3.5 h-3.5 text-[#E50012] shrink-0 fill-current" />}
                <span>{item.label}</span>
                {item.hasDropdown && <ChevronDown className="w-3 h-3 text-slate-400" />}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};
