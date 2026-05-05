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
            'shipping.first_name'   => 'required|string|max:80',
            'shipping.last_name'    => 'required|string|max:80',
            'shipping.email'        => 'required|email',
            'shipping.phone'        => 'required|string|max:20',
            'shipping.address_line1'=> 'required|string',
            'shipping.address_line2'=> 'nullable|string',
            'shipping.city'         => 'required|string',
            'shipping.state'        => 'nullable|string',
            'shipping.country'      => 'required|string',
            'shipping.postal_code'  => 'nullable|string',
            'payment_method'        => 'required|in:card,cash,bank_transfer',
            'coupon_code'           => 'nullable|string',
            'notes'                 => 'nullable|string',
        ]);

        // Resolve cart
        $cart = Cart::with('items.product')
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'Cart is empty.'], 422);
        }

        // Validate stock & calculate subtotal
        $subtotal = 0;
        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'message' => "Insufficient stock for: {$item->product->name}",
                ], 422);
            }
            $subtotal += $item->product->price * $item->quantity;
        }

        // Apply discount
        $discountAmount = 0;
        $discountModel  = null;

        if (!empty($data['coupon_code'])) {
            $discountModel = Discount::where('code', strtoupper($data['coupon_code']))->first();

            if (!$discountModel || !$discountModel->isValid()) {
                return response()->json(['message' => 'Invalid or expired discount code.'], 422);
            }

            // Check per-user limit
            if ($discountModel->per_user_limit) {
                $timesUsed = DiscountUsage::where('discount_id', $discountModel->id)
                    ->where('user_id', $request->user()->id)
                    ->count();

                if ($timesUsed >= $discountModel->per_user_limit) {
                    return response()->json(['message' => 'You have already used this discount code.'], 422);
                }
            }

            $discountAmount = $discountModel->apply($subtotal);
        }

        $shippingCost = $subtotal >= 5000 ? 0 : 50; // free shipping over 5000 MAD
        $total        = $subtotal - $discountAmount + $shippingCost;

        DB::transaction(function () use (
            $request, $data, $cart, $subtotal,
            $discountModel, $discountAmount, $shippingCost, $total
        ) {
            // Create order
            $order = Order::create([
                'reference'       => '',  // filled by observer
                'user_id'         => $request->user()->id,
                'status'          => 'pending',
                'subtotal'        => $subtotal,
                'discount_id'     => $discountModel?->id,
                'discount_amount' => $discountAmount,
                'shipping_cost'   => $shippingCost,
                'tax'             => 0,
                'total'           => $total,
                'payment_method'  => $data['payment_method'],
                'payment_status'  => 'pending',
                'notes'           => $data['notes'] ?? null,
            ]);

            // Set reference DSK-XXXXX
            $order->update(['reference' => Order::generateReference($order->id)]);

            // Create order items + deduct stock
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $item->product_id,
                    'variant_id'   => $item->variant_id,
                    'product_name' => $item->product->name,
                    'variant_info' => $item->variant
                        ? "{$item->variant->color} / {$item->variant->material}"
                        : null,
                    'quantity'     => $item->quantity,
                    'unit_price'   => $item->product->price,
                    'total'        => $item->product->price * $item->quantity,
                ]);

                $item->product->decrement('stock', $item->quantity);
            }

            // Shipping address
            ShippingAddress::create([
                'order_id' => $order->id,
                ...$data['shipping'],
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

            // Clear cart
            $cart->items()->delete();
        });

        $placed = Order::with(['items', 'shippingAddress'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->first();

        return new OrderResource($placed);
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