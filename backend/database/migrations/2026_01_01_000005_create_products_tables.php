<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('compare_price', 10, 2)->nullable(); // crossed-out "was" price
            $table->decimal('cost_price', 10, 2)->nullable();   // private — never expose in public API
            $table->string('sku', 100)->nullable()->unique();
            $table->integer('stock')->default(0);
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('space_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('taste_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('seller_id')->constrained('users')->restrictOnDelete();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->decimal('avg_rating', 3, 2)->default(0.00); // cached — updated by observer
            $table->integer('review_count')->default(0);        // cached — updated by observer
            $table->timestamps();
            $table->softDeletes(); // deleted_at

            $table->index('slug');
            $table->index('category_id');
            $table->index('space_id');
            $table->index('taste_id');
            $table->index('seller_id');
            $table->index('price');
            $table->index('stock');
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('deleted_at');
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('url');          // Supabase Storage public URL
            $table->string('alt_text', 200)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->index('product_id');
            $table->index(['product_id', 'is_primary']);
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('color', 50)->nullable();
            $table->string('color_hex', 7)->nullable();  // #RRGGBB for swatch rendering
            $table->string('material', 100)->nullable();
            $table->decimal('price_modifier', 10, 2)->default(0.00); // added to base price
            $table->integer('stock')->default(0);
            $table->string('sku_suffix', 50)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('product_id');
        });

        Schema::create('product_specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('key', 100);    // e.g. Dimensions, Weight, Material
            $table->string('value', 255);  // e.g. 120x60x75 cm
            $table->integer('sort_order')->default(0);

            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_specifications');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
    }
};
