import React, { useState, useEffect } from 'react';
import { Send, ShieldCheck, Flame, Truck, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState({
    storeName: 'CLASSY BLING',
    address: 'Street 271, Sangkat Phsar Doeum Thkov, Khan Chamkarmon, Phnom Penh, Cambodia',
    googleMapsUrl: 'https://maps.google.com/?q=Phnom+Penh+Cambodia',
    telegramPhone: '092917831',
    telegramUrl: 'https://t.me/+85592917831',
    tiktokHandle: '@classy.bling',
    tiktokUrl: 'https://www.tiktok.com/@classy.bling',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
  });

  useEffect(() => {
    const saved = localStorage.getItem('classybling_store_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        // fallback
      }
    }
  }, []);

  return (
    <footer className="border-t border-stone-200/80 dark:border-zinc-800/80 bg-[#FAF7F2] dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 select-none pb-24 lg:pb-0 transition-colors">
      
      {/* 1. Top Social Follow Banner */}
      <div className="border-b border-stone-200/70 dark:border-zinc-800/80 py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-start gap-5">
          
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            FOLLOW US ON
          </span>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Facebook */}
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full bg-stone-200/60 dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Follow on Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full bg-stone-200/60 dark:bg-zinc-900 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-slate-700 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              title="Follow on Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="p-2 rounded-full bg-stone-200/60 dark:bg-zinc-900 hover:bg-slate-900 hover:text-white dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors"
              title="Follow on TikTok"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.95-4.5V8.09a8.28 8.28 0 0 0 4.82 1.55V6.19a4.85 4.85 0 0 1-1-.05v.55z"/>
              </svg>
            </a>

            {/* Telegram */}
            <a
              href={settings.telegramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="p-2 rounded-full bg-stone-200/60 dark:bg-zinc-900 hover:bg-[#229ED9]/10 text-slate-700 dark:text-zinc-300 hover:text-[#229ED9] transition-colors"
              title="Order on Telegram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
              </svg>
            </a>
          </div>

        </div>
      </div>

      {/* 2. 3-Column Clean Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          
          {/* Column 1: Brand & Physical Location Badge */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo_crisp.png"
                alt="Classy Bling Logo"
                className="w-11 h-11 rounded-xl object-contain bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs"
              />
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                {settings.storeName}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Curated viral TikTok blind boxes, luxury plush charms, and authentic designer art toys directly indexed from live unboxing streams.
            </p>

            {/* Seamless Blended Location Address & Map Pin */}
            <div className="p-3.5 rounded-2xl bg-stone-200/50 dark:bg-zinc-900/60 border border-stone-300/40 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-800 dark:text-zinc-200 font-semibold">
                <div className="w-6 h-6 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="leading-snug pt-0.5">{settings.address}</span>
              </div>

              {settings.googleMapsUrl && (
                <div className="pl-8.5">
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 font-bold shadow-2xs border border-stone-300/50 dark:border-zinc-700/60 transition-all text-[11px]"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-0.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Genuine Factory Sealed Guarantee</span>
            </div>
          </div>

          {/* Column 2: Popular Series */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              POPULAR SERIES
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#pop-now" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#E50012] shrink-0 fill-current" />
                  <span>Baby Three Zodiac Plush</span>
                </a>
              </li>
              <li>
                <a href="#pop-now" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  MEGA SPACE MOLLY 100%
                </a>
              </li>
              <li>
                <a href="#pop-now" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Nommi Pinky Energy Series
                </a>
              </li>
              <li>
                <a href="#pop-now" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Disney Stitch Sweet Dreams
                </a>
              </li>
              <li>
                <a href="#pop-now" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Molly Baking Time Collection
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Orders & Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              ORDERS & SUPPORT
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href={settings.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#229ED9] transition-colors flex items-center gap-2 font-bold text-[#229ED9]"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>Telegram Order: {settings.telegramPhone}</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  TikTok Live: {settings.tiktokHandle}
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Fast Express Dispatch & Secure Packing</span>
              </li>
              <li>
                <span className="text-slate-500 dark:text-zinc-400">
                  Verified Chase & Secret Probabilities
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Copyright Bar (Completely Public, No Admin Console link) */}
      <div className="border-t border-stone-200/80 dark:border-zinc-800/80 py-6 px-4 sm:px-6 lg:px-8 bg-stone-100/60 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
          <p>© 2026 {settings.storeName}. All rights reserved.</p>
          
          <div className="flex items-center gap-3 font-medium">
            <span>Verified Authenticity</span>
            <span>•</span>
            <span>Fast Dispatch</span>
            <span>•</span>
            <span>100% Genuine</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
