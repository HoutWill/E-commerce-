<header
    class="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#121214]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-zinc-800 transition-colors"
    x-data="{
        headerSearch: '',
        executeSearch() {
            if (this.headerSearch.trim() === '') return;
            if (window.location.pathname !== '/' && !window.location.pathname.endsWith('home')) {
                window.location.href = '/?q=' + encodeURIComponent(this.headerSearch) + '#products';
            } else {
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                const catInput = document.querySelector('#catalog input[type=text]');
                if (catInput) {
                    catInput.value = this.headerSearch;
                    catInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }
    }"
>
    <div class="w-full flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 lg:px-8">
        
        <!-- 1. Start: Title & Icon (Left) -->
        <div class="flex-1 flex items-center justify-start">
            <a href="{{ route('home') }}" class="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0">
                <!-- Circular Logo Badge -->
                <div class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shadow-2xs border border-slate-200/90 dark:border-zinc-700 bg-white p-0.5 group-hover:scale-105 transition-all flex items-center justify-center shrink-0">
                    <img
                        src="/logo_crisp.png"
                        alt="Classy Bling Logo"
                        class="w-full h-full object-cover rounded-full"
                        loading="eager"
                        onerror="this.src='/logo.png'"
                    />
                </div>

                <!-- Brand Typography: Same font, bold, and balanced text size -->
                <span class="text-sm sm:text-base font-bold tracking-widest uppercase font-sans leading-tight text-slate-900 dark:text-white group-hover:text-[#229ED9] transition-colors">
                    CLASSY BLING
                </span>
            </a>
        </div>

        <!-- 2. Middle: 3 Links (Center) - Identical font, weight, size, and crisp color -->
        <nav class="hidden md:flex items-center justify-center gap-8 lg:gap-12 shrink-0">
            
            <!-- 1. HOME -->
            <a href="{{ route('home') }}"
               class="transition-colors py-1 relative font-bold text-sm tracking-widest uppercase font-sans text-slate-900 dark:text-white hover:text-[#229ED9] dark:hover:text-[#38bdf8]">
                <span>HOME</span>
                @if(request()->routeIs('home') && !request()->is('contact'))
                    <span class="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full"></span>
                @endif
            </a>

            <!-- 2. PRODUCTS (Acts as section on homepage) -->
            @if(request()->routeIs('home') || request()->is('/'))
                <a href="#products"
                   @click.prevent="document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })"
                   class="transition-colors py-1 relative font-bold text-sm tracking-widest uppercase font-sans text-slate-900 dark:text-white hover:text-[#229ED9] dark:hover:text-[#38bdf8] cursor-pointer">
                    <span>PRODUCTS</span>
                </a>
            @else
                <a href="{{ route('home') }}#products"
                   class="transition-colors py-1 relative font-bold text-sm tracking-widest uppercase font-sans text-slate-900 dark:text-white hover:text-[#229ED9] dark:hover:text-[#38bdf8]">
                    <span>PRODUCTS</span>
                </a>
            @endif

            <!-- 3. CONTACT (Dedicated Showroom Page) -->
            <a href="{{ route('contact') }}"
               class="transition-colors py-1 relative font-bold text-sm tracking-widest uppercase font-sans text-slate-900 dark:text-white hover:text-[#229ED9] dark:hover:text-[#38bdf8]">
                <span>CONTACT</span>
                @if(request()->routeIs('contact') || request()->is('contact'))
                    <span class="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white rounded-full"></span>
                @endif
            </a>

        </nav>

        <!-- 3. End: The last controls (Right) -->
        <div class="flex-1 flex items-center justify-end gap-2 sm:gap-3">
            
            <!-- Poseidon Style Search Bar Pill (Header 2 Reference) -->
            <div class="relative hidden lg:flex items-center">
                <input
                    type="text"
                    placeholder="Search collectibles..."
                    x-model="headerSearch"
                    @keydown.enter="executeSearch()"
                    class="w-40 xl:w-52 pl-3.5 pr-8 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-zinc-300 focus:bg-white dark:focus:bg-zinc-900 transition-all shadow-2xs font-sans"
                />
                <button
                    type="button"
                    @click="executeSearch()"
                    title="Search"
                    class="absolute right-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition cursor-pointer"
                >
                    <i class="bi bi-search text-xs"></i>
                </button>
            </div>

            <!-- TikTok Official Live Link Button -->
            <a
                href="{{ $settings['tiktok_url'] ?? 'https://www.tiktok.com/@classy.bling' }}"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok Live"
                title="Watch TikTok Live @classy.bling"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black hover:bg-neutral-800 text-white transition-all shadow-2xs hover:scale-105 active:scale-95 border border-zinc-800 font-sans"
            >
                <i class="bi bi-tiktok text-xs shrink-0"></i>
                <span class="text-xs sm:text-sm font-bold tracking-tight hidden sm:inline">TikTok</span>
            </a>

            <!-- Telegram Order Pill Button -->
            <a
                href="{{ $settings['telegram_url'] ?? 'https://t.me/+85592917831' }}"
                target="_blank"
                rel="noreferrer"
                aria-label="Order on Telegram"
                title="Chat & Order on Telegram"
                class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#229ED9]/10 hover:bg-[#229ED9]/20 text-[#229ED9] text-xs sm:text-sm font-bold transition-all border border-[#229ED9]/20 font-sans"
            >
                <i class="bi bi-send-fill text-xs"></i>
                <span>Telegram</span>
            </a>

            <!-- Theme Toggle Button (No Stars) -->
            <button
                id="theme-toggle-btn"
                @click="toggleTheme()"
                title="Toggle Theme"
                :aria-label="theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-700/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer shrink-0"
            >
                <i class="bi" :class="theme === 'dark' ? 'bi-sun-fill text-amber-400 text-xs sm:text-sm' : 'bi-moon-fill text-slate-700 text-xs sm:text-sm'"></i>
            </button>

            <!-- Staff / Admin Auth Button (Poseidon Pill Button Style) -->
            @auth
                <div class="dropdown dropdown-end font-sans">
                    <div tabindex="0" role="button" class="flex items-center gap-1.5 pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 transition cursor-pointer text-xs sm:text-sm font-bold">
                        <div class="w-6 h-6 rounded-full bg-[#229ED9] text-white font-black flex items-center justify-center text-[10px]">
                            {{ strtoupper(substr(Auth::user()->name, 0, 1)) }}
                        </div>
                        <span class="max-w-[70px] truncate hidden sm:inline text-slate-800 dark:text-zinc-200">
                            {{ Auth::user()->name }}
                        </span>
                        @if(Auth::user()->isAdmin())
                            <span class="px-1 py-0.2 rounded text-[9px] font-black uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400">Admin</span>
                        @endif
                        <i class="bi bi-chevron-down text-[10px] text-slate-400"></i>
                    </div>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow-xl bg-white dark:bg-zinc-900 rounded-2xl w-52 border border-slate-200 dark:border-zinc-800 mt-2 z-50">
                        <li class="menu-title text-[10px] uppercase font-bold text-slate-400">Account: {{ Auth::user()->email }}</li>
                        @if(Auth::user()->isAdmin())
                            <li>
                                <a href="{{ route('admin.dashboard') }}" class="font-bold text-[#229ED9] flex items-center gap-2">
                                    <i class="bi bi-speedometer2"></i> Admin Panel
                                </a>
                            </li>
                        @endif
                        <div class="divider my-1 border-slate-200 dark:border-zinc-800"></div>
                        <li>
                            <form method="POST" action="{{ route('logout') }}" class="w-full">
                                @csrf
                                <button type="submit" class="w-full text-left text-rose-500 hover:text-rose-600 flex items-center gap-2 font-semibold">
                                    <i class="bi bi-box-arrow-right"></i> Sign Out
                                </button>
                            </form>
                        </li>
                    </ul>
                </div>
            @else
                <button
                    @click="authModalOpen = true; authMode = 'login'"
                    title="Staff / Admin Login"
                    class="px-3.5 sm:px-4 py-1.5 rounded-full border border-slate-900 dark:border-zinc-200 text-slate-900 dark:text-zinc-100 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 text-xs sm:text-sm font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 font-sans"
                >
                    <i class="bi bi-person-fill text-xs sm:text-sm"></i>
                    <span>Login</span>
                </button>
            @endauth

        </div>

    </div>
</header>
