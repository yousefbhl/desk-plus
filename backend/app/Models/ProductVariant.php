<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 'color', 'color_hex', 'material',
        'price_modifier', 'stock', 'sku_suffix', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_modifier' => 'decimal:2',
            'is_active'      => 'boolean',
        ];
    }

    public function product()    { return $this->belongsTo(Product::class); }
    public function orderItems() { return $this->hasMany(OrderItem::class, 'variant_id'); }
    public function cartItems()  { return $this->hasMany(CartItem::class, 'variant_id'); }
}
