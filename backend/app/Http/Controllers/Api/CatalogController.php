<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Space;
use App\Models\Taste;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CatalogController extends Controller
{
    // ── CATEGORIES ───────────────────────────────────────────────

    // GET /api/categories
    public function categories()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($cat) => [
                'id'          => $cat->id,
                'name'        => $cat->name,
                'slug'        => $cat->slug,
                'description' => $cat->description,
                'image'       => $cat->image,
                'children'    => $cat->children->where('is_active', true)->values()->map(fn ($c) => [
                    'id'   => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                ]),
            ]);

        return response()->json($categories);
    }

    // POST /api/admin/categories
    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
            'parent_id'   => 'nullable|exists:categories,id',
            'sort_order'  => 'integer',
            'is_active'   => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    // PUT /api/admin/categories/{id}
    public function updateCategory(Request $request, Category $category)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'image'       => 'nullable|string',
            'parent_id'   => 'nullable|exists:categories,id',
            'sort_order'  => 'integer',
            'is_active'   => 'boolean',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        return response()->json($category);
    }

    // DELETE /api/admin/categories/{id}
    public function destroyCategory(Category $category)
    {
        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with active products.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }

    // ── SPACES ───────────────────────────────────────────────────

    // GET /api/spaces
    public function spaces(Request $request)
    {
        $query = Space::where('is_active', true);

        if ($request->featured) {
            $query->where('is_featured', true);
        }

        $spaces = $query->orderByDesc('is_featured')->get()->map(fn ($s) => [
            'id'          => $s->id,
            'name'        => $s->name,
            'slug'        => $s->slug,
            'description' => $s->description,
            'cover_image' => $s->cover_image,
            'layout_type' => $s->layout_type,
            'total_price' => $s->total_price ? (float) $s->total_price : null,
            'is_featured' => $s->is_featured,
        ]);

        return response()->json($spaces);
    }

    // GET /api/spaces/{slug}
    public function showSpace(string $slug)
    {
        $space = Space::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Load products in this space
        $products = $space->products()
            ->with(['images', 'variants', 'category'])
            ->active()
            ->get();

        return response()->json([
            'id'          => $space->id,
            'name'        => $space->name,
            'slug'        => $space->slug,
            'description' => $space->description,
            'cover_image' => $space->cover_image,
            'layout_type' => $space->layout_type,
            'total_price' => $space->total_price ? (float) $space->total_price : null,
            'is_featured' => $space->is_featured,
            'products'    => $products->map(fn ($p) => [
                'id'    => $p->id,
                'name'  => $p->name,
                'slug'  => $p->slug,
                'price' => (float) $p->price,
                'image' => $p->images->where('is_primary', true)->first()?->url
                           ?? $p->images->first()?->url,
                'category' => $p->category->name,
            ]),
        ]);
    }

    // POST /api/admin/spaces
    public function storeSpace(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100|unique:spaces,name',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'layout_type' => 'nullable|in:u-shape,l-shape,plus-shape,call-center,open,other',
            'total_price' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
            'is_active'   => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $space = Space::create($data);

        return response()->json($space, 201);
    }

    // PUT /api/admin/spaces/{id}
    public function updateSpace(Request $request, Space $space)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'layout_type' => 'nullable|in:u-shape,l-shape,plus-shape,call-center,open,other',
            'total_price' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean',
            'is_active'   => 'boolean',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $space->update($data);

        return response()->json($space);
    }

    // ── TASTES ───────────────────────────────────────────────────

    // GET /api/tastes
    public function tastes()
    {
        $tastes = Taste::where('is_active', true)
            ->get()
            ->map(fn ($t) => [
                'id'          => $t->id,
                'name'        => $t->name,
                'slug'        => $t->slug,
                'description' => $t->description,
                'icon'        => $t->icon,
                'color_hex'   => $t->color_hex,
            ]);

        return response()->json($tastes);
    }

    // POST /api/admin/tastes
    public function storeTaste(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:100|unique:tastes,name',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string',
            'color_hex'   => 'nullable|string|max:7',
            'is_active'   => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);

        $taste = Taste::create($data);

        return response()->json($taste, 201);
    }

    // PUT /api/admin/tastes/{id}
    public function updateTaste(Request $request, Taste $taste)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string',
            'color_hex'   => 'nullable|string|max:7',
            'is_active'   => 'boolean',
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $taste->update($data);

        return response()->json($taste);
    }
}
