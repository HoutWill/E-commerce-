<section
    class="w-full relative select-none"
    id="home"
    x-data="{
        currentIndex: 0,
        slidesCount: 4,
        isPaused: false,
        timer: null,
        init() {
            this.startTimer();
        },
        startTimer() {
            this.timer = setInterval(() => {
                if (!this.isPaused) {
                    this.next();
                }
            }, 5000);
        },
        next() {
            this.currentIndex = (this.currentIndex + 1) % this.slidesCount;
        },
        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.slidesCount) % this.slidesCount;
        },
        goTo(index) {
            this.currentIndex = index;
        },
        handleBannerClick() {
            const el = document.getElementById('pop-now');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    }"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
>

    <!-- Banner Container: Full Width Edge-to-Edge with compact height -->
    <div
        @click="handleBannerClick()"
        class="relative w-full aspect-[16/8] sm:aspect-[3.43/1] min-h-[160px] sm:min-h-[220px] md:min-h-[300px] lg:min-h-[340px] max-h-[420px] overflow-hidden bg-slate-100 dark:bg-zinc-900 group cursor-pointer border-b border-slate-200/80 dark:border-zinc-800"
    >
        <!-- Slide 1: Rabbit Space Claw Machine Special Promotion -->
        <div
            class="absolute inset-0 transition-opacity duration-700 ease-in-out"
            :class="currentIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
        >
            <img
                src="/banner_classybling_clawmachine.png"
                alt="Classy Bling Rabbit Space Mini Arcade Claw Machine Special Promotion Banner"
                class="w-full h-full object-cover"
                loading="eager"
            />
        </div>

        <!-- Slide 2: Baby Three Zodiac -->
        <div
            class="absolute inset-0 transition-opacity duration-700 ease-in-out"
            :class="currentIndex === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
        >
            <img
                src="/banner_classybling_babythree.png"
                alt="Classy Bling Baby Three Zodiac Blind Box Official Banner"
                class="w-full h-full object-cover"
                loading="lazy"
            />
        </div>

        <!-- Slide 3: Nommi Pinky Energy -->
        <div
            class="absolute inset-0 transition-opacity duration-700 ease-in-out"
            :class="currentIndex === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
        >
            <img
                src="/banner_classybling_nommi.png"
                alt="Classy Bling Nommi Pinky Energy Plush Blind Box Official Banner"
                class="w-full h-full object-cover"
                loading="lazy"
            />
        </div>

        <!-- Slide 4: Mega Space Molly -->
        <div
            class="absolute inset-0 transition-opacity duration-700 ease-in-out"
            :class="currentIndex === 3 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
        >
            <img
                src="/banner_classybling_spacemolly.png"
                alt="Classy Bling Mega Space Molly Blind Box Official Banner"
                class="w-full h-full object-cover"
                loading="lazy"
            />
        </div>

        <!-- Left Arrow Navigation Button -->
        <button
            type="button"
            @click.stop="prev()"
            aria-label="Previous Slide"
            class="hidden sm:flex absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
        >
            <i class="bi bi-chevron-left text-base sm:text-xl font-bold"></i>
        </button>

        <!-- Right Arrow Navigation Button -->
        <button
            type="button"
            @click.stop="next()"
            aria-label="Next Slide"
            class="hidden sm:flex absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 dark:bg-zinc-900/60 dark:hover:bg-zinc-900/90 text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
        >
            <i class="bi bi-chevron-right text-base sm:text-xl font-bold"></i>
        </button>

        <!-- Top-Right Slide Indicator Dots with Signature Red Active Pill -->
        <div class="absolute top-3 right-3 sm:top-5 sm:right-6 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 sm:px-2.5 py-1 rounded-full border border-white/10">
            <button
                type="button"
                @click.stop="goTo(0)"
                aria-label="Go to slide 1"
                class="transition-all rounded-full cursor-pointer"
                :class="currentIndex === 0 ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-[#E50012]' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'"
            ></button>
            <button
                type="button"
                @click.stop="goTo(1)"
                aria-label="Go to slide 2"
                class="transition-all rounded-full cursor-pointer"
                :class="currentIndex === 1 ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-[#E50012]' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'"
            ></button>
            <button
                type="button"
                @click.stop="goTo(2)"
                aria-label="Go to slide 3"
                class="transition-all rounded-full cursor-pointer"
                :class="currentIndex === 2 ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-[#E50012]' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'"
            ></button>
            <button
                type="button"
                @click.stop="goTo(3)"
                aria-label="Go to slide 4"
                class="transition-all rounded-full cursor-pointer"
                :class="currentIndex === 3 ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-[#E50012]' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'"
            ></button>
        </div>

    </div>
</section>
