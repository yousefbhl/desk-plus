<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // GET /api/products
    public function index(Request $request)
    {
        $products = Product::with(['category', 'space', 'taste', 'images', 'variants'])
            ->active()
            ->filter($request)
            ->paginate($request->get('per_page', 12));

        return ProductResource::collection($products);
    }

    // GET /api/products/{slug}
    public function show(string $slug)
    {
        $product = Product::with([
            'category', 'space', 'taste', 'seller',
            'images', 'variants', 'specifications',
            'reviews' => fn ($q) => $q->with('user')->latest()->limit(10),
        ])->where('slug', $slug)->active()->firstOrFail();

        return new ProductResource($product);
    }

    // GET /api/products/featured
    public function featured()
    {
        $products = Product::with(['category', 'images'])
            ->active()
            ->where('is_featured', true)
            ->latest()
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    // GET /api/products/new-arrivals
    public function newArrivals()
    {
        $products = Product::with(['category', 'images', 'variants'])
            ->active()
            ->latest()
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    // POST /api/admin/products  (admin only)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:200',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost_price'    => 'nullable|numeric|min:0',
            'sku'           => 'nullable|string|max:100|unique:products,sku',
            'stock'         => 'required|integer|min:0',
            'category_id'   => 'required|exists:categories,id',
            'space_id'      => 'nullable|exists:spaces,id',
            'taste_id'      => 'nullable|exists:tastes,id',
            'is_featured'   => 'boolean',
            'is_active'     => 'boolean',
        ]);

        $data['slug']      = Str::slug($data['name']) . '-' . Str::random(5);
        $data['seller_id'] = $request->user()->id;

        $product = Product::create($data);

        return new ProductResource($product->load(['category', 'space', 'taste', 'images']));
    }

    // PUT /api/admin/products/{id}  (admin only)
    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'          => 'sometimes|string|max:200',
            'description'   => 'nullable|string',
            'price'         => 'sometimes|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'cost_price'    => 'nullable|numeric|min:0',
            'sku'           => 'nullable|string|max:100|unique:products,sku,' . $product->id,
            'stock'         => 'sometimes|integer|min:0',
            'category_id'   => 'sometimes|exists:categories,id',
            'space_id'      => 'nullable|exists:spaces,id',
            'taste_id'      => 'nullable|exists:tastes,id',
            'is_featured'   => 'boolean',
            'is_active'     => 'boolean',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . Str::random(5);
        }

        $product->update($data);

        return new ProductResource($product->load(['category', 'space', 'taste', 'images', 'variants']));
    }

    // DELETE /api/admin/products/{id}  (admin only)
    public function destroy(Product $product)
    {
        $product->delete(); // soft delete
        return response()->json(['message' => 'Product deleted successfully.']);
    }
}