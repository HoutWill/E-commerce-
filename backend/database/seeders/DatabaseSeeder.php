<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Admin User
        User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Xiao yi (Admin)',
                'password' => Hash::make('123456'),
                'role' => 'admin',
            ]
        );

        // Seed Sample Customer
        User::updateOrCreate(
            ['email' => 'collector@classybling.com'],
            [
                'name' => 'VIP Collector',
                'password' => Hash::make('123456'),
                'role' => 'customer',
            ]
        );

        // 2. Seed Store Settings
        $defaultSettings = [
            'owner_name' => 'Xiao yi',
            'owner_role' => 'SHOP_OWNER',
            'store_name' => 'CLASSY BLING',
            'tagline' => 'Viral Blind Boxes & Luxury Plush Charms',
            'location_name' => 'Classy Bling Showroom',
            'address' => 'Classy Bling, Khan Por Senchey / Chom Chao, Phnom Penh, Cambodia',
            'google_maps_url' => 'https://www.google.com/maps/place/Classy+Bling/@11.523509,104.8231466,17z/data=!4m6!3m5!1s0x31094f007dfd6273:0xc9cc25eb1b5cb249!8m2!3d11.523898!4d104.8247774!16s%2Fg%2F11xm5ndfpm?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D',
            'telegram_phone' => '092917831 (+85592917831)',
            'telegram_username' => '@classybling_order',
            'telegram_url' => 'https://t.me/+85592917831',
            'tiktok_handle' => '@classy.bling',
            'tiktok_url' => 'https://www.tiktok.com/@classy.bling',
            'facebook_name' => 'Classy Bling Cambodia',
            'facebookUrl' => 'https://facebook.com',
            'instagram_handle' => '@classybling.kh',
            'instagram_url' => 'https://instagram.com',
            'khr_rate' => 4100,
            'show_announcement' => true,
            'announcement_text' => 'Direct TikTok Unboxings Live Everyday! 100% Sealed Blind Boxes • Fast Phnom Penh & Provincial Delivery!',
        ];

        foreach ($defaultSettings as $k => $v) {
            Setting::set($k, $v);
        }

        // 3. Seed Products
        $productsJsonPath = database_path('data/products.json');
        if (file_exists($productsJsonPath)) {
            $products = json_decode(file_get_contents($productsJsonPath), true);
            foreach ($products as $p) {
                Product::updateOrCreate(
                    ['id' => $p['id']],
                    [
                        'name' => $p['name'],
                        'price' => $p['price'] ?? 0,
                        'currency' => $p['currency'] ?? 'USD',
                        'stock_status' => $p['stockStatus'] ?? 'In Stock',
                        'category' => $p['category'] ?? 'Blind Box Series',
                        'subcategory' => $p['subcategory'] ?? null,
                        'brand' => $p['brand'] ?? 'Classy Bling',
                        'series' => $p['series'] ?? null,
                        'description' => $p['description'] ?? null,
                        'image_url' => $p['croppedImageUrl'] ?? ($p['originalScreenshotUrl'] ?? '/3d_boxes/box_placeholder.png'),
                        'original_screenshot_url' => $p['originalScreenshotUrl'] ?? null,
                        'tiktok_video_url' => $p['tiktokVideoUrl'] ?? null,
                        'tiktok_post_id' => $p['tiktokPostId'] ?? null,
                        'contact_telegram' => $p['contactTelegram'] ?? 'https://t.me/+85592917831',
                        'contact_facebook' => $p['contactFacebook'] ?? 'https://facebook.com',
                        'featured' => $p['featured'] ?? false,
                        'tags' => $p['tags'] ?? [],
                    ]
                );
            }
        }
    }
}
