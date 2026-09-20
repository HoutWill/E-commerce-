<!-- Core Product Catalog Grid Section -->
<section id="catalog-section" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
    
    <!-- Filter & Sort Header Bar -->
    <div class="bg-base-200/50 p-4 rounded-2xl border border-base-300 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <!-- Left: Active Category / Search status -->
        <div>
            <h3 class="font-heading font-extrabold text-lg text-base-content flex items-center gap-2">
                @if(request('q'))
                    <span>Search Results for <span class="text-primary">"{{ request('q') }}"</span></span>
                @elseif(request('category'))
                    <span>{{ request('category') }}</span>
                @elseif(request('brand'))
                    <span>{{ request('brand') }} Collection</span>
                @else
                    <span>All Collectibles & Blind Boxes</span>
                @endif
                <span class="badge badge-neutral badge-sm font-bold text-xs">{{ $products->total() }}</span>
            </h3>
            <p class="text-xs text-base-content/60">Showing authentic sealed boxes and machines</p>
        </div>

        <!-- Right: Sort & Filter Controls -->
        <div class="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <!-- Sort Dropdown -->
            <form action="{{ route('storefront.index') }}" method="GET" class="flex items-center gap-2">
                @if(request('category')) <input type="hidden" name="category" value="{{ request('category') }}"> @endif
                @if(request('brand')) <input type="hidden" name="brand" value="{{ request('brand') }}"> @endif
                @if(request('stock_status')) <input type="hidden" name="stock_status" value="{{ request('stock_status') }}"> @endif
                @if(request('q')) <input type="hidden" name="q" value="{{ request('q') }}"> @endif

                <div class="flex items-center gap-1.5 text-xs text-base-content/70">
                    <span class="hidden sm:inline font-semibold">Sort by:</span>
                    <select name="sort" onchange="this.form.submit()" class="select select-bordered select-xs sm:select-sm rounded-xl text-xs bg-base-100 font-medium">
                        <option value="popular" {{ request('sort') == 'popular' ? 'selected' : '' }}>Featured / Popular</option>
                        <option value="newest" {{ request('sort') == 'newest' ? 'selected' : '' }}>Newest Drops</option>
                        <option value="price_asc" {{ request('sort') == 'price_asc' ? 'selected' : '' }}>Price: Low to High</option>
                        <option value="price_desc" {{ request('sort') == 'price_desc' ? 'selected' : '' }}>Price: High to Low</option>
                    </select>
                </div>
            </form>

            @if(request('category') || request('brand') || request('stock_status') || request('q'))
                <a href="{{ route('storefront.index') }}" class="btn btn-ghost btn-xs sm:btn-sm rounded-xl text-error text-xs gap-1">
                    <i class="bi bi-x-circle"></i> Reset
                </a>
            @endif
        </div>
    </div>

    <!-- Filter Pill Badges (Category & Stock) -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
        <a href="{{ route('storefront.index') }}"
           class="px-3 py-1.5 rounded-full text-xs font-semibold transition border {{ !request('category') && !request('brand') ? 'bg-primary text-primary-content border-primary shadow-sm' : 'bg-base-200/80 text-base-content/70 border-base-300 hover:bg-base-300' }}">
            All Items
        </a>
        @foreach($categories as $cat)
            <a href="{{ route('storefront.index', ['category' => $cat->category]) }}"
               class="px-3 py-1.5 rounded-full text-xs font-semibold transition border {{ request('category') == $cat->category ? 'bg-primary text-primary-content border-primary shadow-sm' : 'bg-base-200/80 text-base-content/70 border-base-300 hover:bg-base-300' }}">
                {{ $cat->category }} ({{ $cat->count }})
            </a>
        @endforeach
    </div>

    <!-- Products Grid -->
    @if($products->count() > 0)
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            @foreach($products as $product)
                <div @click="openProductModal({{ json_encode($product) }})"
                     class="group flex flex-col cursor-pointer select-none font-sans bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-slate-200/60 dark:border-zinc-800/80 hover:shadow-lg transition-all duration-300">
                    
                    <!-- Portrait Aspect Ratio (3/4) -->
                    <div class="relative aspect-[3/4] w-full bg-slate-50 dark:bg-zinc-950 overflow-hidden">
                        @if($product->stock_status === 'Sold Out')
                            <div class="absolute top-2 left-2 z-10">
                                <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs">
                                    Sold Out
                                </span>
                            </div>
                        @endif

                        <img src="{{ $product->image_url }}" alt="{{ $product->name }}"
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                             loading="lazy"
                             onerror="this.onerror=null; this.src='/logo.png';">
                    </div>

                    <!-- Product Info: Title & Price -->
                    <div class="p-2.5 sm:p-3 flex flex-col justify-between flex-grow">
                        <h3 class="text-xs sm:text-[13px] font-medium text-slate-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-[#229ED9] dark:group-hover:text-[#38bdf8] transition-colors min-h-[34px] sm:min-h-[36px]">
                            {{ $product->name }}
                        </h3>

                        <div class="mt-2 flex items-baseline gap-1.5">
                            <span class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                ${{ number_format($product->price, 2) }}
                            </span>
                            <span class="text-[11px] text-slate-400 dark:text-zinc-500 font-normal">
                                • {{ $product->price_khr }} ៛
                            </span>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="mt-10 flex justify-center">
            {{ $products->links() }}
        </div>
    @else
        <!-- Empty State -->
        <div class="text-center py-16 px-4 bg-base-200/40 rounded-3xl border border-dashed border-base-300">
            <div class="w-16 h-16 mx-auto rounded-full bg-base-300 text-base-content/50 flex items-center justify-center text-2xl mb-4">
                <i class="bi bi-search"></i>
            </div>
            <h4 class="font-heading font-bold text-lg text-base-content mb-1">No products found</h4>
            <p class="text-xs text-base-content/60 max-w-sm mx-auto mb-5">
                We couldn't find any items matching your selected criteria. Try adjusting or clearing your filters.
            </p>
            <a href="{{ route('storefront.index') }}" class="btn btn-sm btn-primary rounded-xl font-semibold">
                Clear Filters & Show All
            </a>
        </div>
    @endif

</section>
