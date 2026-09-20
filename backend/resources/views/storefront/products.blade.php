@extends('layouts.app')

@section('title', 'All Products & Collectibles — CLASSY BLING')

@section('content')
    <!-- Products Catalog Page Header -->
    <div class="border-b border-slate-200/80 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/40 py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <!-- Breadcrumbs -->
                <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 mb-2 font-medium">
                    <a href="{{ route('home') }}" class="hover:text-[#229ED9] flex items-center gap-1 transition-colors">
                        <i class="bi bi-house-door"></i>
                        <span>Home</span>
                    </a>
                    <span>/</span>
                    <span class="text-slate-900 dark:text-white font-bold">Products</span>
                </div>

                <h1 class="text-2xl sm:text-3xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                    Designer Toys & Blind Box Catalog
                </h1>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                    Authentic viral collectible figures, sealed boxes, and luxury plush charms directly indexed from TikTok.
                </p>
            </div>

            <!-- Quick Stats & TikTok Live Unbox Badge -->
            <div class="flex items-center gap-2.5 shrink-0">
                <div class="px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-800 dark:text-zinc-200 shadow-2xs flex items-center gap-1.5">
                    <i class="bi bi-box-seam-fill text-[#229ED9]"></i>
                    <span>{{ count($allProducts) }} Items Available</span>
                </div>
                <a href="{{ $settings['tiktok_url'] ?? 'https://www.tiktok.com/@classy.bling' }}" target="_blank"
                   class="px-3 py-1.5 rounded-full bg-black text-white hover:bg-neutral-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition">
                    <i class="bi bi-tiktok text-xs"></i>
                    <span>Live Stream</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Main Catalog Section (Top Tabs + Left Sub-filter Icon Rail + Product Grid) -->
    @include('components.catalog')
@endsection
