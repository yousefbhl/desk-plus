<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Discount;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // ── Resolve or create cart for current user/session ──────────
    private function resolveCart(Request $request): Cart
    {
        $userId    = $request->user()?->id;
        $sessionId = $request->header('X-Session-ID') ?? session()->getId();

        if ($userId) {
            $cart = Cart::firstOrCreate(['user_id' => $userId]);

            // Merge guest cart into user cart on login
            $guestCart = Cart::where('session_id', $sessionId)
                             ->whereNull('user_id')
                             ->first();

            if ($guestCart) {
                foreach ($guestCart->items as $guestItem) {
                    $existing = CartItem::where('cart_id', $cart->id)
                        ->where('product_id', $guestItem->product_id)
                        ->where('variant_id', $guestItem->variant_id)
                        ->first();

                    if ($existing) {
                        $existing->increment('quantity', $guestItem->quantity);
                    } else {
                        CartItem::create([
                            'cart_id'    => $cart->id,
                            'product_id' => $guestItem->product_id,
                            'variant_id' => $guestItem->variant_id,
                            'quantity'   => $guestItem->quantity,
                        ]);
                    }
                }
                $guestCart->delete();
            }

            return $cart;
        }

        return Cart::firstOrCreate(['session_id' => $sessionId]);
    }

    // GET /api/cart
    public function show(Request $request)
    {
        $cart = $this->resolveCart($request);
        $cart->load(['items.product.images', 'items.variant']);

        $items = $cart->items->map(fn ($item) => [
            'id'         => $item->id,
            'quantity'   => $item->quantity,
            'product'    => [
                'id'            => $item->product->id,
                'name'          => $item->product->name,
                'slug'          => $item->product->slug,
                'price'         => (float) $item->product->price,
                'compare_price' => $item->product->compare_price
                                    ? (float) $item->product->compare_price
                                    : null,
                'stock'         => $item->product->stock,
                'image'         => $item->product->images
                                    ->where('is_primary', true)
                                    ->first()?->url
                                    ?? $item->product->images->first()?->url,
            ],
            'variant'    => $item->variant ? [
                'id'             => $item->variant->id,
                'color'          => $item->variant->color,
                'color_hex'      => $item->variant->color_hex,
                'material'       => $item->variant->material,
                'price_modifier' => (float) $item->variant->price_modifier,
                'stock'          => $item->variant->stock,
            ] : null,
            'line_total' => round(
                ($item->product->price + ($item->variant?->price_modifier ?? 0))
                * $item->quantity, 2
            ),
        ]);

        $subtotal = $items->sum('line_total');

        // Apply stored coupon if present
        $discount      = null;
        $discountAmount = 0;

        if ($cart->coupon_code) {
            $discountModel = Discount::where('code', $cart->coupon_code)->first();
            if ($discountModel && $discountModel->isValid()) {
                $discountAmount = $discountModel->apply($subtotal);
                $discount = [
                    'code'   => $discountModel->code,
                    'type'   => $discountModel->type,
                    'value'  => (float) $discountModel->value,
                    'amount' => $discountAmount,
                ];
            } else {
                // Coupon expired — clear it
                $cart->update(['coupon_code' => null]);
            }
        }

        $shippingCost = $subtotal >= 5000 ? 0 : 50;
        $total        = $subtotal - $discountAmount + $shippingCost;

        return response()->json([
            'cart_id'       => $cart->id,
            'items'         => $items,
            'item_count'    => $items->sum('quantity'),
            'subtotal'      => round($subtotal, 2),
            'discount'      => $discount,
            'shipping_cost' => $shippingCost,
            'total'         => round($total, 2),
        ]);
    }

    // POST /api/cart/items
    public function addItem(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity'   => 'integer|min:1|max:99',
        ]);

        $data['quantity'] = $data['quantity'] ?? 1;

        // Stock check
        if ($data['variant_id']) {
            $variant = ProductVariant::findOrFail($data['variant_id']);
            if ($variant->stock < $data['quantity']) {
                return response()->json(['message' => 'Not enough stock for this variant.'], 422);
            }
        } else {
            $product = Product::findOrFail($data['product_id']);
            if ($product->stock < $data['quantity']) {
                return response()->json(['message' => 'Not enough stock.'], 422);
            }
        }

        $cart     = $this->resolveCart($request);
        $existing = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $data['product_id'])
            ->where('variant_id', $data['variant_id'])
            ->first();

        if ($existing) {
            $existing->increment('quantity', $data['quantity']);
        } else {
            CartItem::create([
                'cart_id'    => $cart->id,
                'product_id' => $data['product_id'],
                'variant_id' => $data['variant_id'] ?? null,
                'quantity'   => $data['quantity'],
            ]);
        }

        return $this->show($request);
    }

    // PATCH /api/cart/items/{id}
    public function updateItem(Request $request, CartItem $cartItem)
    {
        $data = $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        // Stock check
        $stock = $cartItem->variant
            ? $cartItem->variant->stock
            : $cartItem->product->stock;

        if ($stock < $data['quantity']) {
            return response()->json(['message' => 'Not enough stock.'], 422);
        }

        $cartItem->update(['quantity' => $data['quantity']]);

        return $this->show($request);
    }

    // DELETE /api/cart/items/{id}
    public function removeItem(Request $request, CartItem $cartItem)
    {
        $cartItem->delete();
        return $this->show($request);
    }

    // DELETE /api/cart
    public function clear(Request $request)
    {
        $cart = $this->resolveCart($request);
        $cart->items()->delete();
        $cart->update(['coupon_code' => null]);

        return response()->json(['message' => 'Cart cleared.']);
    }

    // POST /api/cart/coupon
    public function applyCoupon(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string',
        ]);

        $code     = strtoupper(trim($data['code']));
        $discount = Discount::where('code', $code)->first();

        if (!$discount || !$discount->isValid()) {
            return response()->json(['message' => 'Invalid or expired discount code.'], 422);
        }

        $cart = $this->resolveCart($request);
        $cart->update(['coupon_code' => $code]);

        return $this->show($request);
    }

    // DELETE /api/cart/coupon
    public function removeCoupon(Request $request)
    {
        $cart = $this->resolveCart($request);
        $cart->update(['coupon_code' => null]);
        return $this->show($request);
    }
}
