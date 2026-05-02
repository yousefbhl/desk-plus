<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with(['category', 'space', 'taste'])
            ->filter($request)
            ->latest()
            ->paginate(12);

        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request): ProductResource
    {
        $product = Product::create([
            ...$request->validated(),
            'seller_id' => $request->user()->id,
        ]);

        return new ProductResource($product->load(['category', 'space', 'taste']));
    }

    public function show(Product $product): ProductResource
    {
        return new ProductResource($product->load(['category', 'space', 'taste']));
    }

    public function update(StoreProductRequest $request, Product $product): ProductResource
    {
        $product->update($request->validated());

        return new ProductResource($product->load(['category', 'space', 'taste']));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }
}
