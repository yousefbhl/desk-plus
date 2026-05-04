<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'reference'      => $this->reference,
            'status'         => $this->status,
            'subtotal'       => (float) $this->subtotal,
            'discount_amount'=> (float) $this->discount_amount,
            'shipping_cost'  => (float) $this->shipping_cost,
            'tax'            => (float) $this->tax,
            'total'          => (float) $this->total,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'notes'          => $this->notes,
            'user'           => $this->whenLoaded('user', fn () => $this->user ? [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'email' => $this->user->email,
            ] : null),
            'items'          => $this->whenLoaded('items', fn () =>
                $this->items->map(fn ($item) => [
                    'id'           => $item->id,
                    'product_id'   => $item->product_id,
                    'product_name' => $item->product_name,
                    'variant_info' => $item->variant_info,
                    'quantity'     => $item->quantity,
                    'unit_price'   => (float) $item->unit_price,
                    'total'        => (float) $item->total,
                ])
            ),
            'shipping_address' => $this->whenLoaded('shippingAddress'),
            'status_history'   => $this->whenLoaded('statusHistory', fn () =>
                $this->statusHistory->map(fn ($h) => [
                    'status'     => $h->status,
                    'note'       => $h->note,
                    'changed_by' => $h->changedBy?->name,
                    'created_at' => $h->created_at,
                ])
            ),
            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}