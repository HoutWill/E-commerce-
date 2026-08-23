import React, { useState } from 'react';
import { Home, Package, Flame } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'promo'>('home');

  const scrollToSection = (id: string, tab: typeof activeTab) => {
    setActiveTab(tab);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    // Visible ONLY on Phone and Tablet (hidden on laptop / desktop >= 1024px)
    <div className="lg:hidden fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-50 select-none">
      <nav className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-slate-200/90 dark:border-zinc-700/80 backdrop-blur-xl shadow-2xl transition-all">
        
        {/* 1. Home */}
        <button
          onClick={() => scrollToSection('home', 'home')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-all duration-200 active:scale-95 ${
            activeTab === 'home'
              ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md font-bold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Home className="w-5 h-5 sm:w-5.5 sm:h-5.5 shrink-0" />
          <span className="text-xs sm:text-sm font-bold tracking-tight">Home</span>
        </button>

        {/* 2. Catalog */}
        <button
          onClick={() => scrollToSection('catalog', 'catalog')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-all duration-200 active:scale-95 ${
            activeTab === 'catalog'
              ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md font-bold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Package className="w-5 h-5 sm:w-5.5 sm:h-5.5 shrink-0" />
          <span className="text-xs sm:text-sm font-bold tracking-tight">Catalog</span>
        </button>

        {/* 3. Promo / POP NOW */}
        <button
          onClick={() => scrollToSection('pop-now', 'promo')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full transition-all duration-200 active:scale-95 ${
            activeTab === 'promo'
              ? 'bg-[#E50012] text-white shadow-md font-bold'
              : 'text-slate-600 dark:text-zinc-400 hover:text-[#E50012] hover:bg-rose-50 dark:hover:bg-rose-950/40'
          }`}
        >
          <Flame className="w-5 h-5 sm:w-5.5 sm:h-5.5 shrink-0 fill-current text-[#E50012] group-hover:text-white" />
          <span className="text-xs sm:text-sm font-bold tracking-tight">Promo</span>
        </button>

      </nav>
    </div>
  );
};
