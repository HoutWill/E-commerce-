<!-- Ref 3: Adaptive Bento Hero Section -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        
        <!-- Main Hero Card (Lg: 7 cols) - Tabletop Claw Machine Special Spotlight -->
        <div class="lg:col-span-7 rounded-3xl bg-gradient-to-br from-primary/10 via-base-200/60 to-base-200 p-6 sm:p-8 border border-primary/20 relative overflow-hidden flex flex-col justify-between group shadow-sm">
            <!-- Background glow -->
            <div class="absolute -right-16 -top-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/30 transition duration-500"></div>

            <div class="relative z-10 space-y-4 max-w-md">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-primary text-primary-content shadow-sm flex items-center gap-1.5">
                        <i class="bi bi-fire"></i> Trending Viral Drop
                    </span>
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-base-100 text-base-content border border-base-300">
                        Arcade Size L
                    </span>
                </div>

                <h1 class="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-base-content tracking-tight leading-tight">
                    Rabbit Space <span class="text-primary underline decoration-primary/30 underline-offset-4">Claw Machine</span>
                </h1>

                <p class="text-sm text-base-content/75 leading-relaxed">
                    Motorized claw, 3 joystick controls, dynamic sound effects & LED countdown timer. As seen on our daily TikTok unboxing stream!
                </p>

                <div class="pt-2 flex items-baseline gap-3">
                    <span class="text-2xl sm:text-3xl font-extrabold text-base-content font-heading">$25.00</span>
                    <span class="text-sm font-semibold text-base-content/60">~ 102,500 ៛</span>
                    <span class="badge badge-success badge-sm font-bold uppercase text-[10px]">In Stock</span>
                </div>

                <div class="pt-3 flex flex-wrap items-center gap-3">
                    <a href="{{ route('storefront.index', ['category' => 'Limited Edition']) }}"
                       class="btn btn-primary btn-sm sm:btn-md rounded-xl shadow-md gap-2 font-bold">
                        <i class="bi bi-bag-check-fill"></i> View Machine Drop
                    </a>
                    <a href="https://www.tiktok.com/@classy.bling/video/7686000918407515412" target="_blank"
                       class="btn btn-neutral btn-sm sm:btn-md rounded-xl gap-2 font-semibold border-base-300">
                        <i class="bi bi-tiktok text-error"></i> TikTok Video
                    </a>
                </div>
            </div>

            <!-- Floating 3D Box / Machine Image -->
            <div class="mt-6 lg:mt-0 lg:absolute lg:right-4 lg:bottom-4 lg:w-72 flex justify-center lg:justify-end">
                <img src="/3d_boxes/claw_machine_rabbit_space_ai.jpg" alt="Rabbit Space Claw Machine"
                     class="w-56 sm:w-64 lg:w-72 object-contain rounded-2xl shadow-xl transform group-hover:scale-105 group-hover:-rotate-1 transition duration-300 bg-base-100/80 p-2 border border-base-300"
                     onerror="this.onerror=null; this.src='/3d_boxes/claw_machine_tiktok_real.jpg';">
            </div>
        </div>

        <!-- Secondary Bento Column (Lg: 5 cols) -->
        <div class="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            
            <!-- Bento Card 1: Baby Three Macaron Series -->
            <div class="rounded-3xl bg-base-200/70 p-5 sm:p-6 border border-base-300 flex items-center justify-between group hover:border-primary/40 transition shadow-sm relative overflow-hidden">
                <div class="space-y-2 max-w-[60%]">
                    <div class="flex items-center gap-1.5">
                        <span class="badge badge-secondary badge-xs font-bold uppercase text-[9px]">Hot Series</span>
                        <span class="text-[11px] text-base-content/60 font-semibold">Baby Three</span>
                    </div>
                    <h3 class="font-heading font-bold text-base sm:text-lg text-base-content leading-snug">
                        Baby Three V3 & Macaron Plush
                    </h3>
                    <div class="text-sm font-extrabold text-primary font-heading">
                        $18.50 <span class="text-xs font-normal text-base-content/60">/ box</span>
                    </div>
                    <a href="{{ route('storefront.index', ['brand' => 'Baby Three']) }}" class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1">
                        Explore Collection <i class="bi bi-arrow-right text-[10px]"></i>
                    </a>
                </div>
                <div class="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden bg-base-100 border border-base-300 shadow-sm p-1">
                    <img src="/3d_boxes/babythree_v3_box_ai.jpg" alt="Baby Three V3"
                         class="w-full h-full object-cover rounded-xl group-hover:scale-110 transition duration-300"
                         onerror="this.onerror=null; this.src='/logo.png';">
                </div>
            </div>

            <!-- Bento Card 2: Pop Mart Labubu & Crybaby -->
            <div class="rounded-3xl bg-base-200/70 p-5 sm:p-6 border border-base-300 flex items-center justify-between group hover:border-primary/40 transition shadow-sm relative overflow-hidden">
                <div class="space-y-2 max-w-[60%]">
                    <div class="flex items-center gap-1.5">
                        <span class="badge badge-warning badge-xs font-bold uppercase text-[9px]">Official</span>
                        <span class="text-[11px] text-base-content/60 font-semibold">Pop Mart</span>
                    </div>
                    <h3 class="font-heading font-bold text-base sm:text-lg text-base-content leading-snug">
                        Labubu & Crybaby Sunset
                    </h3>
                    <div class="text-sm font-extrabold text-primary font-heading">
                        $19.50 <span class="text-xs font-normal text-base-content/60">/ box</span>
                    </div>
                    <a href="{{ route('storefront.index', ['brand' => 'Pop Mart']) }}" class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1">
                        View Blind Boxes <i class="bi bi-arrow-right text-[10px]"></i>
                    </a>
                </div>
                <div class="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden bg-base-100 border border-base-300 shadow-sm p-1">
                    <img src="/3d_boxes/labubu_macaron_box_ai.jpg" alt="Labubu Macaron"
                         class="w-full h-full object-cover rounded-xl group-hover:scale-110 transition duration-300"
                         onerror="this.onerror=null; this.src='/logo.png';">
                </div>
            </div>

        </div>
    </div>
</section>
