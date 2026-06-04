<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SellerController extends Controller
{
    /* ──────────────────────────────────────────────────────────────
     |  DASHBOARD — headline numbers + recent orders + hero product
     ────────────────────────────────────────────────────────────── */
    public function dashboard(Request $request)
    {
        $sellerId = $request->user()->id;

        $productsCount = Product::where('seller_id', $sellerId)->count();
        $activeCount   = Product::where('seller_id', $sellerId)->where('is_active', true)->count();
        $lowStock      = Product::where('seller_id', $sellerId)->where('stock', '<=', 5)->where('stock', '>', 0)->count();
        $outOfStock    = Product::where('seller_id', $sellerId)->where('stock', 0)->count();

        // revenue + units from order_items joined to this seller's products
        $sales = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->selectRaw('COALESCE(SUM(order_items.total),0) as revenue, COALESCE(SUM(order_items.quantity),0) as units')
            ->first();

        // average rating across this seller's products
        $avgRating = round((float) Product::where('seller_id', $sellerId)->avg('avg_rating'), 1);
        $reviews   = (int) Product::where('seller_id', $sellerId)->sum('review_count');

        // recent orders containing this seller's products
        $recentOrders = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->where('products.seller_id', $sellerId)
            ->orderByDesc('orders.created_at')
            ->limit(8)
            ->get([
                'orders.reference as reference',
                'users.name as customer',
                'order_items.product_name as piece',
                'order_items.quantity as qty',
                'order_items.total as earnings',
                'orders.status as status',
            ]);

        // hero / top product by revenue
        $hero = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->groupBy('products.id', 'products.name', 'products.stock', 'products.avg_rating')
            ->orderByRaw('SUM(order_items.total) DESC')
            ->limit(1)
            ->first([
                'products.id',
                'products.name',
                'products.stock',
                'products.avg_rating',
                DB::raw('SUM(order_items.quantity) as sold'),
                DB::raw('SUM(order_items.total) as earned'),
            ]);

        return response()->json([
            'seller_name'   => $request->user()->name,
            'kpis' => [
                'revenue'        => round((float) $sales->revenue, 2),
                'units'          => (int) $sales->units,
                'active'         => $activeCount,
                'low_stock'      => $lowStock,
                'avg_rating'     => $avgRating ?: 0,
                'reviews'        => $reviews,
                'products_count' => $productsCount,
                'out_of_stock'   => $outOfStock,
            ],
            'recent_orders' => $recentOrders,
            'hero'          => $hero,
        ]);
    }

    /* ──────────────────────────────────────────────────────────────
     |  STATISTICS — richer metrics for the stats page
     ────────────────────────────────────────────────────────────── */
    public function stats(Request $request)
    {
        $sellerId = $request->user()->id;

        $revenue = (float) DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->sum('order_items.total');

        $unitsSold = (int) DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->sum('order_items.quantity');

        $ordersCount = (int) DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->distinct('order_items.order_id')
            ->count('order_items.order_id');

        $avgOrder = $ordersCount > 0 ? round($revenue / $ordersCount, 2) : 0;

        // top products by revenue (with sold count) — for the ranked list
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.seller_id', $sellerId)
            ->groupBy('products.id', 'products.name')
            ->orderByRaw('SUM(order_items.total) DESC')
            ->limit(5)
            ->get([
                'products.name',
                DB::raw('SUM(order_items.quantity) as sold'),
                DB::raw('SUM(order_items.total) as revenue'),
            ]);

        // monthly revenue (last 6 months) — pgsql EXTRACT
        $monthly = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('products.seller_id', $sellerId)
            ->where('orders.created_at', '>=', now()->subMonths(6))
            ->selectRaw("EXTRACT(MONTH FROM orders.created_at) as month, EXTRACT(YEAR FROM orders.created_at) as year, SUM(order_items.total) as revenue")
            ->groupByRaw('EXTRACT(YEAR FROM orders.created_at), EXTRACT(MONTH FROM orders.created_at)')
            ->orderByRaw('EXTRACT(YEAR FROM orders.created_at), EXTRACT(MONTH FROM orders.created_at)')
            ->get();

        $avgRating = round((float) Product::where('seller_id', $sellerId)->avg('avg_rating'), 1);
        $reviews   = (int) Product::where('seller_id', $sellerId)->sum('review_count');

        return response()->json([
            'revenue'      => round($revenue, 2),
            'units_sold'   => $unitsSold,
            'orders_count' => $ordersCount,
            'avg_order'    => $avgOrder,
            'avg_rating'   => $avgRating ?: 0,
            'reviews'      => $reviews,
            'top_products' => $topProducts,
            'monthly'      => $monthly,
        ]);
    }

    /* ──────────────────────────────────────────────────────────────
     |  PRODUCTS — this seller's products, searchable + sortable
     ────────────────────────────────────────────────────────────── */
    public function products(Request $request)
    {
        $query = Product::with(['category', 'images'])
            ->where('seller_id', $request->user()->id);

        // search by name or sku
        if ($search = $request->get('search')) {
            $query->where(fn ($q) =>
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
            );
        }

        // filter tab: active / low / out / drafts
        switch ($request->get('filter')) {
            case 'active': $query->where('is_active', true); break;
            case 'low':    $query->where('stock', '<=', 5)->where('stock', '>', 0); break;
            case 'out':    $query->where('stock', 0); break;
            case 'drafts': $query->where('is_active', false); break;
        }

        // sort
        switch ($request->get('sort')) {
            case 'price_asc':  $query->orderBy('price', 'asc'); break;
            case 'price_desc': $query->orderBy('price', 'desc'); break;
            case 'stock_asc':  $query->orderBy('stock', 'asc'); break;
            case 'oldest':     $query->oldest(); break;
            default:           $query->latest(); // newest
        }

        return ProductResource::collection(
            $query->paginate($request->get('per_page', 12))
        );
    }

    /* ──────────────────────────────────────────────────────────────
     |  CREATE PRODUCT — seller owns it. image_url comes from Supabase
     |  (uploaded client-side); we just store the URL here.
     ────────────────────────────────────────────────────────────── */
    public function storeProduct(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:200',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'sku'           => 'nullable|string|max:100|unique:products,sku',
            'stock'         => 'required|integer|min:0',
            'category_id'   => 'required|exists:categories,id',
            'space_id'      => 'nullable|exists:spaces,id',
            'taste_id'      => 'nullable|exists:tastes,id',
            'image_url'     => 'nullable|url',          // Supabase public URL
            'is_active'     => 'boolean',
        ]);

        $product = Product::create([
            'name'          => $data['name'],
            'slug'          => Str::slug($data['name']) . '-' . Str::lower(Str::random(5)),
            'description'   => $data['description'] ?? null,
            'price'         => $data['price'],
            'compare_price' => $data['compare_price'] ?? null,
            'sku'           => $data['sku'] ?? null,
            'stock'         => $data['stock'],
            'category_id'   => $data['category_id'],
            'space_id'      => $data['space_id'] ?? null,
            'taste_id'      => $data['taste_id'] ?? null,
            'seller_id'     => $request->user()->id,    // ← the key bit
            'is_active'     => $data['is_active'] ?? true,
        ]);

        // attach the Supabase image URL if provided
        if (!empty($data['image_url'])) {
            ProductImage::create([
                'product_id' => $product->id,
                'url'        => $data['image_url'],
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }

        return new ProductResource($product->load(['category', 'images']));
    }

    /* ──────────────────────────────────────────────────────────────
     |  UPDATE STOCK — quick restock from the products page
     ────────────────────────────────────────────────────────────── */
    public function updateStock(Request $request, Product $product)
    {
        // make sure the seller owns this product
        if ($product->seller_id !== $request->user()->id) {
            return response()->json(['message' => 'Not your product.'], 403);
        }

        $data = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $product->update(['stock' => $data['stock']]);

        return new ProductResource($product->load(['category', 'images']));
    }

    /* ──────────────────────────────────────────────────────────────
     |  ORDERS — orders containing this seller's products (Commandes)
     ────────────────────────────────────────────────────────────── */
    public function orders(Request $request)
    {
        $sellerId = $request->user()->id;

        $query = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->where('products.seller_id', $sellerId);

        if ($status = $request->get('status')) {
            $query->where('orders.status', $status);
        }
        if ($search = $request->get('search')) {
            $query->where('orders.reference', 'like', "%{$search}%");
        }

        $rows = $query
            ->orderByDesc('orders.created_at')
            ->paginate($request->get('per_page', 15), [
                'orders.id as order_id',
                'orders.reference as reference',
                'users.name as customer',
                'order_items.product_name as piece',
                'order_items.quantity as qty',
                'order_items.total as earnings',
                'orders.status as status',
                'orders.created_at as date',
            ]);

        return response()->json($rows);
    }
}