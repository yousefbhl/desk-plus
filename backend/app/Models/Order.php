<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'user_id', 'status',
        'subtotal', 'discount_id', 'discount_amount',
        'shipping_cost', 'tax', 'total',
        'shipping_address',
        'payment_method', 'payment_status', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'subtotal'        => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'shipping_cost'   => 'decimal:2',
            'tax'              => 'decimal:2',
            'total'            => 'decimal:2',
            'shipping_address' => 'array',
        ];
    }

    // ── Relationships ────────────────────────────────────────────
    public function user()            { return $this->belongsTo(User::class); }
    public function discount()        { return $this->belongsTo(Discount::class); }
    public function items()           { return $this->hasMany(OrderItem::class); }
    public function shippingAddress() { return $this->hasOne(ShippingAddress::class); }
    public function statusHistory()   { return $this->hasMany(OrderStatusHistory::class)->latest(); }

    // ── Scopes ───────────────────────────────────────────────────
    public function scopeForUser($query, int $userId) { return $query->where('user_id', $userId); }

    // ── Stats helper (admin dashboard) ──────────────────────────
    public static function monthlyRevenue(): \Illuminate\Support\Collection
    {
        return static::query()
            ->selectRaw('MONTH(created_at) as month, SUM(total) as revenue')
            ->where('status', '!=', 'cancelled')
            ->where('payment_status', 'paid')
            ->groupByRaw('MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)')
            ->get();
    }

    // ── Reference generator ──────────────────────────────────────
    public static function generateReference(int $id): string
    {
        return 'DSK-' . str_pad($id, 5, '0', STR_PAD_LEFT);
    }
}