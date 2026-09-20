<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($request->filled('stock_status') && $request->input('stock_status') !== 'All') {
            $query->where('stock_status', $request->input('stock_status'));
        }

        if ($request->filled('category') && $request->input('category') !== 'All') {
            $query->where('category', $request->input('category'));
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        // KPI statistics
        $totalProducts = Product::count();
        $inStockCount = Product::where('stock_status', 'In Stock')->count();
        $soldOutCount = Product::where('stock_status', 'Sold Out')->count();
        $featuredCount = Product::where('featured', true)->count();
        $totalValueUsd = Product::sum('price');
        $totalValueKhr = $totalValueUsd * Setting::get('khr_rate', 4100);

        // Store settings
        $settings = [
            'store_name' => Setting::get('store_name', 'CLASSY BLING'),
            'tagline' => Setting::get('tagline', 'Viral Blind Boxes & Luxury Plush Charms'),
            'owner_name' => Setting::get('owner_name', 'Xiao yi'),
            'location_name' => Setting::get('location_name', 'Classy Bling Showroom'),
            'address' => Setting::get('address', 'Classy Bling, Khan Por Senchey / Chom Chao, Phnom Penh, Cambodia'),
            'google_maps_url' => Setting::get('google_maps_url', 'https://maps.google.com'),
            'telegram_phone' => Setting::get('telegram_phone', '092917831 (+85592917831)'),
            'telegram_username' => Setting::get('telegram_username', '@classybling_order'),
            'telegram_url' => Setting::get('telegram_url', 'https://t.me/+85592917831'),
            'tiktok_handle' => Setting::get('tiktok_handle', '@classy.bling'),
            'tiktok_url' => Setting::get('tiktok_url', 'https://www.tiktok.com/@classy.bling'),
            'facebook_name' => Setting::get('facebook_name', 'Classy Bling Cambodia'),
            'instagram_handle' => Setting::get('instagram_handle', '@classybling.kh'),
            'khr_rate' => Setting::get('khr_rate', 4100),
            'show_announcement' => (bool) Setting::get('show_announcement', true),
            'announcement_text' => Setting::get('announcement_text', 'Direct TikTok Unboxings Live Everyday! 100% Sealed Blind Boxes • Fast Phnom Penh & Provincial Delivery!'),
        ];

        $categories = Product::select('category')->distinct()->pluck('category');
        $brands = Product::whereNotNull('brand')->select('brand')->distinct()->pluck('brand');

        return view('admin.dashboard', compact(
            'products',
            'totalProducts',
            'inStockCount',
            'soldOutCount',
            'featuredCount',
            'totalValueUsd',
            'totalValueKhr',
            'settings',
            'categories',
            'brands'
        ));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
            'subcategory' => 'nullable|string|max:100',
            'brand' => 'nullable|string|max:100',
            'series' => 'nullable|string|max:100',
            'stock_status' => 'required|string',
            'description' => 'nullable|string',
            'image_url' => 'required|string',
            'tiktok_video_url' => 'nullable|url',
            'featured' => 'nullable|boolean',
            'tags' => 'nullable|string',
        ]);

        $id = 'prod_' . Str::slug($validated['name']) . '_' . Str::random(4);

        $tags = [];
        if (!empty($validated['tags'])) {
            $tags = array_map('trim', explode(',', $validated['tags']));
        }

        Product::create([
            'id' => $id,
            'name' => $validated['name'],
            'price' => $validated['price'],
            'currency' => 'USD',
            'category' => $validated['category'],
            'subcategory' => $validated['subcategory'] ?? null,
            'brand' => $validated['brand'] ?? 'Classy Bling',
            'series' => $validated['series'] ?? null,
            'stock_status' => $validated['stock_status'],
            'description' => $validated['description'] ?? null,
            'image_url' => $validated['image_url'],
            'tiktok_video_url' => $validated['tiktok_video_url'] ?? null,
            'contact_telegram' => Setting::get('telegram_url', 'https://t.me/+85592917831'),
            'featured' => $request->boolean('featured', false),
            'tags' => $tags,
        ]);

        return redirect()->route('admin.dashboard')->with('success', "Product '{$validated['name']}' added to catalog successfully!");
    }

    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
            'subcategory' => 'nullable|string|max:100',
            'brand' => 'nullable|string|max:100',
            'series' => 'nullable|string|max:100',
            'stock_status' => 'required|string',
            'description' => 'nullable|string',
            'image_url' => 'required|string',
            'tiktok_video_url' => 'nullable|url',
            'featured' => 'nullable|boolean',
            'tags' => 'nullable|string',
        ]);

        $tags = $product->tags;
        if (isset($validated['tags'])) {
            $tags = array_map('trim', explode(',', $validated['tags']));
        }

        $product->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'category' => $validated['category'],
            'subcategory' => $validated['subcategory'] ?? null,
            'brand' => $validated['brand'] ?? $product->brand,
            'series' => $validated['series'] ?? null,
            'stock_status' => $validated['stock_status'],
            'description' => $validated['description'] ?? null,
            'image_url' => $validated['image_url'],
            'tiktok_video_url' => $validated['tiktok_video_url'] ?? null,
            'featured' => $request->boolean('featured', false),
            'tags' => $tags,
        ]);

        return redirect()->route('admin.dashboard')->with('success', "Product '{$product->name}' updated successfully!");
    }

    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $name = $product->name;
        $product->delete();

        return redirect()->route('admin.dashboard')->with('success', "Product '{$name}' deleted from catalog.");
    }

    public function toggleStock(Request $request, string $id)
    {
        $product = Product::findOrFail($id);
        $newStatus = ($product->stock_status === 'In Stock') ? 'Sold Out' : 'In Stock';
        $product->stock_status = $newStatus;
        $product->save();

        if ($request->ajax() || $request->wantsJson()) {
            return response()->json([
                'success' => true,
                'id' => $product->id,
                'stock_status' => $product->stock_status,
                'badge_class' => $product->badge_class,
                'message' => "{$product->name} status changed to {$product->stock_status}",
            ]);
        }

        return redirect()->back()->with('success', "Status for '{$product->name}' changed to {$product->stock_status}.");
    }

    public function updateSettings(Request $request)
    {
        $fields = [
            'store_name',
            'tagline',
            'owner_name',
            'location_name',
            'address',
            'google_maps_url',
            'telegram_phone',
            'telegram_username',
            'telegram_url',
            'tiktok_handle',
            'tiktok_url',
            'facebook_name',
            'instagram_handle',
            'khr_rate',
            'show_announcement',
            'announcement_text',
        ];

        foreach ($fields as $f) {
            if ($request->has($f)) {
                if ($f === 'show_announcement') {
                    Setting::set($f, $request->boolean('show_announcement'));
                } else {
                    Setting::set($f, $request->input($f));
                }
            }
        }

        return redirect()->route('admin.dashboard')->with('success', 'Store settings and live links saved successfully!');
    }
}
