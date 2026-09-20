<!-- Ref 2: Modern Retail Trust Badges Strip -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 bg-base-200/50 p-3 sm:p-4 rounded-2xl border border-base-300">
        <!-- Badge 1: 100% Authentic Sealed -->
        <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-base-100/60 transition duration-200">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                <i class="bi bi-shield-check"></i>
            </div>
            <div class="min-w-0">
                <div class="font-heading font-bold text-xs sm:text-sm text-base-content truncate">100% Sealed Boxes</div>
                <div class="text-[11px] text-base-content/60 truncate">Guaranteed authentic & secret chanced</div>
            </div>
        </div>

        <!-- Badge 2: Direct TikTok Livestreams -->
        <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-base-100/60 transition duration-200">
            <div class="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center text-xl shrink-0">
                <i class="bi bi-camera-reels-fill"></i>
            </div>
            <div class="min-w-0">
                <div class="font-heading font-bold text-xs sm:text-sm text-base-content truncate">TikTok Live Unboxings</div>
                <div class="text-[11px] text-base-content/60 truncate">Order live & get opened on stream</div>
            </div>
        </div>

        <!-- Badge 3: Express Dispatch -->
        <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-base-100/60 transition duration-200">
            <div class="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center text-xl shrink-0">
                <i class="bi bi-lightning-charge-fill"></i>
            </div>
            <div class="min-w-0">
                <div class="font-heading font-bold text-xs sm:text-sm text-base-content truncate">Express Dispatch</div>
                <div class="text-[11px] text-base-content/60 truncate">Phnom Penh same-day delivery</div>
            </div>
        </div>

        <!-- Badge 4: Telegram VIP Concierge -->
        <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-base-100/60 transition duration-200">
            <div class="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center text-xl shrink-0">
                <i class="bi bi-telegram"></i>
            </div>
            <div class="min-w-0">
                <div class="font-heading font-bold text-xs sm:text-sm text-base-content truncate">Telegram Concierge</div>
                <div class="text-[11px] text-base-content/60 truncate">{{ $settings['telegram_phone'] ?? '092917831' }}</div>
            </div>
        </div>
    </div>
</section>
