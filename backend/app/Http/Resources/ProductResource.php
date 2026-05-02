<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'images' => [],
            'category' => $this->category?->name,
            'space' => $this->space?->name,
            'taste' => $this->taste?->name,
            'in_stock' => $this->stock > 0,
        ];
    }
}
