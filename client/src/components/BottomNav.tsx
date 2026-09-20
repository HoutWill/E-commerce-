import React, { useState } from 'react';
import { House, BoxSeam, Fire } from 'react-bootstrap-icons';

interface BottomNavProps {
  isHidden?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ isHidden = false }) => {
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
    <div
      className={`lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 select-none transition-all duration-300 ease-in-out ${
        isHidden
          ? 'translate-y-28 opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <nav className="flex items-center gap-1 p-1 rounded-xl bg-[#FBFBFA]/95 dark:bg-[#18181B]/95 border border-[#EAE7E1] dark:border-[#2C2C30] backdrop-blur-md shadow-lg transition-all">
        
        {/* 1. Home */}
        <button
          onClick={() => scrollToSection('home', 'home')}
          aria-label="Home"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors text-xs font-semibold ${
            activeTab === 'home'
              ? 'bg-[#1A1A1A] dark:bg-[#F4F4F5] text-white dark:text-[#1A1A1A]'
              : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#1A1A1A]'
          }`}
        >
          <House className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {/* 2. Catalog */}
        <button
          onClick={() => scrollToSection('catalog', 'catalog')}
          aria-label="Catalog"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors text-xs font-semibold ${
            activeTab === 'catalog'
              ? 'bg-[#1A1A1A] dark:bg-[#F4F4F5] text-white dark:text-[#1A1A1A]'
              : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#1A1A1A]'
          }`}
        >
          <BoxSeam className="w-3.5 h-3.5" />
          <span>Catalog</span>
        </button>

        {/* 3. Promo / Drops */}
        <button
          onClick={() => scrollToSection('pop-now', 'promo')}
          aria-label="Popular Drops"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors text-xs font-semibold ${
            activeTab === 'promo'
              ? 'bg-[#C25E3E] text-white'
              : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#C25E3E]'
          }`}
        >
          <Fire className="w-3.5 h-3.5" />
          <span>Drops</span>
        </button>

      </nav>
    </div>
  );
};
