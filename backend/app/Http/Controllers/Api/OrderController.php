<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Discount;
use App\Models\DiscountUsage;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // GET /api/orders  — customer sees own orders
    public function index(Request $request)
    {
        $orders = Order::with(['items', 'shippingAddress'])
            ->forUser($request->user()->id)
            ->latest()
            ->paginate(10);

        return OrderResource::collection($orders);
    }

    // GET /api/orders/{id}
    public function show(Request $request, Order $order)
    {
        // Customers can only see their own orders
        if (!$request->user()->isAdmin() && $order->user_id !== $request->user()->id) {
            abort(403, 'Forbidden.');
        }

        $order->load(['items', 'shippingAddress', 'statusHistory', 'user', 'discount']);

        return new OrderResource($order);
    }

    // POST /api/orders  — place new order
    public function store(Request $request)
    {
        $data = $request->validate([
            'items'                          => 'required|array|min:1',
            'items.*.product_id'             => 'required|integer|exists:products,id',
            'items.*.product_name'           => 'required|string|max:200',
            'items.*.quantity'               => 'required|integer|min:1',
            'items.*.unit_price'             => 'required|numeric|min:0',
            'shipping_address'               => 'required|array',
            'shipping_address.full_name'     => 'required|string|max:160',
            'shipping_address.address_line1' => 'required|string|max:255',
            'shipping_address.city'          => 'required|string|max:100',
            'shipping_address.region'        => 'nullable|string|max:100',
            'shipping_address.postal_code'   => 'nullable|string|max:20',
            'shipping_address.phone'         => 'required|string|max:20',
            'payment_method'                 => 'required|string|in:cod,card,cash,bank_transfer',
            'subtotal'                       => 'required|numeric|min:0',
            'total'                          => 'required|numeric|min:0',
            'coupon_code'                    => 'nullable|string',
            'notes'                          => 'nullable|string',
        ]);

        // Validate stock for each item
        foreach ($data['items'] as $item) {
            $product = \App\Models\Product::find($item['product_id']);
            if (!$product || $product->stock < $item['quantity']) {
                return response()->json([
                    'message' => "Insufficient stock for: {$item['product_name']}",
                ], 422);
            }
        }

        // Calculate subtotal from items (server-side verification)
        $subtotal = collect($data['items'])->sum(fn ($i) => $i['unit_price'] * $i['quantity']);

        // Apply discount
        $discountAmount = 0;
        $discountModel  = null;

        if (!empty($data['coupon_code'])) {
            $discountModel = Discount::where('code', strtoupper($data['coupon_code']))->first();

            if ($discountModel && $discountModel->isValid()) {
                $discountAmount = $discountModel->apply($subtotal);
            }
        }

        $shippingCost = $subtotal >= 5000 ? 0 : 50;
        $total        = $subtotal - $discountAmount + $shippingCost;

        $order = DB::transaction(function () use ($request, $data, $subtotal, $discountModel, $discountAmount, $shippingCost, $total) {
            // Create order with shipping_address as JSON
            $order = Order::create([
                'reference'        => '',
                'user_id'          => $request->user()->id,
                'status'           => 'pending',
                'subtotal'         => $subtotal,
                'discount_id'      => $discountModel?->id,
                'discount_amount'  => $discountAmount,
                'shipping_cost'    => $shippingCost,
                'tax'              => 0,
                'total'            => $total,
                'shipping_address' => $data['shipping_address'],
                'payment_method'   => $data['payment_method'],
                'payment_status'   => 'pending',
                'notes'            => $data['notes'] ?? null,
            ]);

            // Set reference DSK-XXXXX
            $order->update(['reference' => Order::generateReference($order->id)]);

            // Create order items + deduct stock
            foreach ($data['items'] as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item['product_id'],
                    'variant_id'   => null,
                    'product_name' => $item['product_name'],
                    'variant_info' => null,
                    'quantity'     => $item['quantity'],
                    'unit_price'   => $item['unit_price'],
                    'total'        => $item['unit_price'] * $item['quantity'],
                ]);

                \App\Models\Product::find($item['product_id'])->decrement('stock', $item['quantity']);
            }

            // Also save to shipping_addresses table for backwards compat
            $nameParts = explode(' ', $data['shipping_address']['full_name'], 2);
            ShippingAddress::create([
                'order_id'      => $order->id,
                'first_name'    => $nameParts[0],
                'last_name'     => $nameParts[1] ?? '',
                'email'         => $request->user()->email,
                'phone'         => $data['shipping_address']['phone'],
                'address_line1' => $data['shipping_address']['address_line1'],
                'address_line2' => null,
                'city'          => $data['shipping_address']['city'],
                'state'         => $data['shipping_address']['region'] ?? null,
                'country'       => 'Morocco',
                'postal_code'   => $data['shipping_address']['postal_code'] ?? null,
            ]);

            // Status history
            OrderStatusHistory::create([
                'order_id'   => $order->id,
                'status'     => 'pending',
                'note'       => 'Order placed successfully.',
                'changed_by' => $request->user()->id,
            ]);

            // Increment discount usage
            if ($discountModel) {
                $discountModel->increment('used_count');
                DiscountUsage::create([
                    'discount_id' => $discountModel->id,
                    'user_id'     => $request->user()->id,
                    'order_id'    => $order->id,
                ]);
            }

            // Clear server-side cart if it exists
            $cart = Cart::where('user_id', $request->user()->id)->first();
            if ($cart) {
                $cart->items()->delete();
            }

            return $order;
        });

        $order->load(['items', 'shippingAddress']);

        return new OrderResource($order);
    }

    // PATCH /api/admin/orders/{id}/status  — admin only
    public function updateStatus(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'required|in:pending,preparing,shipping,delivered,cancelled',
            'note'   => 'nullable|string',
        ]);

        $order->update(['status' => $data['status']]);

        OrderStatusHistory::create([
            'order_id'   => $order->id,
            'status'     => $data['status'],
            'note'       => $data['note'] ?? null,
            'changed_by' => $request->user()->id,
        ]);

        return new OrderResource($order->load(['items', 'shippingAddress', 'statusHistory']));
    }
}