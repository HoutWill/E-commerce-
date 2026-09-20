<!-- Mobile Bottom Navigation Bar (btmnavbar) -->
<nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-zinc-800 px-4 py-2 shadow-2xl transition-colors duration-200">
    <div class="flex items-center justify-around max-w-md mx-auto">
        
        <!-- Action 1: Home -->
        <a href="{{ route('home') }}"
           class="flex flex-col items-center gap-0.5 text-center py-1 px-2.5 rounded-xl transition {{ (request()->routeIs('home') || request()->is('/')) && !request()->routeIs('products.*') && !request()->is('products*') && !request()->routeIs('contact') && !request()->is('contact') ? 'text-[#229ED9] font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white' }}">
            <i class="bi bi-house-door-fill text-lg"></i>
            <span class="text-[10px] font-bold">Home</span>
        </a>

        <!-- Action 2: Product (Section on Homepage) -->
        @if(request()->routeIs('home') || request()->is('/'))
            <a href="#products"
               @click.prevent="document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })"
               class="flex flex-col items-center gap-0.5 text-center py-1 px-2.5 rounded-xl transition text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                <i class="bi bi-box-seam-fill text-lg"></i>
                <span class="text-[10px] font-bold">Product</span>
            </a>
        @else
            <a href="{{ route('home') }}#products"
               class="flex flex-col items-center gap-0.5 text-center py-1 px-2.5 rounded-xl transition text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white">
                <i class="bi bi-box-seam-fill text-lg"></i>
                <span class="text-[10px] font-bold">Product</span>
            </a>
        @endif

        <!-- Action 3: Contact -->
        <a href="{{ route('contact') }}"
           class="flex flex-col items-center gap-0.5 text-center py-1 px-2.5 rounded-xl transition {{ request()->routeIs('contact') || request()->is('contact') ? 'text-[#229ED9] font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white' }}">
            <i class="bi bi-telephone-fill text-lg"></i>
            <span class="text-[10px] font-bold">Contact</span>
        </a>

        <!-- Action 4: Telegram -->
        <a href="{{ $settings['telegram_url'] ?? 'https://t.me/+85592917831' }}" target="_blank"
           class="flex flex-col items-center gap-0.5 text-center py-1 px-2.5 rounded-xl transition text-[#229ED9] hover:opacity-80">
            <div class="relative">
                <i class="bi bi-send-fill text-lg"></i>
                <span class="w-2 h-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse"></span>
            </div>
            <span class="text-[10px] font-bold">Telegram</span>
        </a>

        <!-- Action 5: Account / Admin Panel -->
        @auth
            @if(Auth::user()->isAdmin())
                <a href="{{ route('admin.dashboard') }}"
                   class="flex flex-col items-center gap-0.5 text-center py-1 px-3 rounded-xl text-[#229ED9] font-bold transition">
                    <i class="bi bi-speedometer2 text-lg"></i>
                    <span class="text-[10px]">Admin</span>
                </a>
            @else
                <button @click="authModalOpen = true"
                        class="flex flex-col items-center gap-0.5 text-center py-1 px-3 rounded-xl text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition">
                    <i class="bi bi-person-circle text-lg"></i>
                    <span class="text-[10px]">Profile</span>
                </button>
            @endif
        @else
            <button @click="authModalOpen = true; authMode = 'login'"
                    class="flex flex-col items-center gap-0.5 text-center py-1 px-3 rounded-xl text-slate-600 dark:text-zinc-400 hover:text-[#229ED9] transition">
                <i class="bi bi-person-fill text-lg"></i>
                <span class="text-[10px]">Login</span>
            </button>
        @endauth

    </div>
</nav>
