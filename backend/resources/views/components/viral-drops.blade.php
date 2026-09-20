<!-- Ref 2: Today's Viral Drops Carousel -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
    <div class="flex items-center justify-between mb-4">
        <div>
            <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                <h2 class="font-heading font-extrabold text-lg sm:text-xl text-base-content">
                    Today's Viral Drops
                </h2>
            </div>
            <p class="text-xs text-base-content/60">Trending toys featured on our TikTok live stream</p>
        </div>
        <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-primary hidden sm:inline">Daily Stock Replenished</span>
        </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        @foreach($viralDrops as $drop)
            <div class="card bg-base-200/60 border border-base-300 hover:border-primary/50 hover:shadow-lg transition duration-200 group flex flex-col justify-between overflow-hidden rounded-2xl">
                <!-- Image Container -->
                <div class="relative aspect-square p-2 bg-base-100 flex items-center justify-center overflow-hidden cursor-pointer"
                     @click="openProductModal({{ json_encode($drop) }})">
                    <img src="{{ $drop->image_url }}" alt="{{ $drop->name }}"
                         class="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                         loading="lazy"
                         onerror="this.onerror=null; this.src='/logo.png';">
                    
                    <!-- Stock status badge -->
                    <span class="absolute top-2 left-2 badge {{ $drop->badge_class }} badge-xs font-bold uppercase text-[9px]">
                        {{ $drop->stock_status }}
                    </span>

                    @if($drop->featured)
                        <span class="absolute top-2 right-2 badge badge-error badge-xs font-bold uppercase text-[9px]">
                            <i class="bi bi-fire text-[8px] mr-0.5"></i> Viral
                        </span>
                    @endif
                </div>

                <!-- Product Info -->
                <div class="p-3 flex flex-col flex-grow justify-between gap-1.5">
                    <div>
                        <div class="text-[10px] uppercase font-bold text-base-content/50 truncate">
                            {{ $drop->brand ?? 'Classy Bling' }}
                        </div>
                        <h4 class="font-heading font-bold text-xs text-base-content line-clamp-2 leading-snug group-hover:text-primary transition cursor-pointer"
                            @click="openProductModal({{ json_encode($drop) }})">
                            {{ $drop->name }}
                        </h4>
                    </div>

                    <div class="pt-1 border-t border-base-300 flex items-baseline justify-between">
                        <div>
                            <span class="font-heading font-extrabold text-sm text-base-content">${{ number_format($drop->price, 2) }}</span>
                            <span class="block text-[10px] text-base-content/60 font-semibold">{{ $drop->price_khr }} ៛</span>
                        </div>
                        <button @click="openProductModal({{ json_encode($drop) }})"
                                class="btn btn-circle btn-xs btn-primary shadow-sm" title="Quick View">
                            <i class="bi bi-eye text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
</section>
