<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'price',
        'currency',
        'stock_status',
        'category',
        'subcategory',
        'brand',
        'series',
        'description',
        'image_url',
        'original_screenshot_url',
        'tiktok_video_url',
        'tiktok_post_id',
        'contact_telegram',
        'contact_facebook',
        'featured',
        'tags',
    ];

    protected $casts = [
        'price' => 'float',
        'featured' => 'boolean',
        'tags' => 'array',
    ];

    public function getPriceKhrAttribute(): string
    {
        $rate = 4100;
        return number_format($this->price * $rate);
    }

    public function getBadgeClassAttribute(): string
    {
        return match ($this->stock_status) {
            'In Stock' => 'badge-success',
            'Low Stock' => 'badge-warning',
            'Pre-Order' => 'badge-info',
            'Sold Out' => 'badge-neutral opacity-60',
            default => 'badge-ghost',
        };
    }
}
