<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    public function stats(Request $request)
    {
        $sellerId = $request->user()->id;

        return response()->json([
            'products_count' => Product::where('seller_id', $sellerId)->count(),
            'orders_count' => Order::whereHas('items.product', fn ($q) => $q->where('seller_id', $sellerId))->count(),
        ]);
    }

    public function products(Request $request)
    {
        return ProductResource::collection(
            Product::where('seller_id', $request->user()->id)->latest()->paginate(10)
        );
    }
}
