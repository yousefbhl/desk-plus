<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'description', 'type', 'value',
        'min_order', 'max_uses', 'used_count', 'per_user_limit',
        'starts_at', 'expires_at', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'value'      => 'decimal:2',
            'min_order'  => 'decimal:2',
            'is_active'  => 'boolean',
            'starts_at'  => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function usages() { return $this->hasMany(DiscountUsage::class); }
    public function orders() { return $this->hasMany(Order::class); }

    public function isValid(): bool
    {
        if (!$this->is_active) return false;
        if ($this->starts_at && now()->lt($this->starts_at)) return false;
        if ($this->expires_at && now()->gt($this->expires_at)) return false;
        if ($this->max_uses && $this->used_count >= $this->max_uses) return false;
        return true;
    }

    public function apply(float $subtotal): float
    {
        if ($subtotal < $this->min_order) return 0.0;
        return $this->type === 'percentage'
            ? round($subtotal * ($this->value / 100), 2)
            : min((float) $this->value, $subtotal);
    }
}