<section
    class="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6 select-none"
    id="catalog"
    x-data="{
        allProducts: {{ json_encode($allProducts ?? $products->items()) }},
        selectedCategory: 'All',
        selectedSubFilter: 'all',
        searchQuery: '',
        sortBy: 'newest',
        
        get filteredProducts() {
            let list = [...this.allProducts];

            // 1. Search Query
            if (this.searchQuery.trim() !== '') {
                const q = this.searchQuery.toLowerCase();
                list = list.filter(p => 
                    (p.name && p.name.toLowerCase().includes(q)) ||
                    (p.brand && p.brand.toLowerCase().includes(q)) ||
                    (p.series && p.series.toLowerCase().includes(q)) ||
                    (p.category && p.category.toLowerCase().includes(q))
                );
            }

            // 2. Top Category Tabs
            if (this.selectedCategory !== 'All') {
                if (this.selectedCategory === 'Plush Dolls') {
                    list = list.filter(p => (p.category && p.category.includes('Plush')) || (p.name && p.name.toLowerCase().includes('plush')));
                } else if (this.selectedCategory === 'Blind Box') {
                    list = list.filter(p => (p.category && (p.category.includes('Blind Box') || p.category.includes('Series'))) || (p.name && p.name.toLowerCase().includes('blind box')));
                } else if (this.selectedCategory === 'Action Figures') {
                    list = list.filter(p => (p.category && (p.category.includes('Figure') || p.category.includes('Limited Edition'))) || (p.brand && p.brand.includes('Pop Mart')));
                }
            }

            // 3. Sub-filter Icon Rail
            if (this.selectedSubFilter === 'plush') {
                list = list.filter(p => (p.category && p.category.includes('Plush')) || (p.name && p.name.toLowerCase().includes('plush')));
            } else if (this.selectedSubFilter === 'box') {
                list = list.filter(p => (p.category && p.category.includes('Blind Box')) || (p.name && p.name.toLowerCase().includes('box')));
            } else if (this.selectedSubFilter === 'rare') {
                list = list.filter(p => p.featured || (p.category && p.category.includes('Limited')) || (p.stock_status && p.stock_status.includes('Low')));
            } else if (this.selectedSubFilter === 'in_stock') {
                list = list.filter(p => p.stock_status === 'In Stock');
            } else if (this.selectedSubFilter === 'under_12') {
                list = list.filter(p => parseFloat(p.price) < 12);
            } else if (this.selectedSubFilter === '12_15') {
                list = list.filter(p => parseFloat(p.price) >= 12 && parseFloat(p.price) <= 15);
            } else if (this.selectedSubFilter === 'over_15') {
                list = list.filter(p => parseFloat(p.price) > 15);
            }

            // 4. Sort
            if (this.sortBy === 'price_asc') {
                list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            } else if (this.sortBy === 'price_desc') {
                list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            } else {
                // newest / featured
                list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
            }

            return list;
        },

        handleTopTab(val) {
            if (val === 'POP NOW') {
                const el = document.getElementById('pop-now');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                this.selectedCategory = val;
            }
        },

        formatKhr(usdPrice) {
            return Math.round(parseFloat(usdPrice || 0) * 4100).toLocaleString();
        },

        telegramOrderUrl(product) {
            const khr = this.formatKhr(product.price);
            const msg = `Hello Classy Bling! I would like to order:\nProduct: ${product.name}\nPrice: $${parseFloat(product.price).toFixed(2)} USD (~${khr} ៛)\nBrand: ${product.brand || 'Classy Bling'}`;
            return `https://t.me/+85592917831?text=${encodeURIComponent(msg)}`;
        }
    }"
>
    <!-- Top Header Category Tabs -->
    <div class="border-b border-slate-200 dark:border-zinc-800 mb-4 sm:mb-6 overflow-x-auto hide-scrollbar">
        <div class="flex items-center gap-4 sm:gap-10 pb-0.5 min-w-max">
            <!-- Tab 1: All Items -->
            <button
                type="button"
                @click="handleTopTab('All')"
                class="pb-2.5 sm:pb-3 text-xs sm:text-base font-bold transition-all relative whitespace-nowrap cursor-pointer"
                :class="selectedCategory === 'All' ? 'text-[#229ED9] dark:text-[#38bdf8] font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'"
            >
                <span>All Items</span>
                <span x-show="selectedCategory === 'All'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#229ED9] dark:bg-[#38bdf8] rounded-full"></span>
            </button>

            <!-- Tab 2: Plush Dolls -->
            <button
                type="button"
                @click="handleTopTab('Plush Dolls')"
                class="pb-2.5 sm:pb-3 text-xs sm:text-base font-bold transition-all relative whitespace-nowrap cursor-pointer"
                :class="selectedCategory === 'Plush Dolls' ? 'text-[#229ED9] dark:text-[#38bdf8] font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'"
            >
                <span>Plush Dolls</span>
                <span x-show="selectedCategory === 'Plush Dolls'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#229ED9] dark:bg-[#38bdf8] rounded-full"></span>
            </button>

            <!-- Tab 3: Blind Box -->
            <button
                type="button"
                @click="handleTopTab('Blind Box')"
                class="pb-2.5 sm:pb-3 text-xs sm:text-base font-bold transition-all relative whitespace-nowrap cursor-pointer"
                :class="selectedCategory === 'Blind Box' ? 'text-[#229ED9] dark:text-[#38bdf8] font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'"
            >
                <span>Blind Box</span>
                <span x-show="selectedCategory === 'Blind Box'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#229ED9] dark:bg-[#38bdf8] rounded-full"></span>
            </button>

            <!-- Tab 4: Action Figures -->
            <button
                type="button"
                @click="handleTopTab('Action Figures')"
                class="pb-2.5 sm:pb-3 text-xs sm:text-base font-bold transition-all relative whitespace-nowrap cursor-pointer"
                :class="selectedCategory === 'Action Figures' ? 'text-[#229ED9] dark:text-[#38bdf8] font-black' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'"
            >
                <span>Action Figures</span>
                <span x-show="selectedCategory === 'Action Figures'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#229ED9] dark:bg-[#38bdf8] rounded-full"></span>
            </button>

            <!-- Tab 5: POP NOW Drops -->
            <button
                type="button"
                @click="handleTopTab('POP NOW')"
                class="pb-2.5 sm:pb-3 text-xs sm:text-base font-bold transition-all relative whitespace-nowrap text-slate-600 dark:text-zinc-400 hover:text-[#E50012] cursor-pointer flex items-center gap-1"
            >
                <i class="bi bi-fire text-[#E50012] text-xs"></i>
                <span>POP NOW Drops</span>
            </button>
        </div>
    </div>

    <!-- Search Bar & Sort Controls -->
    <div class="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <!-- Search Input -->
        <div class="relative flex-1">
            <i class="bi bi-search absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm"></i>
            <input
                type="text"
                x-model="searchQuery"
                placeholder="Search character, series, or brand..."
                class="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 text-xs sm:text-sm focus:outline-none focus:border-[#229ED9] transition-colors"
            />
            <button
                type="button"
                x-show="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
                <i class="bi bi-x-circle-fill text-xs"></i>
            </button>
        </div>

        <!-- Sort Select -->
        <div class="flex items-center gap-1.5 shrink-0">
            <span class="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase hidden sm:inline">SORT:</span>
            <select
                x-model="sortBy"
                aria-label="Sort products"
                class="text-[11px] sm:text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-2.5 sm:px-3 py-2 text-slate-800 dark:text-zinc-200 focus:outline-none focus:border-[#229ED9] cursor-pointer"
            >
                <option value="newest">Featured & Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
            </select>
        </div>
    </div>

    <!-- Two Column Signature Layout (Left Vertical Icon Rail + Right Product Grid) -->
    <div class="flex items-start gap-2.5 sm:gap-6">
        
        <!-- Left Subcategory Vertical Icon Rail -->
        <div class="flex flex-col gap-2 sm:gap-3 shrink-0 py-0.5 select-none w-11 sm:w-16">
            <!-- 1. All -->
            <button
                type="button"
                @click="selectedSubFilter = 'all'"
                class="flex flex-col items-center justify-center py-2 px-1 sm:p-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer"
                :class="selectedSubFilter === 'all' ? 'border-2 border-[#229ED9] bg-white dark:bg-zinc-900 shadow-md text-[#229ED9]' : 'border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'"
                title="All Products"
            >
                <div class="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mb-0.5 sm:mb-1">
                    <i class="bi bi-plus-lg text-sm sm:text-base font-bold"></i>
                </div>
                <span class="text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">All</span>
            </button>

            <!-- 2. Plush -->
            <button
                type="button"
                @click="selectedSubFilter = 'plush'"
                class="flex flex-col items-center justify-center py-2 px-1 sm:p-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer"
                :class="selectedSubFilter === 'plush' ? 'border-2 border-[#229ED9] bg-white dark:bg-zinc-900 shadow-md text-[#229ED9]' : 'border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'"
                title="Plush Dolls"
            >
                <div class="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mb-0.5 sm:mb-1">
                    <i class="bi bi-heart text-xs sm:text-sm"></i>
                </div>
                <span class="text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">Plush</span>
            </button>

            <!-- 3. Box -->
            <button
                type="button"
                @click="selectedSubFilter = 'box'"
                class="flex flex-col items-center justify-center py-2 px-1 sm:p-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer"
                :class="selectedSubFilter === 'box' ? 'border-2 border-[#229ED9] bg-white dark:bg-zinc-900 shadow-md text-[#229ED9]' : 'border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'"
                title="Blind Boxes"
            >
                <div class="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mb-0.5 sm:mb-1">
                    <i class="bi bi-box-seam text-xs sm:text-sm"></i>
                </div>
                <span class="text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">Box</span>
            </button>

            <!-- 4. Rare -->
            <button
                type="button"
                @click="selectedSubFilter = 'rare'"
                class="flex flex-col items-center justify-center py-2 px-1 sm:p-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer"
                :class="selectedSubFilter === 'rare' ? 'border-2 border-[#229ED9] bg-white dark:bg-zinc-900 shadow-md text-[#229ED9]' : 'border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'"
                title="Rare & Limited"
            >
                <div class="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mb-0.5 sm:mb-1">
                    <i class="bi bi-gem text-xs sm:text-sm"></i>
                </div>
                <span class="text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">Rare</span>
            </button>

            <!-- 5. In Stock -->
            <button
                type="button"
                @click="selectedSubFilter = 'in_stock'"
                class="flex flex-col items-center justify-center py-2 px-1 sm:p-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer"
                :class="selectedSubFilter === 'in_stock' ? 'border-2 border-[#229ED9] bg-white dark:bg-zinc-900 shadow-md text-[#229ED9]' : 'border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'"
                title="Ready to Ship"
            >
                <div class="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mb-0.5 sm:mb-1">
                    <i class="bi bi-check-circle text-xs sm:text-sm"></i>
                </div>
                <span class="text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">In Stock</span>
            </button>

            <!-- 6. < $12 -->
            <button
                type="button"
                @click="selectedSubFilter = 'under_12'"
                class="flex flex-col items-center justify-center py-2 px-1 sm:p-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer"
                :class="selectedSubFilter === 'under_12' ? 'border-2 border-[#229ED9] bg-white dark:bg-zinc-900 shadow-md text-[#229ED9]' : 'border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'"
                title="Under $12"
            >
                <div class="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mb-0.5 sm:mb-1">
                    <i class="bi bi-currency-dollar text-xs sm:text-sm"></i>
                </div>
                <span class="text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">&lt; $12</span>
            </button>

            <!-- 7. $12-$15 -->
            <button
                type="button"
                @click="selectedSubFilter = '12_15'"
                class="flex flex-col items-center justify-center py-2 px-1 sm:p-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer"
                :class="selectedSubFilter === '12_15' ? 'border-2 border-[#229ED9] bg-white dark:bg-zinc-900 shadow-md text-[#229ED9]' : 'border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'"
                title="$12 to $15"
            >
                <div class="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mb-0.5 sm:mb-1">
                    <i class="bi bi-currency-dollar text-xs sm:text-sm"></i>
                </div>
                <span class="text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">$12-15</span>
            </button>

            <!-- 8. $15+ -->
            <button
                type="button"
                @click="selectedSubFilter = 'over_15'"
                class="flex flex-col items-center justify-center py-2 px-1 sm:p-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer"
                :class="selectedSubFilter === 'over_15' ? 'border-2 border-[#229ED9] bg-white dark:bg-zinc-900 shadow-md text-[#229ED9]' : 'border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400'"
                title="$15 and above"
            >
                <div class="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center mb-0.5 sm:mb-1">
                    <i class="bi bi-fire text-xs sm:text-sm text-rose-500"></i>
                </div>
                <span class="text-[9px] sm:text-[10px] font-bold tracking-tight text-center leading-tight">$15+</span>
            </button>
        </div>

        <!-- Right Main Product Grid -->
        <div class="flex-1 w-full min-w-0">
            
            <!-- Empty State -->
            <div x-show="filteredProducts.length === 0" class="py-14 text-center">
                <div class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 mx-auto flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-3 shadow-xs">
                    <i class="bi bi-box-seam text-2xl"></i>
                </div>
                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    No matching products
                </h3>
                <p class="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Try switching the category or resetting your filters.
                </p>
                <button
                    type="button"
                    @click="selectedCategory = 'All'; selectedSubFilter = 'all'; searchQuery = ''"
                    class="mt-3 px-4 py-1.5 rounded-full bg-[#229ED9] text-white text-xs font-bold hover:bg-[#1e8bc0] transition cursor-pointer"
                >
                    Reset All Filters
                </button>
            </div>

            <!-- Product Grid -->
            <div
                x-show="filteredProducts.length > 0"
                class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5"
            >
                <template x-for="product in filteredProducts" :key="product.id">
                    <div
                        @click="openProductModal(product)"
                        class="group flex flex-col cursor-pointer select-none font-sans bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200/60 dark:border-zinc-800/80 hover:shadow-lg transition-all duration-300"
                    >
                        <!-- 1. Product Image: Portrait Aspect Ratio (3/4) filling top of card -->
                        <div class="relative aspect-[3/4] w-full bg-slate-50 dark:bg-zinc-950 overflow-hidden">
                            <!-- Subtle Sold Out Badge only if Sold Out -->
                            <template x-if="product.stock_status === 'Sold Out'">
                                <div class="absolute top-2 left-2 z-10">
                                    <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs">
                                        Sold Out
                                    </span>
                                </div>
                            </template>

                            <img
                                :src="product.image_url"
                                :alt="product.name"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                            />
                        </div>

                        <!-- 2. Product Info: Title & Price Exactly like Reference -->
                        <div class="p-2.5 sm:p-3 flex flex-col justify-between flex-grow">
                            <!-- Clean 2-line title -->
                            <h3
                                class="text-xs sm:text-[13px] font-medium text-slate-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-[#229ED9] dark:group-hover:text-[#38bdf8] transition-colors min-h-[34px] sm:min-h-[36px]"
                                x-text="product.name"
                            ></h3>

                            <!-- Price Display -->
                            <div class="mt-2 flex items-baseline gap-1.5">
                                <span class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    $<span x-text="parseFloat(product.price).toFixed(2)"></span>
                                </span>
                                <span class="text-[11px] text-slate-400 dark:text-zinc-500 font-normal" x-text="'• ' + formatKhr(product.price) + ' ៛'"></span>
                            </div>
                        </div>

                    </div>
                </template>
            </div>

        </div>

    </div>

</section>
