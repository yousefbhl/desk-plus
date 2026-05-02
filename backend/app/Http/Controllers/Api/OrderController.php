<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['items.product', 'user'])->latest();

        if (! $request->user()->hasRole('admin')) {
            $query->where('user_id', $request->user()->id);
        }

        return OrderResource::collection($query->paginate(10));
    }

    public function store(Request $request): OrderResource
    {
        $data = $request->validate([
            'total' => ['required', 'numeric', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
        ]);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'status' => 'pending',
            'total' => $data['total'],
        ]);

        foreach ($data['items'] as $item) {
            $order->items()->create($item);
        }

        return new OrderResource($order->load(['items.product', 'user']));
    }

    public function show(Order $order): OrderResource
    {
        return new OrderResource($order->load(['items.product', 'user']));
    }

    public function update(UpdateOrderRequest $request, Order $order): OrderResource
    {
        $order->update($request->validated());

        return new OrderResource($order->load(['items.product', 'user']));
    }

    public function updateStatus(Order $order, UpdateOrderRequest $request): OrderResource
    {
        $order->update($request->validated());

        return new OrderResource($order->load(['items.product', 'user']));
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->noContent();
    }
}
