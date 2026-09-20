<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="pinion" data-tune="editorial" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'CLASSY BLING — Viral Blind Boxes & Luxury Collectibles | Phnom Penh')</title>
    <meta name="description" content="Discover viral designer toys, authentic blind boxes, Pop Mart, Baby Three, and mini claw machines at Classy Bling Phnom Penh. Direct TikTok unboxings and express dispatch.">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">

    <!-- Immediate Theme Initialization Script (Zero FOUC / Pure White Mode Default) -->
    <script>
        (function() {
            const saved = localStorage.getItem('classybling_theme');
            const theme = (saved === 'dark' || saved === 'light') ? saved : 'light';
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'light');
            }
        })();
    </script>

    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            -webkit-tap-highlight-color: transparent;
        }
        .font-heading {
            font-family: 'Space Grotesk', sans-serif;
        }
        /* Custom smooth scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.03);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.15);
            border-radius: 9999px;
        }
        .dark ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>

    @stack('styles')
</head>
<body class="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 antialiased flex flex-col selection:bg-[#229ED9]/20 selection:text-[#229ED9] pb-20 md:pb-0"
      x-data="{
          mobileSearchOpen: false,
          authModalOpen: {{ (session('login_error') || session('login_required')) ? 'true' : 'false' }},
          authMode: 'login',
          activeProduct: null,
          productModalOpen: false,
          cartCount: 0,
          theme: localStorage.getItem('classybling_theme') || 'light',
          toggleTheme() {
              this.theme = this.theme === 'dark' ? 'light' : 'dark';
              if (this.theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
              } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
              }
              localStorage.setItem('classybling_theme', this.theme);
          },
          openProductModal(product) {
              this.activeProduct = product;
              this.productModalOpen = true;
          }
      }"
      x-init="
          if (theme === 'dark') {
              document.documentElement.classList.add('dark');
              document.documentElement.setAttribute('data-theme', 'dark');
          } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.setAttribute('data-theme', 'light');
          }
      ">


    <!-- Main Navigation Header (Ref 3 Flexible Header) -->
    @include('components.navbar')

    <!-- Flash Notifications -->
    <div class="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        @if(session('success'))
            <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 5000)"
                 class="pointer-events-auto flex items-center gap-3 p-4 rounded-xl bg-success text-success-content shadow-xl border border-success/30 transition duration-300">
                <i class="bi bi-check-circle-fill text-xl"></i>
                <div class="text-sm font-medium">{{ session('success') }}</div>
                <button @click="show = false" class="btn btn-ghost btn-xs btn-circle ml-auto"><i class="bi bi-x"></i></button>
            </div>
        @endif

        @if(session('error'))
            <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 6000)"
                 class="pointer-events-auto flex items-center gap-3 p-4 rounded-xl bg-error text-error-content shadow-xl border border-error/30 transition duration-300">
                <i class="bi bi-exclamation-triangle-fill text-xl"></i>
                <div class="text-sm font-medium">{{ session('error') }}</div>
                <button @click="show = false" class="btn btn-ghost btn-xs btn-circle ml-auto"><i class="bi bi-x"></i></button>
            </div>
        @endif

        @if(session('info'))
            <div x-data="{ show: true }" x-show="show" x-init="setTimeout(() => show = false, 4000)"
                 class="pointer-events-auto flex items-center gap-3 p-4 rounded-xl bg-info text-info-content shadow-xl border border-info/30 transition duration-300">
                <i class="bi bi-info-circle-fill text-xl"></i>
                <div class="text-sm font-medium">{{ session('info') }}</div>
                <button @click="show = false" class="btn btn-ghost btn-xs btn-circle ml-auto"><i class="bi bi-x"></i></button>
            </div>
        @endif
    </div>

    <!-- Main Content Area -->
    <main class="flex-grow">
        @yield('content')
    </main>

    <!-- Footer (Original Classy Bling Signature Design) -->
    <footer class="bg-slate-50/80 dark:bg-[#121214] text-slate-600 dark:text-zinc-400 border-t border-slate-200/80 dark:border-zinc-800 transition-colors select-none mt-12" id="about">
        <!-- 1. Top Social Bar -->
        <div class="border-b border-slate-200/80 dark:border-zinc-800/80 py-3.5 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <span class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    FOLLOW US ON
                </span>

                <div class="flex items-center gap-2">
                    <!-- TikTok -->
                    <a
                        href="{{ $settings['tiktok_url'] ?? 'https://www.tiktok.com/@classy.bling' }}"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="TikTok"
                        class="p-2 rounded-full bg-slate-200/70 dark:bg-zinc-900 hover:bg-black hover:text-white text-slate-700 dark:text-zinc-300 transition-colors"
                        title="Follow on TikTok"
                    >
                        <i class="bi bi-tiktok text-sm"></i>
                    </a>

                    <!-- Telegram -->
                    <a
                        href="{{ $settings['telegram_url'] ?? 'https://t.me/+85592917831' }}"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Telegram"
                        class="p-2 rounded-full bg-slate-200/70 dark:bg-zinc-900 hover:bg-[#229ED9]/10 text-slate-700 dark:text-zinc-300 hover:text-[#229ED9] transition-colors"
                        title="Order on Telegram"
                    >
                        <i class="bi bi-send-fill text-sm"></i>
                    </a>
                </div>
            </div>
        </div>

        <!-- 2. 3-Column Clean Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                
                <!-- Column 1: Brand & Physical Location Badge -->
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <img
                            src="/logo_crisp.png"
                            alt="Classy Bling Logo"
                            class="w-11 h-11 rounded-xl object-contain bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs"
                            onerror="this.src='/logo.png'"
                        />
                        <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                            {{ $settings['store_name'] ?? 'CLASSY BLING' }}
                        </span>
                    </div>
                    
                    <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                        Curated viral TikTok blind boxes, luxury plush charms, and authentic designer art toys directly indexed from live unboxing streams.
                    </p>

                    <!-- Seamless Blended Location Address & Map Pin -->
                    <div class="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/90 dark:border-zinc-800 space-y-2 text-xs shadow-2xs">
                        <div class="flex items-start gap-2.5 text-slate-800 dark:text-zinc-200 font-semibold">
                            <div class="w-6 h-6 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                                <i class="bi bi-geo-alt-fill text-xs"></i>
                            </div>
                            <span class="leading-snug pt-0.5">{{ $settings['address'] ?? 'Classy Bling, Khan Por Senchey / Chom Chao, Phnom Penh, Cambodia' }}</span>
                        </div>

                        @if(!empty($settings['google_maps_url']))
                            <div class="pl-8.5">
                                <a
                                    href="{{ $settings['google_maps_url'] }}"
                                    target="_blank"
                                    rel="noreferrer"
                                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 font-bold shadow-2xs border border-slate-200 dark:border-zinc-700/60 transition-all text-[11px]"
                                >
                                    <span>View on Google Maps</span>
                                    <i class="bi bi-box-arrow-up-right text-[10px] text-slate-400"></i>
                                </a>
                            </div>
                        @endif
                    </div>

                    <div class="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-0.5">
                        <i class="bi bi-shield-check text-sm shrink-0"></i>
                        <span>100% Genuine Factory Sealed Guarantee</span>
                    </div>
                </div>

                <!-- Column 2: Popular Series -->
                <div class="space-y-3">
                    <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        POPULAR SERIES
                    </h4>
                    <ul class="space-y-2.5 text-xs sm:text-sm">
                        <li>
                            <a href="#pop-now" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5">
                                <i class="bi bi-fire text-[#E50012] text-xs shrink-0"></i>
                                <span>Baby Three Zodiac Plush</span>
                            </a>
                        </li>
                        <li>
                            <a href="#pop-now" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                                MEGA SPACE MOLLY 100%
                            </a>
                        </li>
                        <li>
                            <a href="#pop-now" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                                Nommi Pinky Energy Series
                            </a>
                        </li>
                        <li>
                            <a href="#pop-now" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                                Disney Stitch Sweet Dreams
                            </a>
                        </li>
                        <li>
                            <a href="#pop-now" class="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                                Molly Baking Time Collection
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Column 3: Orders & Customer Support -->
                <div class="space-y-3">
                    <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        ORDERS & SUPPORT
                    </h4>
                    <ul class="space-y-2.5 text-xs sm:text-sm">
                        <li>
                            <a
                                href="{{ $settings['telegram_url'] ?? 'https://t.me/+85592917831' }}"
                                target="_blank"
                                rel="noreferrer"
                                class="hover:text-[#229ED9] transition-colors flex items-center gap-2 font-bold text-[#229ED9]"
                            >
                                <i class="bi bi-send-fill text-xs shrink-0"></i>
                                <span>Telegram Order: {{ $settings['telegram_phone'] ?? '092917831' }}</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="{{ $settings['tiktok_url'] ?? 'https://www.tiktok.com/@classy.bling' }}"
                                target="_blank"
                                rel="noreferrer"
                                class="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
                            >
                                <i class="bi bi-tiktok text-xs shrink-0 text-slate-800 dark:text-zinc-200"></i>
                                <span>TikTok Live: {{ $settings['tiktok_handle'] ?? '@classy.bling' }}</span>
                            </a>
                        </li>
                        <li class="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                            <i class="bi bi-truck text-emerald-600 dark:text-emerald-400 text-xs shrink-0"></i>
                            <span>Fast Express Dispatch & Secure Packing</span>
                        </li>
                        <li>
                            <span class="text-slate-500 dark:text-zinc-400">
                                Verified Chase & Secret Probabilities
                            </span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>

        <!-- 3. Bottom Copyright Bar -->
        <div class="border-t border-slate-200/80 dark:border-zinc-800/80 py-6 px-4 sm:px-6 lg:px-8 bg-slate-100/70 dark:bg-zinc-950">
            <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
                <p>© {{ date('Y') }} {{ $settings['store_name'] ?? 'CLASSY BLING' }}. All rights reserved.</p>
                
                <div class="flex items-center gap-3 font-medium">
                    <span>Verified Authenticity</span>
                    <span>•</span>
                    <span>Fast Dispatch</span>
                    <span>•</span>
                    <span>100% Genuine</span>
                </div>

                <div class="flex items-center gap-3">
                    @auth
                        @if(Auth::user()->isAdmin())
                            <a href="{{ route('admin.dashboard') }}" class="font-bold text-[#229ED9] hover:underline flex items-center gap-1">
                                <i class="bi bi-speedometer2"></i> Admin Panel
                            </a>
                        @else
                            <span>{{ Auth::user()->name }}</span>
                        @endif
                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="hover:text-rose-500 cursor-pointer">Sign Out</button>
                        </form>
                    @else
                        <button @click="authModalOpen = true; authMode = 'login'" class="font-semibold text-slate-600 dark:text-zinc-300 hover:text-[#229ED9] cursor-pointer">
                            Staff / Admin Login
                        </button>
                    @endauth
                </div>
            </div>
        </div>
    </footer>

    <!-- Global Modals & Navigation Components -->
    @include('components.auth-modal')
    @include('components.product-modal')
    @include('components.bottom-nav')

    @stack('scripts')
</body>
</html>
