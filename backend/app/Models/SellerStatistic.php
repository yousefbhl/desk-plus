<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerStatistic extends Model
{
    protected $fillable = [
        'seller_id', 'month', 'year',
        'total_orders', 'total_revenue', 'total_products', 'best_product_id',
    ];

    protected function casts(): array
    {
        return ['total_revenue' => 'decimal:2'];
    }

    public function seller()      { return $this->belongsTo(User::class, 'seller_id'); }
    public function bestProduct() { return $this->belongsTo(Product::class, 'best_product_id'); }
}
