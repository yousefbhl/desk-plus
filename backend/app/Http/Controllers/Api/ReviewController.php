<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // GET /api/products/{slug}/reviews
    public function index(string $slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $reviews = $product->reviews()
            ->with('user:id,name,avatar')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    // POST /api/products/{slug}/reviews
    public function store(Request $request, string $slug)
    {
        $product = Product::where('slug', $slug)->active()->firstOrFail();

        // One review per user per product
        $exists = Review::where('product_id', $product->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'You have already reviewed this product.',
            ], 422);
        }

        $data = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'title'   => 'nullable|string|max:150',
            'comment' => 'nullable|string|max:2000',
        ]);

        Review::create([
            ...$data,
            'product_id'  => $product->id,
            'user_id'     => $request->user()->id,
            'is_approved' => false, // admin must approve
        ]);

        return response()->json([
            'message' => 'Review submitted and pending approval.',
        ], 201);
    }

    // DELETE /api/reviews/{id}  — user deletes own review
    public function destroy(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            abort(403, 'Forbidden.');
        }

        $product = $review->product;
        $review->delete();
        $product->refreshRating();

        return response()->json(['message' => 'Review deleted.']);
    }
}
