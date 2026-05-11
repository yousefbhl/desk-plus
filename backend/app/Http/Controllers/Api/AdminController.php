<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\UserResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // GET /api/admin/stats
    public function stats()
    {
        $totalUsers    = User::where('role', 'customer')->count();
        $totalSellers  = User::where('role', 'seller')->count();
        $totalRevenue  = Order::where('payment_status', 'paid')
                              ->where('status', '!=', 'cancelled')
                              ->sum('total');
        $totalOrders   = Order::where('status', '!=', 'cancelled')->count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $avgOrder      = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        // Best selling product
        $bestSeller = DB::table('order_items')
            ->select('product_id', 'product_name', DB::raw('SUM(quantity) as units_sold'))
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('units_sold')
            ->first();

        // Best selling category
        $bestCategory = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(order_items.quantity) as units_sold'))
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('units_sold')
            ->first();

        // Monthly revenue — PostgreSQL EXTRACT (no MONTH()/YEAR() in pgsql)
        $monthly = DB::table('orders')
            ->selectRaw("EXTRACT(MONTH FROM created_at) as month, EXTRACT(YEAR FROM created_at) as year, SUM(total) as revenue, COUNT(*) as orders")
            ->where('payment_status', 'paid')
            ->where('status', '!=', 'cancelled')
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupByRaw('EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)')
            ->orderByRaw('EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)')
            ->get();

        // Orders by status
        $ordersByStatus = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // Top 5 products — order_items.total = quantity × unit_price
        $topProducts = DB::table('order_items')
            ->select(
                'product_id',
                'product_name',
                DB::raw('SUM(quantity) as units_sold'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('product_id', 'product_name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        // Seller rankings
        $sellerRankings = User::where('role', 'seller')
            ->withCount('products')
            ->get()
            ->map(function ($seller) {
                $revenue = DB::table('order_items')
                    ->join('products', 'order_items.product_id', '=', 'products.id')
                    ->where('products.seller_id', $seller->id)
                    ->sum('order_items.total');
                return [
                    'id'             => $seller->id,
                    'name'           => $seller->name,
                    'avatar'         => $seller->avatar,
                    'products_count' => $seller->products_count,
                    'revenue'        => round($revenue, 2),
                ];
            })
            ->sortByDesc('revenue')
            ->values();

        return response()->json([
            'overview' => [
                'total_users'    => $totalUsers,
                'total_sellers'  => $totalSellers,
                'total_revenue'  => round($totalRevenue, 2),
                'total_orders'   => $totalOrders,
                'pending_orders' => $pendingOrders,
                'avg_order'      => $avgOrder,
            ],
            'best_seller'      => $bestSeller,
            'best_category'    => $bestCategory,
            'monthly_revenue'  => $monthly,
            'orders_by_status' => $ordersByStatus,
            'top_products'     => $topProducts,
            'seller_rankings'  => $sellerRankings,
        ]);
    }

    // GET /api/admin/orders
    public function orders(Request $request)
    {
        $query = Order::with(['user', 'items', 'shippingAddress'])->latest();

        if ($request->status)         $query->where('status', $request->status);
        if ($request->payment_status) $query->where('payment_status', $request->payment_status);
        if ($request->search)         $query->where('reference', 'like', "%{$request->search}%");
        if ($request->from)           $query->whereDate('created_at', '>=', $request->from);
        if ($request->to)             $query->whereDate('created_at', '<=', $request->to);

        return OrderResource::collection($query->paginate($request->get('per_page', 20)));
    }

    // GET /api/admin/users
    public function users(Request $request)
    {
        $query = User::withCount(['orders', 'products'])->latest();

        if ($request->role)   $query->where('role', $request->role);
        if ($request->search) {
            $query->where(fn ($q) =>
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%")
            );
        }

        return UserResource::collection($query->paginate($request->get('per_page', 20)));
    }

    // PUT /api/admin/users/{id}/role
    public function updateUserRole(Request $request, User $user)
    {
        $user->update($request->validate(['role' => 'required|in:admin,seller,customer']));
        return new UserResource($user);
    }

    // DELETE /api/admin/users/{id}
    public function deleteUser(User $user)
    {
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Cannot delete admin accounts.'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted.']);
    }

    // GET /api/admin/reports/export
    public function exportReport(Request $request)
    {
        $request->validate([
            'type'   => 'required|in:orders,products,users',
            'from'   => 'nullable|date',
            'to'     => 'nullable|date',
            'format' => 'nullable|in:csv,json',
        ]);

        $format = $request->get('format', 'csv');

        $data = match ($request->type) {
            'orders' => Order::with(['user', 'items'])
                ->when($request->from, fn ($q) => $q->whereDate('created_at', '>=', $request->from))
                ->when($request->to,   fn ($q) => $q->whereDate('created_at', '<=', $request->to))
                ->get()->map(fn ($o) => [
                    'reference'      => $o->reference,
                    'customer'       => $o->user?->name ?? 'Guest',
                    'email'          => $o->user?->email ?? '-',
                    'status'         => $o->status,
                    'total'          => $o->total,
                    'payment_status' => $o->payment_status,
                    'items_count'    => $o->items->count(),
                    'date'           => $o->created_at->format('Y-m-d'),
                ]),

            'products' => Product::with(['category', 'seller'])->withCount('orderItems')
                ->get()->map(fn ($p) => [
                    'name'         => $p->name,
                    'sku'          => $p->sku ?? '-',
                    'category'     => $p->category->name,
                    'seller'       => $p->seller->name,
                    'price'        => $p->price,
                    'stock'        => $p->stock,
                    'orders_count' => $p->order_items_count,
                    'avg_rating'   => $p->avg_rating,
                    'status'       => $p->is_active ? 'active' : 'inactive',
                ]),

            'users' => User::withCount('orders')->get()->map(fn ($u) => [
                'name'         => $u->name,
                'email'        => $u->email,
                'role'         => $u->role,
                'orders_count' => $u->orders_count,
                'joined'       => $u->created_at->format('Y-m-d'),
            ]),
        };

        if ($format === 'json') return response()->json($data);

        if ($data->isEmpty()) return response()->json(['message' => 'No data to export.'], 404);

        $headers = array_keys($data->first());
        $csv = implode(',', $headers) . "\n";
        foreach ($data as $row) {
            $csv .= implode(',', array_map(
                fn ($v) => '"' . str_replace('"', '""', (string) $v) . '"',
                array_values($row)
            )) . "\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"deskplus-{$request->type}-report.csv\"",
        ]);
    }

    // GET /api/admin/reviews
    public function reviews(Request $request)
    {
        return response()->json(
            Review::with(['product:id,name,slug', 'user:id,name,email'])
                ->when(!$request->show_all, fn ($q) => $q->where('is_approved', false))
                ->latest()->paginate(20)
        );
    }

    // PATCH /api/admin/reviews/{id}/approve
    public function approveReview(Review $review)
    {
        $review->update(['is_approved' => true]);
        $review->product->refreshRating();
        return response()->json(['message' => 'Review approved.']);
    }

    // DELETE /api/admin/reviews/{id}
    public function deleteReview(Review $review)
    {
        $product = $review->product;
        $review->delete();
        $product->refreshRating();
        return response()->json(['message' => 'Review deleted.']);
    }
}