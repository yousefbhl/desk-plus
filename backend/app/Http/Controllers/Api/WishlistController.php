<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $productIds = Wishlist::where('user_id', $request->user()->id)
            ->pluck('product_id');

        $products = Product::with(['category', 'images'])
            ->whereIn('id', $productIds)
            ->active()
            ->paginate(12);

        return ProductResource::collection($products);
    }

    public function toggle(Request $request, Product $product)
    {
        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['wishlisted' => false]);
        }

        Wishlist::create([
            'user_id'    => $request->user()->id,
            'product_id' => $product->id,
        ]);

        return response()->json(['wishlisted' => true]);
    }
}
