<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Space extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'cover_image',
        'layout_type', 'total_price', 'is_featured', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_featured'  => 'boolean',
            'is_active'    => 'boolean',
            'total_price'  => 'decimal:2',
        ];
    }

    public function products()      { return $this->hasMany(Product::class); }
    public function pivotProducts() { return $this->belongsToMany(Product::class, 'product_space')->withPivot('sort_order')->withTimestamps(); }
}