<!-- Authentication Modal (Sign In / Register) -->
<div x-show="authModalOpen"
     x-transition:enter="transition ease-out duration-200"
     x-transition:enter-start="opacity-0"
     x-transition:enter-end="opacity-100"
     x-transition:leave="transition ease-in duration-150"
     x-transition:leave-start="opacity-100"
     x-transition:leave-end="opacity-0"
     class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
     style="display: none;"
     @keydown.escape.window="authModalOpen = false">

    <!-- Modal Box -->
    <div x-show="authModalOpen"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 scale-95"
         x-transition:enter-end="opacity-100 scale-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100 scale-100"
         x-transition:leave-end="opacity-0 scale-95"
         @click.outside="authModalOpen = false"
         class="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 relative text-slate-900 dark:text-zinc-100">

        <!-- Close Button -->
        <button @click="authModalOpen = false"
                class="w-8 h-8 rounded-full flex items-center justify-center absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white transition cursor-pointer">
            <i class="bi bi-x text-lg"></i>
        </button>

        <!-- Brand Icon -->
        <div class="text-center mb-6">
            <img src="/logo.png" alt="Classy Bling" class="w-12 h-12 mx-auto object-contain rounded-2xl bg-white p-1 shadow-sm border border-slate-200 dark:border-zinc-800 mb-2">
            <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white" x-text="authMode === 'login' ? 'Welcome to Classy Bling' : 'Create an Account'"></h3>
            <p class="text-xs text-slate-500 dark:text-zinc-400 mt-1" x-text="authMode === 'login' ? 'Sign in to access VIP orders & Admin Control Panel' : 'Register to track your viral collectible drops'"></p>
        </div>

        <!-- Mode Tabs -->
        <div class="flex rounded-xl bg-slate-100 dark:bg-zinc-800/80 p-1 mb-6 border border-slate-200/70 dark:border-zinc-700/60">
            <button type="button" @click="authMode = 'login'"
                    :class="authMode === 'login' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-bold shadow-xs' : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-800 dark:hover:text-zinc-200'"
                    class="flex-1 py-1.5 text-xs rounded-lg transition text-center cursor-pointer">
                Sign In
            </button>
            <button type="button" @click="authMode = 'register'"
                    :class="authMode === 'register' ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-bold shadow-xs' : 'text-slate-500 dark:text-zinc-400 font-medium hover:text-slate-800 dark:hover:text-zinc-200'"
                    class="flex-1 py-1.5 text-xs rounded-lg transition text-center cursor-pointer">
                Register
            </button>
        </div>

        <!-- Quick 1-Click Admin Demo Fill Badge -->
        <div x-show="authMode === 'login'" class="mb-5 p-3 rounded-2xl bg-[#229ED9]/10 border border-[#229ED9]/20 flex items-center justify-between">
            <div class="text-[11px] text-slate-700 dark:text-zinc-300">
                <span class="font-bold text-[#229ED9] block">Admin Demo Credentials</span>
                <span>admin@gmail.com / 123456</span>
            </div>
            <button type="button"
                    @click="
                        document.getElementById('login-email').value = 'admin@gmail.com';
                        document.getElementById('login-password').value = '123456';
                    "
                    class="px-3 py-1 rounded-lg bg-[#229ED9] text-white text-xs font-bold hover:bg-[#1e8bc0] transition cursor-pointer">
                Auto Fill
            </button>
        </div>

        <!-- Login Form -->
        <form x-show="authMode === 'login'" method="POST" action="{{ route('login.submit') }}" class="space-y-4">
            @csrf
            <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Email Address</label>
                <div class="relative">
                    <input id="login-email" type="email" name="email" value="{{ old('email') }}" required autofocus
                           placeholder="admin@gmail.com"
                           class="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]">
                    <i class="bi bi-envelope text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
                </div>
                @error('email')
                    <span class="text-rose-500 text-[11px] mt-1 block">{{ $message }}</span>
                @enderror
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Password</label>
                <div class="relative">
                    <input id="login-password" type="password" name="password" required
                           placeholder="••••••"
                           class="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]">
                    <i class="bi bi-lock text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
                </div>
            </div>

            <div class="flex items-center justify-between text-xs pt-1">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="remember" checked class="rounded border-slate-300 text-[#229ED9] focus:ring-0">
                    <span class="text-slate-600 dark:text-zinc-400 text-[11px]">Remember me</span>
                </label>
            </div>

            <button type="submit" class="w-full py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1d8cc2] text-white font-bold text-xs shadow-md transition cursor-pointer mt-2">
                Sign In to Account
            </button>
        </form>

        <!-- Register Form -->
        <form x-show="authMode === 'register'" method="POST" action="{{ route('register') }}" class="space-y-3" style="display: none;">
            @csrf
            <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Full Name</label>
                <input type="text" name="name" required placeholder="Collector Name"
                       class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Email Address</label>
                <input type="email" name="email" required placeholder="collector@gmail.com"
                       class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Password</label>
                <input type="password" name="password" required minlength="6" placeholder="At least 6 characters"
                       class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Confirm Password</label>
                <input type="password" name="password_confirmation" required minlength="6" placeholder="Repeat password"
                       class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]">
            </div>

            <button type="submit" class="w-full py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1d8cc2] text-white font-bold text-xs shadow-md transition cursor-pointer mt-3">
                Create Account
            </button>
        </form>

    </div>
</div>
