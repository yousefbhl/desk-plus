<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'description',
        'price', 'compare_price', 'cost_price',
        'sku', 'stock',
        'category_id', 'space_id', 'taste_id', 'seller_id',
        'is_featured', 'is_active',
        'avg_rating', 'review_count',
    ];

    protected $hidden = ['cost_price']; // NEVER expose margin data

    protected function casts(): array
    {
        return [
            'price'         => 'decimal:2',
            'compare_price' => 'decimal:2',
            'cost_price'    => 'decimal:2',
            'avg_rating'    => 'decimal:2',
            'is_featured'   => 'boolean',
            'is_active'     => 'boolean',
        ];
    }

    // ── Relationships ────────────────────────────────────────────
    public function category()       { return $this->belongsTo(Category::class); }
    public function space()          { return $this->belongsTo(Space::class); }
    public function taste()          { return $this->belongsTo(Taste::class); }
    public function seller()         { return $this->belongsTo(User::class, 'seller_id'); }
    public function images()         { return $this->hasMany(ProductImage::class)->orderBy('sort_order'); }
    public function primaryImage()   { return $this->hasOne(ProductImage::class)->where('is_primary', true); }
    public function variants()       { return $this->hasMany(ProductVariant::class)->where('is_active', true); }
    public function specifications() { return $this->hasMany(ProductSpecification::class)->orderBy('sort_order'); }
    public function reviews()        { return $this->hasMany(Review::class)->where('is_approved', true); }
    public function orderItems()     { return $this->hasMany(OrderItem::class); }
    public function cartItems()      { return $this->hasMany(CartItem::class); }
    public function spaces()         { return $this->belongsToMany(Space::class, 'product_space')->withPivot('sort_order')->withTimestamps(); }
    public function wishlistedBy()   { return $this->belongsToMany(User::class, 'wishlists')->withTimestamps(); }

    // ── Scopes ───────────────────────────────────────────────────
    public function scopeFilter(Builder $query, Request $request): Builder
    {
        return $query
            ->when($request->category_id,  fn (Builder $q, $id)   => $q->where('category_id', $id))
            ->when($request->category,     fn (Builder $q, $slug) => $q->whereHas('category', fn ($c) => $c->where('slug', $slug)))
            ->when($request->space_id,     fn (Builder $q, $id)   => $q->where('space_id', $id))
            ->when($request->space,        fn (Builder $q, $slug) => $q->whereHas('space', fn ($s) => $s->where('slug', $slug)))
            ->when($request->taste_id,     fn (Builder $q, $id)   => $q->where('taste_id', $id))
            ->when($request->taste,        fn (Builder $q, $slug) => $q->whereHas('taste', fn ($t) => $t->where('slug', $slug)))
            ->when($request->min_price,    fn (Builder $q, $price) => $q->where('price', '>=', $price))
            ->when($request->max_price,    fn (Builder $q, $price) => $q->where('price', '<=', $price))
            ->when($request->in_stock,     fn (Builder $q)         => $q->where('stock', '>', 0))
            ->when($request->is_featured,  fn (Builder $q)         => $q->where('is_featured', true))
            ->when($request->search,       fn (Builder $q, $term)  => $q->where('name', 'like', "%{$term}%"))
            ->when($request->color,        fn (Builder $q, $color) => $q->whereHas('variants', fn ($v) => $v->where('color', $color)))
            ->when($request->material,     fn (Builder $q, $mat)   => $q->whereHas('variants', fn ($v) => $v->where('material', $mat)))
            ->when($request->sort, function (Builder $q, string $sort) {
                match ($sort) {
                    'price_asc'    => $q->orderBy('price'),
                    'price_desc'   => $q->orderByDesc('price'),
                    'newest'       => $q->latest(),
                    'rating'       => $q->orderByDesc('avg_rating'),
                    'popular'      => $q->orderByDesc('review_count'),
                    default        => $q->latest(),
                };
            }, fn (Builder $q) => $q->latest());
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeBestSeller(Builder $query): Builder
    {
        return $query->withCount('orderItems')->orderByDesc('order_items_count');
    }

    // ── Helpers ──────────────────────────────────────────────────
    public function getInStockAttribute(): bool
    {
        return $this->stock > 0;
    }

    public function refreshRating(): void
    {
        $approved = $this->reviews()->approved()->get();
        $this->update([
            'avg_rating'   => $approved->avg('rating') ?? 0,
            'review_count' => $approved->count(),
        ]);
    }
}