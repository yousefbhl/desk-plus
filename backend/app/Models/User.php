<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'phone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'cost_price', // never expose
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ── Relationships ────────────────────────────────────────────
    public function orders()       { return $this->hasMany(Order::class); }
    public function reviews()      { return $this->hasMany(Review::class); }
    public function products()     { return $this->hasMany(Product::class, 'seller_id'); }
    public function cart()         { return $this->hasOne(Cart::class); }
    public function statistics()   { return $this->hasMany(SellerStatistic::class, 'seller_id'); }
    public function wishlist()     { return $this->belongsToMany(Product::class, 'wishlists')->withTimestamps(); }

    // ── Helpers ──────────────────────────────────────────────────
    public function isAdmin(): bool   { return $this->role === 'admin'; }
    public function isSeller(): bool  { return $this->role === 'seller'; }
}