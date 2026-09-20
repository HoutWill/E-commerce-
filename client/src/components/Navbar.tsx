import React, { useState } from 'react';
import { Search, Heart, Bag, List, XLg, Sun, Moon } from 'react-bootstrap-icons';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSearchClick?: () => void;
  cartCount?: number;
  wishlistCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onSearchClick,
  cartCount = 0,
  wishlistCount = 0
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  const navLinks = [
    { label: 'Home', href: '#home', targetId: 'home' },
    { label: 'Products', href: '#catalog', targetId: 'catalog' },
    { label: 'Contact', href: '#footer', targetId: 'footer' }
  ];

  const handleNavClick = (item: typeof navLinks[0]) => {
    setActiveItem(item.label);
    setMobileMenuOpen(false);
    const el = document.getElementById(item.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSearch = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#121214]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* 1. Start: Title & Icon (Left) */}
        <div className="flex-1 flex items-center justify-start">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-slate-200/90 dark:border-zinc-700 bg-white p-0.5 group-hover:scale-105 transition-all flex items-center justify-center shrink-0">
              <img
                src="/logo_crisp.png"
                alt="Classy Bling Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <span className="text-sm sm:text-base font-bold tracking-widest uppercase font-sans leading-tight text-slate-900 dark:text-white group-hover:text-[#229ED9] transition-colors">
              CLASSY BLING
            </span>
          </a>
        </div>

        {/* 2. Middle: 3 Links (Center) - Same font, weight, and size */}
        <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-12 shrink-0">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className={`transition-colors py-1 relative font-bold text-sm tracking-widest uppercase font-sans ${
                activeItem === link.label
                  ? 'text-slate-950 dark:text-white'
                  : 'text-slate-500 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span>{link.label}</span>
              {activeItem === link.label && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* 3. End: The last controls (Right) */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
          
          {/* Search Button */}
          <button
            onClick={handleOpenSearch}
            aria-label="Search catalog"
            className="p-2 text-[#71717A] hover:text-[#1A1A1A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#1F1F23] rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist */}
          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Wishlist"
            className="relative p-2 text-[#71717A] hover:text-[#1A1A1A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#1F1F23] rounded-lg transition-colors"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C25E3E] rounded-full" />
            )}
          </a>

          {/* Cart / Bag */}
          <button
            onClick={() => window.open('https://t.me/+85592917831', '_blank')}
            aria-label="Telegram Order Bag"
            className="relative p-2 text-[#71717A] hover:text-[#1A1A1A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#1F1F23] rounded-lg transition-colors"
            title="Orders via Telegram"
          >
            <Bag className="w-3.5 h-3.5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 px-1 min-w-[14px] h-[14px] bg-[#C25E3E] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-[#71717A] hover:text-[#1A1A1A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#1F1F23] rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Mobile Hamburger Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 text-[#71717A] hover:text-[#1A1A1A] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#1F1F23] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <XLg className="w-4 h-4" /> : <List className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAE7E1] dark:border-[#2C2C30] bg-[#FBFBFA] dark:bg-[#121214] px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#1A1A1A] dark:text-[#F4F4F5] hover:bg-[#F5F3EF] dark:hover:bg-[#1F1F23] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-[#EAE7E1] dark:border-[#2C2C30] flex items-center justify-between px-3">
            <span className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Orders via Telegram</span>
            <a
              href="https://t.me/+85592917831"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#C25E3E] hover:underline"
            >
              @classy.bling
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
