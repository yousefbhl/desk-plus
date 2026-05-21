<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Space;
use App\Models\Taste;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::firstOrCreate(
            ['email' => 'seller@desk.plus'],
            [
                'name' => 'Demo Seller',
                'password' => Hash::make('password'),
                'role' => 'seller',
            ]
        );
        $seller->syncRoles(['seller']);

        $category = Category::firstOrCreate(['name' => 'Coffee']);
        $space = Space::firstOrCreate(['name' => 'Office']);
        $taste = Taste::firstOrCreate(['name' => 'Bold']);

        Product::firstOrCreate(
            ['name' => 'Desk+ Signature Beans'],
            [
                'description' => 'Balanced roast for all-day work sessions.',
                'price' => 19.99,
                'stock' => 120,
                'category_id' => $category->id,
                'space_id' => $space->id,
                'taste_id' => $taste->id,
                'seller_id' => $seller->id,
            ]
        );
    }
}
