import React, { useState } from 'react';
import { Sun, Moon, Flame, Home, Package, Sparkles } from 'lucide-react';
import { TikTokIcon } from './icons/TikTokIcon';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [activeLink, setActiveLink] = useState('home');

  const scrollTo = (id: string, name: string) => {
    setActiveLink(name);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full py-2 sm:py-3 px-3 sm:px-6 lg:px-8 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-11 sm:h-14">
        
        {/* Left: Vibrant High-Contrast Logo & Brand Name */}
        <a
          href="#home"
          onClick={() => scrollTo('home', 'home')}
          className="flex items-center gap-2 sm:gap-3 group select-none shrink-0"
        >
          {/* Logo Badge */}
          <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-rose-200/80 dark:border-rose-500/30 bg-white p-0.5 group-hover:scale-105 transition-all flex items-center justify-center shrink-0">
            <img
              src="/logo_crisp.png"
              alt="Classy Bling Logo"
              className="w-full h-full object-cover rounded-lg sm:rounded-xl"
              loading="eager"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-2xl font-black tracking-tight font-display leading-tight text-slate-900 dark:text-white group-hover:text-[#229ED9] dark:group-hover:text-[#38bdf8] transition-colors">
              CLASSY BLING
            </span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400 animate-pulse hidden sm:inline-block" />
          </div>
        </a>

        {/* Center: 3-Item Capsule Nav Links for Laptop/Desktop */}
        <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-bold tracking-wide">
          
          {/* 1. Home */}
          <button
            onClick={() => scrollTo('home', 'home')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeLink === 'home'
                ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs font-extrabold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          {/* 2. POP NOW */}
          <button
            onClick={() => scrollTo('pop-now', 'pop-now')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeLink === 'pop-now'
                ? 'bg-[#E50012] text-white shadow-xs font-extrabold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#E50012] group-hover:text-white fill-current" />
            <span>POP NOW</span>
          </button>

          {/* 3. Catalog */}
          <button
            onClick={() => scrollTo('catalog', 'catalog')}
            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeLink === 'catalog'
                ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs font-extrabold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>

        </nav>

        {/* Right: Clean Action Controls (TikTok, Telegram, Theme) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* TikTok Official Live Link Button */}
          <a
            href="https://www.tiktok.com/@classy.bling"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok Live"
            title="Watch TikTok Live @classy.bling"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-black hover:bg-neutral-900 text-white transition-all shadow-xs hover:scale-105 active:scale-95 border border-zinc-800"
          >
            <TikTokIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[11px] sm:text-xs font-black tracking-tight">TikTok</span>
          </a>

          {/* Telegram Order Pill Button (Desktop & Tablet) */}
          <a
            href="https://t.me/+85592917831"
            target="_blank"
            rel="noreferrer"
            aria-label="Order on Telegram"
            title="Chat & Order on Telegram"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#229ED9]/10 hover:bg-[#229ED9]/20 text-[#229ED9] text-xs font-bold transition-all border border-[#229ED9]/20"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
            </svg>
            <span>Telegram</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer shrink-0"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-zinc-200" />
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
