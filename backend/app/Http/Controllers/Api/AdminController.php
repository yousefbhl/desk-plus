<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_sales' => (float) Order::sum('total'),
            'best_seller' => Product::bestSeller()->first(),
            'monthly' => Order::monthlyRevenue(),
        ]);
    }
}
