<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SellerController;
use App\Http\Controllers\Api\SpaceController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('products', ProductController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('spaces', SpaceController::class);

    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);

    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
    });

    Route::middleware('role:seller')->prefix('seller')->group(function () {
        Route::get('/stats', [SellerController::class, 'stats']);
        Route::get('/products', [SellerController::class, 'products']);
    });
});
