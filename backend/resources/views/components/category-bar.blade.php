<!-- Ref 1 & 2: Circular Category Avatar Navigation -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
    <div class="flex items-center justify-between mb-4">
        <div>
            <h2 class="font-heading font-bold text-lg sm:text-xl text-base-content flex items-center gap-2">
                <i class="bi bi-grid-fill text-primary"></i> Shop by Category
            </h2>
            <p class="text-xs text-base-content/60">Curated viral toy categories & blind box collections</p>
        </div>
        <div class="hidden sm:flex items-center gap-1 text-xs font-semibold text-primary">
            <span>Swipe for more</span>
            <i class="bi bi-chevron-right text-[10px]"></i>
        </div>
    </div>

    <!-- Horizontal scroll row -->
    <div class="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 hide-scrollbar">
        @foreach($circularCategories as $cat)
            @php
                $isActive = (request('category') == $cat['slug']) || (!request('category') && $cat['slug'] == 'All');
            @endphp
            <a href="{{ $cat['slug'] == 'All' ? route('storefront.index') : route('storefront.index', ['category' => $cat['slug']]) }}"
               class="flex flex-col items-center group shrink-0 text-center transition duration-200">
                
                <!-- Circular Photographic Avatar with subtle border ring -->
                <div class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-300 transform group-hover:scale-105 {{ $isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100 shadow-md' : 'ring-1 ring-base-300 hover:ring-primary/50' }}">
                    <div class="w-full h-full rounded-full overflow-hidden bg-base-200 shadow-inner flex items-center justify-center">
                        <img src="{{ $cat['image'] }}" alt="{{ $cat['name'] }}"
                             class="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                             loading="lazy"
                             onerror="this.onerror=null; this.src='/logo.png';">
                    </div>

                    <!-- Category mini tag badge -->
                    <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full shadow-sm {{ $isActive ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/70' }}">
                        {{ $cat['badge'] }}
                    </span>
                </div>

                <!-- Label -->
                <span class="mt-2.5 text-xs font-semibold transition {{ $isActive ? 'text-primary font-bold' : 'text-base-content/80 group-hover:text-base-content' }}">
                    {{ $cat['name'] }}
                </span>
            </a>
        @endforeach
    </div>
</section>
