<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Discount;
use App\Models\DiscountUsage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DiscountController extends Controller
{
    // GET /api/admin/discounts
    public function index(Request $request)
    {
        $discounts = Discount::withCount('usages')
            ->when($request->search, fn ($q) =>
                $q->where('code', 'like', "%{$request->search}%")
            )
            ->when($request->is_active !== null, fn ($q) =>
                $q->where('is_active', (bool) $request->is_active)
            )
            ->latest()
            ->paginate(20);

        return response()->json($discounts);
    }

    // POST /api/admin/discounts
    public function store(Request $request)
    {
        $data = $request->validate([
            'code'           => 'nullable|string|max:50|unique:discounts,code',
            'description'    => 'nullable|string|max:255',
            'type'           => 'required|in:percentage,fixed',
            'value'          => 'required|numeric|min:0.01',
            'min_order'      => 'nullable|numeric|min:0',
            'max_uses'       => 'nullable|integer|min:1',
            'per_user_limit' => 'nullable|integer|min:1',
            'starts_at'      => 'nullable|date',
            'expires_at'     => 'nullable|date|after_or_equal:starts_at',
            'is_active'      => 'boolean',
        ]);

        // Auto-generate code if not provided
        if (empty($data['code'])) {
            do {
                $data['code'] = strtoupper(Str::random(8));
            } while (Discount::where('code', $data['code'])->exists());
        } else {
            $data['code'] = strtoupper(trim($data['code']));
        }

        $discount = Discount::create($data);

        return response()->json($discount, 201);
    }

    // PUT /api/admin/discounts/{id}
    public function update(Request $request, Discount $discount)
    {
        $data = $request->validate([
            'description'    => 'nullable|string|max:255',
            'type'           => 'sometimes|in:percentage,fixed',
            'value'          => 'sometimes|numeric|min:0.01',
            'min_order'      => 'nullable|numeric|min:0',
            'max_uses'       => 'nullable|integer|min:1',
            'per_user_limit' => 'nullable|integer|min:1',
            'starts_at'      => 'nullable|date',
            'expires_at'     => 'nullable|date',
            'is_active'      => 'boolean',
        ]);

        $discount->update($data);

        return response()->json($discount);
    }

    // DELETE /api/admin/discounts/{id}
    public function destroy(Discount $discount)
    {
        $discount->delete();
        return response()->json(['message' => 'Discount deleted.']);
    }

    // POST /api/cart/coupon/validate  — public, check if code is valid before applying
    public function validate(Request $request)
    {
        $request->validate([
            'code'     => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $code     = strtoupper(trim($request->code));
        $discount = Discount::where('code', $code)->first();

        if (!$discount || !$discount->isValid()) {
            return response()->json([
                'valid'   => false,
                'message' => 'Invalid or expired discount code.',
            ], 422);
        }

        if ($request->subtotal < $discount->min_order) {
            return response()->json([
                'valid'   => false,
                'message' => "Minimum order of " . number_format($discount->min_order, 2) . " MAD required.",
            ], 422);
        }

        // Check per-user limit if authenticated
        if ($request->user() && $discount->per_user_limit) {
            $used = DiscountUsage::where('discount_id', $discount->id)
                ->where('user_id', $request->user()->id)
                ->count();

            if ($used >= $discount->per_user_limit) {
                return response()->json([
                    'valid'   => false,
                    'message' => 'You have already used this code the maximum number of times.',
                ], 422);
            }
        }

        $amount = $discount->apply((float) $request->subtotal);

        return response()->json([
            'valid'       => true,
            'code'        => $discount->code,
            'type'        => $discount->type,
            'value'       => (float) $discount->value,
            'amount'      => $amount,
            'description' => $discount->description,
        ]);
    }
}
