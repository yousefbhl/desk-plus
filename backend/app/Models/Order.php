<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'status', 'total'];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function monthlyRevenue()
    {
        return static::query()
            ->selectRaw('MONTH(created_at) as month, SUM(total) as revenue')
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }
}
