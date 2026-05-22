<?php

namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'email'           => $this->email,
            'role'            => $this->role,
            'avatar'          => $this->avatar,
            'phone'           => $this->phone,
            'orders_count'    => $this->when(isset($this->orders_count), $this->orders_count),
            'products_count'  => $this->when(isset($this->products_count), $this->products_count),
            'created_at'      => $this->created_at,
            'updated_at'      => $this->updated_at,
        ];
    }
}
