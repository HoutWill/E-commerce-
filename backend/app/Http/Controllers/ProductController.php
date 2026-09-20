<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Search query
        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('series', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category') && $request->input('category') !== 'All') {
            $query->where('category', $request->input('category'));
        }

        // Brand filter
        if ($request->filled('brand') && $request->input('brand') !== 'All') {
            $query->where('brand', $request->input('brand'));
        }

        // Stock status filter
        if ($request->filled('stock_status') && $request->input('stock_status') !== 'All') {
            $query->where('stock_status', $request->input('stock_status'));
        }

        // Sorting
        $sort = $request->input('sort', 'popular');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'popular':
            default:
                $query->orderBy('featured', 'desc')->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate(48)->withQueryString();
        $allProducts = Product::orderBy('featured', 'desc')->orderBy('created_at', 'desc')->get();

        // Get all categories with counts
        $categories = Product::selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get();

        // Get distinct brands
        $brands = Product::whereNotNull('brand')
            ->selectRaw('brand, count(*) as count')
            ->groupBy('brand')
            ->orderBy('count', 'desc')
            ->get();

        // Featured viral drops for top carousel / spotlight
        $viralDrops = Product::where('featured', true)
            ->orWhere('category', 'Limited Edition')
            ->take(6)
            ->get();

        // Store settings
        $settings = [
            'store_name' => Setting::get('store_name', 'CLASSY BLING'),
            'tagline' => Setting::get('tagline', 'Viral Blind Boxes & Luxury Plush Charms'),
            'owner_name' => Setting::get('owner_name', 'Xiao yi'),
            'location_name' => Setting::get('location_name', 'Classy Bling Showroom'),
            'address' => Setting::get('address', 'Classy Bling, Khan Por Senchey / Chom Chao, Phnom Penh, Cambodia'),
            'google_maps_url' => Setting::get('google_maps_url', 'https://maps.google.com'),
            'telegram_phone' => Setting::get('telegram_phone', '092917831 (+85592917831)'),
            'telegram_url' => Setting::get('telegram_url', 'https://t.me/+85592917831'),
            'tiktok_handle' => Setting::get('tiktok_handle', '@classy.bling'),
            'tiktok_url' => Setting::get('tiktok_url', 'https://www.tiktok.com/@classy.bling'),
            'khr_rate' => Setting::get('khr_rate', 4100),
            'show_announcement' => Setting::get('show_announcement', true),
            'announcement_text' => Setting::get('announcement_text', 'Direct TikTok Unboxings Live Everyday! 100% Sealed Blind Boxes • Fast Phnom Penh & Provincial Delivery!'),
        ];

        // Ref 1 & 2: Circular Categories configuration
        $circularCategories = [
            [
                'name' => 'All Drops',
                'slug' => 'All',
                'image' => '/3d_boxes/claw_machine_rabbit_space_ai.jpg',
                'badge' => '25 Items',
                'icon' => 'bi-grid-fill',
            ],
            [
                'name' => 'Claw Machines',
                'slug' => 'Limited Edition',
                'image' => '/3d_boxes/claw_machine_tiktok_real.jpg',
                'badge' => 'VIRAL',
                'icon' => 'bi-joystick',
            ],
            [
                'name' => 'Plush Dolls',
                'slug' => 'Plush Dolls',
                'image' => '/3d_boxes/labubu_macaron_box_ai.jpg',
                'badge' => 'Trending',
                'icon' => 'bi-heart-fill',
            ],
            [
                'name' => 'Blind Boxes',
                'slug' => 'Blind Box Series',
                'image' => '/3d_boxes/crybaby_sunset_box_ai.jpg',
                'badge' => 'Popular',
                'icon' => 'bi-box-seam-fill',
            ],
            [
                'name' => 'Baby Three',
                'slug' => 'Baby Three',
                'image' => '/3d_boxes/babythree_v3_box_ai.jpg',
                'badge' => 'Hot Drop',
                'icon' => 'bi-fire',
            ],
            [
                'name' => 'Pop Mart',
                'slug' => 'Pop Mart',
                'image' => '/3d_boxes/spacemolly_box_ai.jpg',
                'badge' => 'Official',
                'icon' => 'bi-gem',
            ],
        ];

        if ($request->ajax() && $request->wantsJson()) {
            return response()->json([
                'products' => $products,
                'total' => $products->total(),
            ]);
        }

        return view('storefront.home', compact(
            'products',
            'allProducts',
            'categories',
            'brands',
            'viralDrops',
            'settings',
            'circularCategories'
        ));
    }

    /**
     * Home Page View
     */
    public function home(Request $request)
    {
        return $this->index($request);
    }

    /**
     * Dedicated Products Catalog Page View
     */
    public function productsPage(Request $request)
    {
        $allProducts = Product::orderBy('featured', 'desc')->orderBy('created_at', 'desc')->get();
        $categories = Product::selectRaw('category, count(*) as count')->groupBy('category')->orderBy('count', 'desc')->get();
        $brands = Product::whereNotNull('brand')->selectRaw('brand, count(*) as count')->groupBy('brand')->orderBy('count', 'desc')->get();

        $settings = $this->getSettings();

        return view('storefront.products', compact(
            'allProducts',
            'categories',
            'brands',
            'settings'
        ));
    }

    /**
     * Dedicated Contact & Showroom Page View
     */
    public function contactPage(Request $request)
    {
        $settings = $this->getSettings();
        return view('storefront.contact', compact('settings'));
    }

    /**
     * Shared Settings Helper
     */
    private function getSettings(): array
    {
        return [
            'store_name' => Setting::get('store_name', 'CLASSY BLING'),
            'tagline' => Setting::get('tagline', 'Viral Blind Boxes & Luxury Plush Charms'),
            'owner_name' => Setting::get('owner_name', 'Xiao yi'),
            'location_name' => Setting::get('location_name', 'Classy Bling Showroom'),
            'address' => Setting::get('address', 'Classy Bling, Khan Por Senchey / Chom Chao, Phnom Penh, Cambodia'),
            'google_maps_url' => Setting::get('google_maps_url', 'https://maps.google.com'),
            'telegram_phone' => Setting::get('telegram_phone', '092917831 (+85592917831)'),
            'telegram_url' => Setting::get('telegram_url', 'https://t.me/+85592917831'),
            'tiktok_handle' => Setting::get('tiktok_handle', '@classy.bling'),
            'tiktok_url' => Setting::get('tiktok_url', 'https://www.tiktok.com/@classy.bling'),
            'khr_rate' => Setting::get('khr_rate', 4100),
            'show_announcement' => Setting::get('show_announcement', true),
            'announcement_text' => Setting::get('announcement_text', 'Direct TikTok Unboxings Live Everyday! 100% Sealed Blind Boxes • Fast Phnom Penh & Provincial Delivery!'),
        ];
    }

    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        if (request()->ajax() || request()->wantsJson()) {
            return response()->json($product);
        }

        return view('storefront.show', compact('product'));
    }
}
