<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\DiscountController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Desk+
|--------------------------------------------------------------------------
|
| Groups:
|   Public          — no auth required
|   Auth required   — middleware: auth:sanctum
|   Admin only      — middleware: auth:sanctum + check role=admin in controller
|
*/

// ── PUBLIC ───────────────────────────────────────────────────────────────────

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Catalog lookups — used by filters & dropdowns
Route::get('/categories', [CatalogController::class, 'categories']);
Route::get('/spaces',     [CatalogController::class, 'spaces']);
Route::get('/spaces/{slug}', [CatalogController::class, 'showSpace']);
Route::get('/tastes',     [CatalogController::class, 'tastes']);

// Products — public browsing
Route::get('/products',              [ProductController::class, 'index']);
Route::get('/products/featured',     [ProductController::class, 'featured']);
Route::get('/products/new-arrivals', [ProductController::class, 'newArrivals']);
Route::get('/products/{slug}',       [ProductController::class, 'show']);

// Product reviews — read
Route::get('/products/{slug}/reviews', [ReviewController::class, 'index']);

// Discount validation — public (used in cart before auth)
Route::post('/discounts/validate', [DiscountController::class, 'validate']);
Route::get('/settings', [AdminController::class, 'settings']);

// ── AUTHENTICATED ─────────────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/me',     [AuthController::class, 'me']);
    Route::post('/logout',[AuthController::class, 'logout']);

    // Wishlist
    Route::get('/me/wishlist',               [WishlistController::class, 'index']);
    Route::post('/me/wishlist/{product}',    [WishlistController::class, 'toggle']);

    // Cart
    Route::get('/cart',                      [CartController::class, 'show']);
    Route::post('/cart/items',               [CartController::class, 'addItem']);
    Route::patch('/cart/items/{cartItem}',   [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{cartItem}',  [CartController::class, 'removeItem']);
    Route::delete('/cart',                   [CartController::class, 'clear']);
    Route::post('/cart/coupon',              [CartController::class, 'applyCoupon']);
    Route::delete('/cart/coupon',            [CartController::class, 'removeCoupon']);

    // Orders — customer
    Route::get('/orders',        [OrderController::class, 'index']);
    Route::get('/orders/{order}',[OrderController::class, 'show']);
    Route::post('/orders',       [OrderController::class, 'store']);

    // Reviews — write
    Route::post('/products/{slug}/reviews',   [ReviewController::class, 'store']);
    Route::delete('/reviews/{review}',        [ReviewController::class, 'destroy']);

    // ── ADMIN ONLY ────────────────────────────────────────────────
    // All routes below check role=admin inside the controller
    // For extra safety add a middleware: Route::middleware(['auth:sanctum','role:admin'])
    // after installing spatie and seeding the 'admin' role

    Route::prefix('admin')->group(function () {

        // Dashboard stats — CEO view
        Route::get('/stats',   [AdminController::class, 'stats']);
        Route::get('/settings',                       [AdminController::class, 'settings']);
        Route::put('/settings',                       [AdminController::class, 'updateSettings']);

        // Orders management
        Route::get('/orders',                         [AdminController::class, 'orders']);
        Route::patch('/orders/{order}/status',        [OrderController::class, 'updateStatus']);

        // Users management
        Route::get('/users',                          [AdminController::class, 'users']);
        Route::put('/users/{user}/role',              [AdminController::class, 'updateUserRole']);
        Route::delete('/users/{user}',                [AdminController::class, 'deleteUser']);

        // Products management
        Route::get('/products',                       [AdminController::class, 'products']);
        Route::post('/products',                      [ProductController::class, 'store']);
        Route::put('/products/{product}',             [ProductController::class, 'update']);
        Route::delete('/products/{product}',          [ProductController::class, 'destroy']);

        // Sellers management
        Route::get('/sellers',                        [AdminController::class, 'sellers']);

        // Categories management
        Route::post('/categories',                    [CatalogController::class, 'storeCategory']);
        Route::put('/categories/{category}',          [CatalogController::class, 'updateCategory']);
        Route::delete('/categories/{category}',       [CatalogController::class, 'destroyCategory']);

        // Spaces management
        Route::post('/spaces',                        [CatalogController::class, 'storeSpace']);
        Route::put('/spaces/{space}',                 [CatalogController::class, 'updateSpace']);

        // Tastes management
        Route::post('/tastes',                        [CatalogController::class, 'storeTaste']);
        Route::put('/tastes/{taste}',                 [CatalogController::class, 'updateTaste']);

        // Discounts management
        Route::get('/discounts',                      [DiscountController::class, 'index']);
        Route::post('/discounts',                     [DiscountController::class, 'store']);
        Route::put('/discounts/{discount}',           [DiscountController::class, 'update']);
        Route::delete('/discounts/{discount}',        [DiscountController::class, 'destroy']);

        // Reports export
        Route::get('/reports/export',                 [AdminController::class, 'exportReport']);

        // Reviews moderation
        Route::get('/reviews',                        [AdminController::class, 'reviews']);
        Route::patch('/reviews/{review}/approve',     [AdminController::class, 'approveReview']);
        Route::delete('/reviews/{review}',            [AdminController::class, 'deleteReview']);
    });
});
