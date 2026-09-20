@extends('layouts.app')

@section('title', 'Contact Us & Showroom Location — CLASSY BLING')

@section('content')
    <!-- Contact Page Header -->
    <div class="border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/40 py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            <!-- Breadcrumbs -->
            <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 mb-2 font-medium">
                <a href="{{ route('home') }}" class="hover:text-[#229ED9] flex items-center gap-1 transition-colors">
                    <i class="bi bi-house-door"></i>
                    <span>Home</span>
                </a>
                <span>/</span>
                <span class="text-slate-900 dark:text-white font-bold">Contact</span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                Contact & Showroom Location
            </h1>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-2xl">
                Experience authentic designer blind boxes in person, order directly via Telegram hotline, or tune into our daily TikTok live unboxings.
            </p>
        </div>
    </div>

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- Left 7 Cols: Contact Channels & Showroom Info -->
            <div class="lg:col-span-7 space-y-6">
                
                <!-- 1. Showroom Physical Location Card -->
                <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                            <i class="bi bi-geo-alt-fill text-2xl"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">Classy Bling Flagship Showroom</span>
                            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Phnom Penh, Cambodia</h3>
                        </div>
                    </div>

                    <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                        {{ $settings['address'] ?? 'Classy Bling, Khan Por Senchey / Chom Chao, Phnom Penh, Cambodia' }}
                    </p>

                    <!-- Opening Hours & Badges -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 text-xs">
                            <div class="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1">
                                <i class="bi bi-clock-fill text-[#229ED9]"></i>
                                <span>Showroom Hours</span>
                            </div>
                            <span class="text-slate-600 dark:text-zinc-400">Monday - Sunday: 10:00 AM - 9:00 PM</span>
                        </div>

                        <div class="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 text-xs">
                            <div class="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1">
                                <i class="bi bi-truck text-emerald-500"></i>
                                <span>Express Delivery</span>
                            </div>
                            <span class="text-slate-600 dark:text-zinc-400">Phnom Penh same-day (Grab / Deliver)</span>
                        </div>
                    </div>

                    <!-- Google Maps Button -->
                    @if(!empty($settings['google_maps_url']))
                        <div class="pt-2">
                            <a href="{{ $settings['google_maps_url'] }}" target="_blank" rel="noreferrer"
                               class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-slate-800 text-xs font-bold transition shadow-xs">
                                <i class="bi bi-map-fill"></i>
                                <span>Open in Google Maps</span>
                                <i class="bi bi-box-arrow-up-right text-[10px]"></i>
                            </a>
                        </div>
                    @endif
                </div>

                <!-- 2. Direct Channels (Telegram Hotline & TikTok Live) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <!-- Telegram Hotline Card -->
                    <div class="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
                        <div class="space-y-2">
                            <div class="w-10 h-10 rounded-xl bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center">
                                <i class="bi bi-send-fill text-xl"></i>
                            </div>
                            <h4 class="text-base font-bold text-slate-900 dark:text-white">Telegram Order VIP</h4>
                            <p class="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Direct phone hotline & instant customer reservations with Xiao yi.
                            </p>
                            <div class="text-xs font-black text-[#229ED9] pt-1">
                                {{ $settings['telegram_phone'] ?? '092917831 (+85592917831)' }}
                            </div>
                        </div>

                        <a href="{{ $settings['telegram_url'] ?? 'https://t.me/+85592917831' }}" target="_blank" rel="noreferrer"
                           class="w-full py-2.5 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1d8cc2] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition">
                            <i class="bi bi-telegram text-sm"></i>
                            <span>Chat on Telegram</span>
                        </a>
                    </div>

                    <!-- TikTok Live Card -->
                    <div class="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm flex flex-col justify-between space-y-4">
                        <div class="space-y-2">
                            <div class="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                                <i class="bi bi-tiktok text-lg"></i>
                            </div>
                            <h4 class="text-base font-bold text-slate-900 dark:text-white">TikTok Live Channel</h4>
                            <p class="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Watch daily livestreams, order boxes, and get them opened live on camera.
                            </p>
                            <div class="text-xs font-black text-slate-900 dark:text-white pt-1">
                                {{ $settings['tiktok_handle'] ?? '@classy.bling' }}
                            </div>
                        </div>

                        <a href="{{ $settings['tiktok_url'] ?? 'https://www.tiktok.com/@classy.bling' }}" target="_blank" rel="noreferrer"
                           class="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition">
                            <i class="bi bi-tiktok text-sm"></i>
                            <span>Follow @classy.bling</span>
                        </a>
                    </div>

                </div>

            </div>

            <!-- Right 5 Cols: Quick Inquiry & Order Request Form -->
            <div class="lg:col-span-5 space-y-6">
                
                <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 shadow-sm"
                     x-data="{
                         name: '',
                         phone: '',
                         inquiry: 'Reservation / Order',
                         message: '',
                         submitted: false,
                         sendViaTelegram() {
                             const text = `Hello Classy Bling!\nFrom: ${this.name}\nPhone/Telegram: ${this.phone}\nType: ${this.inquiry}\nMessage: ${this.message}`;
                             window.open('https://t.me/+85592917831?text=' + encodeURIComponent(text), '_blank');
                             this.submitted = true;
                         }
                     }">
                    
                    <div class="mb-5 space-y-1">
                        <span class="text-[10px] font-black uppercase tracking-wider text-[#229ED9] block">Quick VIP Inquiry</span>
                        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display">Send a Message</h3>
                        <p class="text-xs text-slate-500 dark:text-zinc-400">Directly dispatches your order inquiry to Xiao yi via Telegram.</p>
                    </div>

                    <form @submit.prevent="sendViaTelegram()" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Your Name *</label>
                            <input type="text" x-model="name" required placeholder="Collector Name"
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Phone / Telegram Handle *</label>
                            <input type="text" x-model="phone" required placeholder="092... or @username"
                                   class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Inquiry Type</label>
                            <select x-model="inquiry" class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]">
                                <option value="Product Order">Box Reservation / Order</option>
                                <option value="Claw Machine Inquiry">Claw Machine Purchase</option>
                                <option value="Showroom Visit">Showroom Visit Appointment</option>
                                <option value="General Question">General Question</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1">Message / Product Name</label>
                            <textarea x-model="message" rows="3" placeholder="Which series or blind box are you interested in?"
                                      class="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#229ED9]"></textarea>
                        </div>

                        <button type="submit"
                                class="w-full py-3 rounded-xl bg-[#229ED9] hover:bg-[#1d8cc2] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer">
                            <i class="bi bi-send-fill text-sm"></i>
                            <span>Send Inquiry via Telegram</span>
                        </button>
                    </form>

                    <!-- Safe payment note -->
                    <div class="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                        <span class="flex items-center gap-1"><i class="bi bi-shield-check text-emerald-500"></i> ABA Pay / ACLEDA</span>
                        <span>Phnom Penh Delivery</span>
                    </div>
                </div>

            </div>

        </div>
    </div>
@endsection
