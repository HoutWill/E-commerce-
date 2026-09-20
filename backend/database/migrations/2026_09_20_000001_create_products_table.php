<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->decimal('price', 10, 2)->default(0.00);
            $table->string('currency')->default('USD');
            $table->string('stock_status')->default('In Stock');
            $table->string('category')->index();
            $table->string('subcategory')->nullable();
            $table->string('brand')->nullable()->index();
            $table->string('series')->nullable();
            $table->text('description')->nullable();
            $table->string('image_url');
            $table->string('original_screenshot_url')->nullable();
            $table->string('tiktok_video_url')->nullable();
            $table->string('tiktok_post_id')->nullable();
            $table->string('contact_telegram')->nullable();
            $table->string('contact_facebook')->nullable();
            $table->boolean('featured')->default(false)->index();
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
