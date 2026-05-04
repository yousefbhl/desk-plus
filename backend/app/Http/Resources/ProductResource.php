<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'slug'          => $this->slug,
            'description'   => $this->description,
            'price'         => (float) $this->price,
            'compare_price' => $this->compare_price ? (float) $this->compare_price : null,
            // cost_price is NEVER included — hidden on model
            'sku'           => $this->sku,
            'stock'         => $this->stock,
            'in_stock'      => $this->in_stock,
            'is_featured'   => $this->is_featured,
            'is_active'     => $this->is_active,
            'avg_rating'    => (float) $this->avg_rating,
            'review_count'  => $this->review_count,
            'category'      => $this->whenLoaded('category', fn () => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'space'         => $this->whenLoaded('space', fn () => $this->space ? [
                'id'   => $this->space->id,
                'name' => $this->space->name,
                'slug' => $this->space->slug,
            ] : null),
            'taste'         => $this->whenLoaded('taste', fn () => $this->taste ? [
                'id'        => $this->taste->id,
                'name'      => $this->taste->name,
                'slug'      => $this->taste->slug,
                'color_hex' => $this->taste->color_hex,
            ] : null),
            'seller'        => $this->whenLoaded('seller', fn () => [
                'id'   => $this->seller->id,
                'name' => $this->seller->name,
            ]),
            'images'        => $this->whenLoaded('images', fn () =>
                $this->images->map(fn ($img) => [
                    'id'         => $img->id,
                    'url'        => $img->url,
                    'alt_text'   => $img->alt_text,
                    'is_primary' => $img->is_primary,
                    'sort_order' => $img->sort_order,
                ])
            ),
            'variants'      => $this->whenLoaded('variants', fn () =>
                $this->variants->map(fn ($v) => [
                    'id'             => $v->id,
                    'color'          => $v->color,
                    'color_hex'      => $v->color_hex,
                    'material'       => $v->material,
                    'price_modifier' => (float) $v->price_modifier,
                    'stock'          => $v->stock,
                    'sku_suffix'     => $v->sku_suffix,
                ])
            ),
            'specifications' => $this->whenLoaded('specifications', fn () =>
                $this->specifications->map(fn ($s) => [
                    'key'        => $s->key,
                    'value'      => $s->value,
                    'sort_order' => $s->sort_order,
                ])
            ),
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
        ];
    }
}