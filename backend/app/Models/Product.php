<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'category_id',
        'space_id',
        'taste_id',
        'seller_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function space()
    {
        return $this->belongsTo(Space::class);
    }

    public function taste()
    {
        return $this->belongsTo(Taste::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function scopeFilter(Builder $query, $request): Builder
    {
        return $query
            ->when($request->category_id, fn (Builder $q, $id) => $q->where('category_id', $id))
            ->when($request->space_id, fn (Builder $q, $id) => $q->where('space_id', $id))
            ->when($request->taste_id, fn (Builder $q, $id) => $q->where('taste_id', $id))
            ->when($request->search, fn (Builder $q, $term) => $q->where('name', 'like', "%{$term}%"));
    }

    public function scopeBestSeller(Builder $query): Builder
    {
        return $query->withCount('orderItems')->orderByDesc('order_items_count');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
