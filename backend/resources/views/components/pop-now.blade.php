<section
    class="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-hidden select-none"
    id="pop-now"
    x-data="{
        selectedBox: null,
        scrollAmount: 340,
        scrollShelf(direction) {
            const shelf = this.$refs.shelf;
            if (shelf) {
                shelf.scrollBy({
                    left: direction === 'left' ? -this.scrollAmount : this.scrollAmount,
                    behavior: 'smooth'
                });
            }
        },
        boxes: [
            {
                id: 'labubu_macaron',
                name: 'Pop Mart Labubu Tasty Macarons Series',
                series: 'The Monsters Tasty Macarons',
                brand: 'Pop Mart',
                price: 19.50,
                khr: '80,000',
                image: '/3d_boxes/labubu_macaron_box_ai.jpg',
                secretRate: '1/72 Secret Chestnut Macaron Chase',
                description: 'Viral fluffy vinyl plush monster with mischievous sharp tooth smile holding a strawberry macaron.'
            },
            {
                id: 'crybaby_concert',
                name: 'Pop Mart CRYBABY Sunset Concert Series',
                series: 'Sunset Concert Rock Band',
                brand: 'Pop Mart',
                price: 16.50,
                khr: '67,500',
                image: '/3d_boxes/crybaby_concert_box_ai.jpg',
                secretRate: '1/144 Ultra Rare Golden Guitarist',
                description: 'Rockstar blonde girl in leather jacket with electric guitar, star tears, and band accessories.'
            },
            {
                id: 'zootopia_fox',
                name: 'Disney Zootopia Nick Wilde Series 1',
                series: 'Zootopia Art Toy Collection',
                brand: 'Disney x Pop Mart',
                price: 14.00,
                khr: '57,500',
                image: '/3d_boxes/zootopia_fox_box_ai.jpg',
                secretRate: '1/72 Secret Gold Badge Officer',
                description: 'Official Disney licensed Nick Wilde collectible in green shirt and tie on white studio podium.'
            },
            {
                id: 'kuromi_dreamland',
                name: 'Sanrio Kuromi Dreamland Starry Series',
                series: 'Kuromi Star Magic Vol. 1',
                brand: 'Sanrio',
                price: 12.50,
                khr: '51,000',
                image: '/3d_boxes/kuromi_dreamland_box_ai.jpg',
                secretRate: '1/96 Secret Midnight Glitter Chase',
                description: 'Sanrio licensed gothic jester hat Kuromi with magical star wand on a pastel lavender podium.'
            },
            {
                id: 'kfc_dimoo',
                name: 'Pop Mart KFC x DIMOO Aviator Series',
                series: 'Pilot Colonel 35th Anniversary',
                brand: 'Pop Mart x KFC',
                price: 14.00,
                khr: '57,500',
                image: '/3d_boxes/kfc_dimoo_box_ai.jpg',
                secretRate: '1/144 Golden Colonel Secret',
                description: 'Limited edition DIMOO pilot in aviator jacket with cloud hair and signature fried chicken bucket.'
            },
            {
                id: 'hirono_mischief',
                name: 'Pop Mart Hirono Little Mischief Series',
                series: 'Hirono Streetwear Edition',
                brand: 'Pop Mart',
                price: 15.00,
                khr: '61,500',
                image: '/3d_boxes/hirono_mischief_box_ai.jpg',
                secretRate: '1/72 The Vagrant Secret Chase',
                description: 'Moody expressive boy in oversized textured streetwear hoodie on a minimalist concrete pedestal.'
            },
            {
                id: 'yumi_dream',
                name: 'YuMi Dreamy Girl Collection Vol. 1',
                series: 'Pastel Gothic Lolita Series',
                brand: 'DOTEBABY',
                price: 14.00,
                khr: '57,500',
                image: '/3d_boxes/yumi_dream_box_ai.jpg',
                secretRate: '1/72 Secret Starlight Princess',
                description: 'Anime twintail pink haired cutie in lolita dress with silver foil star accents on studio podium.'
            },
            {
                id: 'baby_three_bunny',
                name: 'Baby Three 3-Year-Old Cutie Series',
                series: 'Cutie Plush Series',
                brand: 'Baby Three',
                price: 12.50,
                khr: '51,000',
                image: '/3d_boxes/baby_three_bunny_box_ai.jpg',
                secretRate: '1/72 Secret Fluffy Angel Bunny',
                description: 'Soft pastel plush bunny doll with large glossy starry eyes and cute lace collar.'
            },
            {
                id: 'cinnamoroll_bakery',
                name: 'Sanrio Cinnamoroll Cloud Bakery Series',
                series: 'Sweet Pastry Collection',
                brand: 'Sanrio',
                price: 13.00,
                khr: '53,500',
                image: '/3d_boxes/cinnamoroll_bakery_box_ai.jpg',
                secretRate: '1/96 Rainbow Cupcake Chase',
                description: 'Fluffy white puppy Cinnamoroll wearing a baker chef hat holding a warm cinnamon pastry roll.'
            },
            {
                id: 'mini_animal',
                name: 'Baby Three Mini Animal Party Series',
                series: 'Mini Animals Vol. 1',
                brand: 'Baby Three',
                price: 14.00,
                khr: '57,500',
                image: '/3d_boxes/mini_animal_box_ai.jpg',
                secretRate: '1/72 Secret Golden Panda',
                description: 'Chibi baby panda in sweet animal onesie on a soft lavender studio display.'
            },
            {
                id: 'fantasy_world',
                name: 'Fantasy World Pastel Plush Bunny',
                series: 'Pastel Fantasy Series',
                brand: 'Baby Three',
                price: 14.00,
                khr: '57,500',
                image: '/3d_boxes/fantasy_world_box_ai.jpg',
                secretRate: '1/72 Secret Glitter Wing Fairy',
                description: 'Dreamy sky-blue and pastel pink fairy bunny with sparkling eyes and delicate wings.'
            },
            {
                id: 'samuel_ocean',
                name: 'Samuel Ocean Series Shark Hood',
                series: 'Deep Ocean Friends',
                brand: 'MEI YI YOU ART TOY',
                price: 13.00,
                khr: '53,500',
                image: '/3d_boxes/samuel_ocean_box_ai.jpg',
                secretRate: '1/96 Secret Hammerhead Chase',
                description: 'Plush doll in cute blue shark hooded onesie with white teeth on an ocean gradient studio pedestal.'
            },
            {
                id: 'skullpanda_sound',
                name: 'Pop Mart SKULLPANDA The Sound Series',
                series: 'The Sound Avant-Garde',
                brand: 'Pop Mart',
                price: 15.00,
                khr: '61,500',
                image: '/3d_boxes/skullpanda_sound_box_ai.jpg',
                secretRate: '1/144 The Silence Secret Chase',
                description: 'Matte black box with iridescent holographic lettering featuring avant-garde earbuds cyber girl.'
            }
        ]
    }"
>
    <!-- Section Header -->
    <div class="flex flex-col items-center justify-center text-center mb-5 sm:mb-8 space-y-1.5">
        <div class="flex items-center gap-2 sm:gap-2.5">
            <!-- Red POP NOW badge -->
            <div class="px-2 py-0.5 sm:py-1 rounded bg-[#E50012] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                <i class="bi bi-fire animate-pulse text-xs"></i>
                <span>POP NOW</span>
            </div>
            <h2 class="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-display">
                POP NOW Drops
            </h2>
        </div>

        <div class="flex items-center gap-3">
            <a
                href="#catalog"
                class="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
                Explore More Series &gt;
            </a>
        </div>
    </div>

    <!-- Horizontal Product Shelf Container with Left/Right Navigation -->
    <div class="relative group/shelf">
        <!-- Left Arrow Button -->
        <button
            type="button"
            @click="scrollShelf('left')"
            class="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition cursor-pointer"
        >
            <i class="bi bi-chevron-left text-sm font-bold"></i>
        </button>

        <!-- Right Arrow Button -->
        <button
            type="button"
            @click="scrollShelf('right')"
            class="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition cursor-pointer"
        >
            <i class="bi bi-chevron-right text-sm font-bold"></i>
        </button>

        <!-- Product Shelf -->
        <div
            x-ref="shelf"
            class="flex gap-3 sm:gap-4 overflow-x-auto py-2 sm:py-3 hide-scrollbar scroll-smooth"
        >
            <template x-for="box in boxes" :key="box.id">
                <div
                    @click="selectedBox = box"
                    class="shrink-0 w-[180px] sm:w-[220px] flex flex-col group/card cursor-pointer select-none font-sans bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200/60 dark:border-zinc-800/80 hover:shadow-lg transition-all duration-300"
                >
                    <!-- Product Box Image: Portrait Aspect Ratio (3/4) -->
                    <div class="relative aspect-[3/4] w-full bg-slate-50 dark:bg-zinc-950 overflow-hidden">
                        <img
                            :src="box.image"
                            :alt="box.name"
                            class="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>

                    <!-- Product Info: Clean Title & Price -->
                    <div class="p-2.5 sm:p-3 flex flex-col justify-between flex-grow text-left">
                        <h3 class="text-xs sm:text-[13px] font-medium text-slate-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover/card:text-[#229ED9] dark:group-hover/card:text-[#38bdf8] transition-colors min-h-[34px] sm:min-h-[36px]" x-text="box.name"></h3>

                        <div class="mt-2 flex items-baseline gap-1.5">
                            <span class="text-sm sm:text-base font-bold text-slate-900 dark:text-white" x-text="'$' + box.price.toFixed(2)"></span>
                            <span class="text-[11px] text-slate-400 dark:text-zinc-500 font-normal" x-text="'• ' + box.khr + ' ៛'"></span>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <!-- Mobile Swipe Hint -->
        <div class="sm:hidden flex items-center justify-center gap-1 text-[11px] font-medium text-slate-400 dark:text-zinc-500 pt-1">
            <span>← Swipe to explore POP NOW shelf →</span>
        </div>
    </div>

    <!-- POP NOW Inspection Modal -->
    <template x-teleport="body">
        <div
            x-show="selectedBox !== null"
            x-transition.opacity
            class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 dark:bg-black/90 backdrop-blur-md select-none"
            @click="selectedBox = null"
            style="display: none;"
        >
            <div
                x-show="selectedBox !== null"
                x-transition.scale.95
                class="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col my-auto transition-all"
                @click.stop
            >
                <!-- Modal Header -->
                <div class="p-3.5 sm:p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-slate-50/90 dark:bg-zinc-950/90 shrink-0">
                    <div class="flex items-center gap-2 sm:gap-2.5">
                        <div class="px-2 py-0.5 rounded bg-[#E50012] text-white text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
                            <i class="bi bi-fire text-xs"></i>
                            <span>POP NOW</span>
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1" x-text="selectedBox?.name"></h3>
                            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 line-clamp-1" x-text="(selectedBox?.brand || '') + ' • ' + (selectedBox?.series || '')"></p>
                        </div>
                    </div>

                    <button
                        type="button"
                        @click="selectedBox = null"
                        aria-label="Close modal"
                        class="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
                    >
                        <i class="bi bi-x-lg text-sm"></i>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-slate-50/40 dark:bg-zinc-900/40">
                    <!-- Product Box Image -->
                    <div class="w-48 sm:w-60 shrink-0 aspect-[1/1] rounded-2xl bg-white dark:bg-zinc-950 p-3 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-center shadow-lg">
                        <img
                            :src="selectedBox?.image"
                            :alt="selectedBox?.name"
                            class="w-full h-full object-contain filter drop-shadow-md"
                        />
                    </div>

                    <!-- Product Details -->
                    <div class="flex-1 flex flex-col justify-between space-y-3 sm:space-y-4 text-left w-full">
                        <div>
                            <span class="inline-block px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                                In Stock • Ready to Ship
                            </span>
                            <h4 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight" x-text="selectedBox?.name"></h4>
                            <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed" x-text="selectedBox?.description"></p>
                        </div>

                        <!-- Secret Chase Rate -->
                        <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-bold">
                            <i class="bi bi-award text-amber-500 text-sm"></i>
                            <span x-text="selectedBox?.secretRate"></span>
                        </div>

                        <!-- Price Display -->
                        <div class="flex items-baseline gap-2">
                            <span class="text-2xl font-black text-slate-900 dark:text-white" x-text="'$' + (selectedBox?.price?.toFixed(2) || '0.00')"></span>
                            <span class="text-xs sm:text-sm font-bold text-[#229ED9]" x-text="'(' + (selectedBox?.khr || '') + ' ៛)'"></span>
                        </div>

                        <!-- Order Action Button -->
                        <a
                            :href="'https://t.me/+85592917831?text=' + encodeURIComponent('Hello Classy Bling! I want to pick & order: ' + (selectedBox?.name || '') + ' ($' + (selectedBox?.price?.toFixed(2) || '') + ')')"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full py-3 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1e8bc0] text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                        >
                            <i class="bi bi-send-fill text-sm"></i>
                            <span>Direct Order via Telegram</span>
                        </a>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="p-3 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 shrink-0">
                    <i class="bi bi-shield-check text-emerald-500 text-sm"></i>
                    <span>100% Guaranteed Authentic • Brand New Sealed Blind Box</span>
                </div>
            </div>
        </div>
    </template>
</section>
