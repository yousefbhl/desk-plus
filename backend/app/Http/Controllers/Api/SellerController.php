<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    private function ensureSeller(Request $request): void
    {
        if (!$request->user()?->isSeller() && !$request->user()?->isAdmin()) {
            abort(403, 'Seller access required.');
        }
    }

    public function stats(Request $request)
    {
        $this->ensureSeller($request);
        $sellerId = $request->user()->id;

        $sellerItems = \App\Models\OrderItem::query()
            ->whereHas('product', fn ($q) => $q->where('seller_id', $sellerId));

        return response()->json([
            'products_count' => Product::where('seller_id', $sellerId)->count(),
            'active_products' => Product::where('seller_id', $sellerId)->where('is_active', true)->count(),
            'low_stock_products' => Product::where('seller_id', $sellerId)->where('stock', '<=', 5)->where('stock', '>', 0)->count(),
            'orders_count' => Order::whereHas('items.product', fn ($q) => $q->where('seller_id', $sellerId))->count(),
            'pending_orders' => Order::whereHas('items.product', fn ($q) => $q->where('seller_id', $sellerId))
                ->whereIn('status', ['pending', 'preparing'])
                ->count(),
            'revenue' => (float) (clone $sellerItems)->sum('total'),
            'units_sold' => (int) (clone $sellerItems)->sum('quantity'),
        ]);
    }

    public function products(Request $request)
    {
        $this->ensureSeller($request);

        return ProductResource::collection(
            Product::where('seller_id', $request->user()->id)->latest()->paginate(10)
        );
    }

    public function orders(Request $request)
    {
        $this->ensureSeller($request);

        $sellerId = $request->user()->id;
        $orders = Order::with(['user', 'items.product'])
            ->whereHas('items.product', fn ($q) => $q->where('seller_id', $sellerId))
            ->latest()
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'data' => $orders->getCollection()->map(fn (Order $order) => $this->sellerOrderPayload($order, $sellerId))->values(),
            'current_page' => $orders->currentPage(),
            'last_page' => $orders->lastPage(),
            'per_page' => $orders->perPage(),
            'total' => $orders->total(),
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $this->ensureSeller($request);

        $sellerId = $request->user()->id;
        abort_unless(
            $order->items()->whereHas('product', fn ($q) => $q->where('seller_id', $sellerId))->exists(),
            403,
            'This order does not belong to your atelier.'
        );

        $data = $request->validate([
            'status' => 'required|in:preparing,shipping,delivered,cancelled',
            'note' => 'nullable|string|max:255',
        ]);

        $order->update(['status' => $data['status']]);

        OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $data['status'],
            'note' => $data['note'] ?? 'Updated by seller.',
            'changed_by' => $request->user()->id,
        ]);

        return response()->json($this->sellerOrderPayload(
            $order->fresh(['user', 'items.product']),
            $sellerId
        ));
    }

    private function sellerOrderPayload(Order $order, int $sellerId): array
    {
        $sellerItems = $order->items
            ->filter(fn ($item) => $item->product?->seller_id === $sellerId)
            ->values();

        return [
            'id' => $order->id,
            'reference' => $order->reference,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'customer' => [
                'name' => $order->user?->name ?? 'Client',
                'email' => $order->user?->email,
            ],
            'items_count' => $sellerItems->sum('quantity'),
            'seller_total' => (float) $sellerItems->sum('total'),
            'items' => $sellerItems->map(fn ($item) => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $item->product_name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'total' => (float) $item->total,
            ])->all(),
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
        ];
    }
}
