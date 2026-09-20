<!-- Product Detail Modal (Alpine.js Controlled) -->
<div x-show="productModalOpen"
     x-transition:enter="transition ease-out duration-200"
     x-transition:enter-start="opacity-0"
     x-transition:enter-end="opacity-100"
     x-transition:leave="transition ease-in duration-150"
     x-transition:leave-start="opacity-100"
     x-transition:leave-end="opacity-0"
     class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
     style="display: none;"
     @keydown.escape.window="productModalOpen = false">

    <!-- Modal Card Box -->
    <div x-show="productModalOpen"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 scale-95"
         x-transition:enter-end="opacity-100 scale-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100 scale-100"
         x-transition:leave-end="opacity-0 scale-95"
         @click.outside="productModalOpen = false"
         class="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative text-slate-900 dark:text-zinc-100">

        <!-- Close Button -->
        <button @click="productModalOpen = false"
                class="w-8 h-8 rounded-full flex items-center justify-center absolute right-3 top-3 z-20 bg-white/90 dark:bg-zinc-800/90 backdrop-blur border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700 transition cursor-pointer">
            <i class="bi bi-x text-lg"></i>
        </button>

        <template x-if="activeProduct">
            <div class="grid grid-cols-1 md:grid-cols-2">
                <!-- Left: 3D Box / Product Photo -->
                <div class="bg-slate-50 dark:bg-zinc-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-zinc-800 relative">
                    <img :src="activeProduct.image_url" :alt="activeProduct.name"
                         class="max-h-64 object-contain rounded-2xl shadow-md transition duration-300 hover:scale-105"
                         onerror="this.onerror=null; this.src='/logo.png';">
                    
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs mt-3"
                          :class="{
                              'bg-emerald-500 text-white': activeProduct.stock_status === 'In Stock',
                              'bg-amber-500 text-white': activeProduct.stock_status === 'Low Stock',
                              'bg-sky-500 text-white': activeProduct.stock_status === 'Pre-order',
                              'bg-rose-500 text-white': activeProduct.stock_status === 'Sold Out'
                          }"
                          x-text="activeProduct.stock_status">
                    </span>
                </div>

                <!-- Right: Information & Order Action -->
                <div class="p-6 flex flex-col justify-between space-y-4 bg-white dark:bg-zinc-900">
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500" x-text="activeProduct.brand || 'Classy Bling'"></span>
                            <span class="text-xs text-slate-300 dark:text-zinc-600">•</span>
                            <span class="text-xs text-[#229ED9] font-semibold" x-text="activeProduct.category"></span>
                        </div>

                        <h3 class="font-heading font-extrabold text-xl text-slate-900 dark:text-white leading-snug" x-text="activeProduct.name"></h3>

                        <div class="flex items-baseline gap-3 py-1">
                            <span class="font-heading font-black text-2xl text-slate-900 dark:text-white" x-text="'$' + Number(activeProduct.price).toFixed(2)"></span>
                            <span class="text-xs font-bold text-[#229ED9]" x-text="'~ ' + (activeProduct.price * 4100).toLocaleString() + ' ៛'"></span>
                        </div>

                        <p class="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed" x-text="activeProduct.description || 'Authentic designer toy blind box directly sourced for Classy Bling showroom Phnom Penh.'"></p>

                        <!-- TikTok video link if available -->
                        <template x-if="activeProduct.tiktok_video_url">
                            <div class="pt-1">
                                <a :href="activeProduct.tiktok_video_url" target="_blank"
                                   class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 transition">
                                    <i class="bi bi-tiktok text-[#E50012]"></i>
                                    <span>Watch TikTok Unboxing Video</span>
                                    <i class="bi bi-box-arrow-up-right text-[10px] text-slate-400"></i>
                                </a>
                            </div>
                        </template>
                    </div>

                    <!-- Actions -->
                    <div class="pt-3 border-t border-slate-200 dark:border-zinc-800 space-y-2.5">
                        <a :href="'https://t.me/+85592917831?text=' + encodeURIComponent('Hello Xiao yi, I would like to reserve/order: ' + activeProduct.name + ' ($' + Number(activeProduct.price).toFixed(2) + ')')"
                           target="_blank"
                           class="w-full py-2.5 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1d8cc2] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all">
                            <i class="bi bi-telegram text-base"></i>
                            <span>Order via Telegram Hotline</span>
                        </a>

                        <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 pt-1">
                            <span class="flex items-center gap-1"><i class="bi bi-shield-check text-emerald-500"></i> 100% Sealed</span>
                            <span class="flex items-center gap-1"><i class="bi bi-truck text-[#229ED9]"></i> Fast PP Dispatch</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</div>
