<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('seller_statistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->tinyInteger('month');   // 1–12
            $table->smallInteger('year');
            $table->integer('total_orders')->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0.00);
            $table->integer('total_products')->default(0);
            $table->foreignId('best_product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->timestamps();

            $table->unique(['seller_id', 'month', 'year']);
            $table->index('seller_id');
            $table->index(['year', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seller_statistics');
    }
};
