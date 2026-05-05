<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductSpecification;
use App\Models\ProductVariant;
use App\Models\Space;
use App\Models\Taste;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. USERS ─────────────────────────────────────────────
        $admin = User::firstOrCreate(
            ['email' => 'admin@deskplus.ma'],
            [
                'name'     => 'Admin CEO',
                'password' => bcrypt('Admin@DeskPlus2025!'),
                'role'     => 'admin',
            ]
        );

        $seller1 = User::firstOrCreate(
            ['email' => 'seller1@deskplus.ma'],
            [
                'name'     => 'Ahmed Seller',
                'password' => bcrypt('Seller@123'),
                'role'     => 'seller',
            ]
        );

        $seller2 = User::firstOrCreate(
            ['email' => 'seller2@deskplus.ma'],
            [
                'name'     => 'Sara Seller',
                'password' => bcrypt('Seller@123'),
                'role'     => 'seller',
            ]
        );

        $customer = User::firstOrCreate(
            ['email' => 'customer@deskplus.ma'],
            [
                'name'     => 'Test Customer',
                'password' => bcrypt('Customer@123'),
                'role'     => 'customer',
            ]
        );

        // ── 2. CATEGORIES ─────────────────────────────────────────
        $categories = [
            ['name' => 'Chairs',       'slug' => 'chairs',       'sort_order' => 1],
            ['name' => 'Desks',        'slug' => 'desks',        'sort_order' => 2],
            ['name' => 'Tables',       'slug' => 'tables',       'sort_order' => 3],
            ['name' => 'Storage',      'slug' => 'storage',      'sort_order' => 4],
            ['name' => 'Accessories',  'slug' => 'accessories',  'sort_order' => 5],
            ['name' => 'Partitions',   'slug' => 'partitions',   'sort_order' => 6],
        ];

        $catMap = [];
        foreach ($categories as $cat) {
            $catMap[$cat['slug']] = Category::firstOrCreate(
                ['slug' => $cat['slug']],
                [...$cat, 'is_active' => true]
            );
        }

        // ── 3. SPACES ─────────────────────────────────────────────
        $spaces = [
            ['name' => 'Dev Space',      'slug' => 'dev-space',      'layout_type' => 'l-shape',      'is_featured' => true,  'description' => 'Modern tech-focused workspace for developers'],
            ['name' => 'Art Space',      'slug' => 'art-space',      'layout_type' => 'open',          'is_featured' => true,  'description' => 'Creative open workspace for designers'],
            ['name' => 'Wood Modern',    'slug' => 'wood-modern',    'layout_type' => 'open',          'is_featured' => true,  'description' => 'Natural materials and warm tones'],
            ['name' => 'School Space',   'slug' => 'school-space',   'layout_type' => 'other',         'is_featured' => false, 'description' => 'Academic setups for schools and universities'],
            ['name' => 'Doctor Space',   'slug' => 'doctor-space',   'layout_type' => 'other',         'is_featured' => false, 'description' => 'Clean and minimal medical office setup'],
            ['name' => 'Commerce Space', 'slug' => 'commerce-space', 'layout_type' => 'other',         'is_featured' => false, 'description' => 'Retail and commercial counter configurations'],
            ['name' => 'Call Center',    'slug' => 'call-center',    'layout_type' => 'call-center',   'is_featured' => false, 'description' => 'High-density modular call center layout'],
            ['name' => 'Executive',      'slug' => 'executive',      'layout_type' => 'u-shape',       'is_featured' => false, 'description' => 'Premium executive office with U-shape desk'],
        ];

        $spaceMap = [];
        foreach ($spaces as $s) {
            $spaceMap[$s['slug']] = Space::firstOrCreate(
                ['slug' => $s['slug']],
                [...$s, 'is_active' => true]
            );
        }

        // ── 4. TASTES ─────────────────────────────────────────────
        $tastes = [
            ['name' => 'Kendo',    'slug' => 'kendo',    'color_hex' => '#E63329', 'description' => 'Bold and energetic modern-mood style'],
            ['name' => 'Woody',    'slug' => 'woody',    'color_hex' => '#A0522D', 'description' => 'Warm natural wood textures and earth tones'],
            ['name' => 'Hacker',   'slug' => 'hacker',   'color_hex' => '#1A1A1A', 'description' => 'Dark minimal tech aesthetic'],
            ['name' => 'Coco',     'slug' => 'coco',     'color_hex' => '#D2B48C', 'description' => 'Soft neutrals and elegant simplicity'],
            ['name' => 'White',    'slug' => 'white',    'color_hex' => '#F8F8F8', 'description' => 'Clean all-white minimal office'],
            ['name' => 'Economie', 'slug' => 'economie', 'color_hex' => '#6B6B6B', 'description' => 'Budget-conscious practical setups'],
        ];

        $tasteMap = [];
        foreach ($tastes as $t) {
            $tasteMap[$t['slug']] = Taste::firstOrCreate(
                ['slug' => $t['slug']],
                [...$t, 'is_active' => true]
            );
        }

        // ── 5. SAMPLE PRODUCTS ────────────────────────────────────
        $products = [
            [
                'name'          => 'ErgoMax Pro Chair',
                'price'         => 2990.00,
                'compare_price' => 3500.00,
                'stock'         => 30,
                'category'      => 'chairs',
                'space'         => 'dev-space',
                'taste'         => 'hacker',
                'is_featured'   => true,
                'description'   => 'Premium ergonomic office chair with lumbar support and adjustable armrests.',
                'specs' => [
                    ['key' => 'Dimensions',   'value' => '70×70×115 cm'],
                    ['key' => 'Weight',       'value' => '14 kg'],
                    ['key' => 'Max Load',     'value' => '150 kg'],
                    ['key' => 'Material',     'value' => 'Mesh + Aluminum'],
                    ['key' => 'Adjustable',   'value' => 'Height, Armrest, Lumbar'],
                ],
                'variants' => [
                    ['color' => 'Black',   'color_hex' => '#1A1A1A', 'material' => 'Mesh',    'price_modifier' => 0,   'stock' => 15],
                    ['color' => 'Gray',    'color_hex' => '#6B6B6B', 'material' => 'Mesh',    'price_modifier' => 0,   'stock' => 10],
                    ['color' => 'White',   'color_hex' => '#F8F8F8', 'material' => 'Fabric',  'price_modifier' => 200, 'stock' => 5],
                ],
            ],
            [
                'name'          => 'L-Shape Developer Desk',
                'price'         => 4500.00,
                'compare_price' => 5200.00,
                'stock'         => 15,
                'category'      => 'desks',
                'space'         => 'dev-space',
                'taste'         => 'hacker',
                'is_featured'   => true,
                'description'   => 'Large L-shaped desk designed for dual monitor setups and full developer workflow.',
                'specs' => [
                    ['key' => 'Dimensions',   'value' => '160×120×75 cm'],
                    ['key' => 'Weight',       'value' => '45 kg'],
                    ['key' => 'Material',     'value' => 'MDF + Steel'],
                    ['key' => 'Max Load',     'value' => '80 kg'],
                    ['key' => 'Cable holes',  'value' => '2 built-in'],
                ],
                'variants' => [
                    ['color' => 'Black', 'color_hex' => '#1A1A1A', 'material' => 'MDF',    'price_modifier' => 0,   'stock' => 8],
                    ['color' => 'Oak',   'color_hex' => '#A0522D', 'material' => 'Oak',    'price_modifier' => 500, 'stock' => 4],
                    ['color' => 'White', 'color_hex' => '#FFFFFF', 'material' => 'MDF',    'price_modifier' => 0,   'stock' => 3],
                ],
            ],
            [
                'name'          => 'Woody Standing Desk',
                'price'         => 6800.00,
                'compare_price' => null,
                'stock'         => 10,
                'category'      => 'desks',
                'space'         => 'wood-modern',
                'taste'         => 'woody',
                'is_featured'   => true,
                'description'   => 'Electric height-adjustable standing desk with solid oak top.',
                'specs' => [
                    ['key' => 'Dimensions',       'value' => '140×70 cm'],
                    ['key' => 'Height range',     'value' => '62–128 cm'],
                    ['key' => 'Motor',            'value' => 'Dual electric motor'],
                    ['key' => 'Material',         'value' => 'Solid Oak + Steel'],
                    ['key' => 'Memory presets',   'value' => '4 positions'],
                ],
                'variants' => [
                    ['color' => 'Natural Oak', 'color_hex' => '#C19A6B', 'material' => 'Oak',    'price_modifier' => 0,    'stock' => 6],
                    ['color' => 'Dark Walnut', 'color_hex' => '#5C4033', 'material' => 'Walnut', 'price_modifier' => 800,  'stock' => 4],
                ],
            ],
            [
                'name'          => 'Kendo Executive Chair',
                'price'         => 3800.00,
                'compare_price' => 4200.00,
                'stock'         => 20,
                'category'      => 'chairs',
                'space'         => 'executive',
                'taste'         => 'kendo',
                'is_featured'   => false,
                'description'   => 'Bold executive chair with high back and premium leather finish.',
                'specs' => [
                    ['key' => 'Dimensions',   'value' => '68×68×130 cm'],
                    ['key' => 'Material',     'value' => 'Premium PU Leather'],
                    ['key' => 'Armrests',     'value' => '4D adjustable'],
                    ['key' => 'Base',         'value' => 'Polished aluminum'],
                    ['key' => 'Max Load',     'value' => '160 kg'],
                ],
                'variants' => [
                    ['color' => 'Black',     'color_hex' => '#1A1A1A', 'material' => 'PU Leather', 'price_modifier' => 0,    'stock' => 12],
                    ['color' => 'Dark Red',  'color_hex' => '#8B0000', 'material' => 'PU Leather', 'price_modifier' => 300,  'stock' => 5],
                    ['color' => 'White',     'color_hex' => '#F8F8F8', 'material' => 'PU Leather', 'price_modifier' => 300,  'stock' => 3],
                ],
            ],
            [
                'name'          => 'Art Studio Creative Table',
                'price'         => 2200.00,
                'compare_price' => null,
                'stock'         => 25,
                'category'      => 'tables',
                'space'         => 'art-space',
                'taste'         => 'coco',
                'is_featured'   => false,
                'description'   => 'Wide creative worktable ideal for art studios and open creative spaces.',
                'specs' => [
                    ['key' => 'Dimensions',   'value' => '180×90×75 cm'],
                    ['key' => 'Material',     'value' => 'Bamboo + Steel'],
                    ['key' => 'Weight',       'value' => '32 kg'],
                    ['key' => 'Max Load',     'value' => '120 kg'],
                ],
                'variants' => [
                    ['color' => 'Natural', 'color_hex' => '#D2B48C', 'material' => 'Bamboo', 'price_modifier' => 0,   'stock' => 15],
                    ['color' => 'White',   'color_hex' => '#FFFFFF', 'material' => 'MDF',    'price_modifier' => -200,'stock' => 10],
                ],
            ],
            [
                'name'          => 'Modular Storage Cabinet',
                'price'         => 1800.00,
                'compare_price' => 2100.00,
                'stock'         => 40,
                'category'      => 'storage',
                'space'         => null,
                'taste'         => 'white',
                'is_featured'   => false,
                'description'   => 'Modular 3-door storage cabinet for any office environment.',
                'specs' => [
                    ['key' => 'Dimensions',   'value' => '90×40×120 cm'],
                    ['key' => 'Material',     'value' => 'MDF + Metal handles'],
                    ['key' => 'Doors',        'value' => '3 soft-close'],
                    ['key' => 'Weight',       'value' => '28 kg'],
                ],
                'variants' => [
                    ['color' => 'White',  'color_hex' => '#FFFFFF', 'material' => 'MDF', 'price_modifier' => 0,    'stock' => 20],
                    ['color' => 'Beige',  'color_hex' => '#F5F5DC', 'material' => 'MDF', 'price_modifier' => 0,    'stock' => 12],
                    ['color' => 'Black',  'color_hex' => '#1A1A1A', 'material' => 'MDF', 'price_modifier' => 100,  'stock' => 8],
                ],
            ],
            [
                'name'          => 'Dual Monitor Desk Mount',
                'price'         => 850.00,
                'compare_price' => null,
                'stock'         => 60,
                'category'      => 'accessories',
                'space'         => 'dev-space',
                'taste'         => 'hacker',
                'is_featured'   => false,
                'description'   => 'Heavy-duty dual monitor arm mount with full 360° rotation.',
                'specs' => [
                    ['key' => 'Max screen size', 'value' => '32 inches'],
                    ['key' => 'Max load',         'value' => '8 kg per arm'],
                    ['key' => 'VESA',             'value' => '75×75 to 100×100'],
                    ['key' => 'Material',         'value' => 'Steel'],
                    ['key' => 'Clamp/grommet',    'value' => 'Both included'],
                ],
                'variants' => [
                    ['color' => 'Black',  'color_hex' => '#1A1A1A', 'material' => 'Steel', 'price_modifier' => 0, 'stock' => 40],
                    ['color' => 'Silver', 'color_hex' => '#C0C0C0', 'material' => 'Steel', 'price_modifier' => 0, 'stock' => 20],
                ],
            ],
            [
                'name'          => 'Privacy Partition Panel',
                'price'         => 1200.00,
                'compare_price' => null,
                'stock'         => 35,
                'category'      => 'partitions',
                'space'         => 'call-center',
                'taste'         => 'economie',
                'is_featured'   => false,
                'description'   => 'Acoustic office partition panel for call centers and open offices.',
                'specs' => [
                    ['key' => 'Dimensions',       'value' => '120×60 cm'],
                    ['key' => 'Material',         'value' => 'Fabric + Foam core'],
                    ['key' => 'Sound absorption', 'value' => 'NRC 0.65'],
                    ['key' => 'Weight',           'value' => '6 kg'],
                ],
                'variants' => [
                    ['color' => 'Gray',  'color_hex' => '#808080', 'material' => 'Fabric', 'price_modifier' => 0,   'stock' => 20],
                    ['color' => 'Blue',  'color_hex' => '#2563EB', 'material' => 'Fabric', 'price_modifier' => 100, 'stock' => 10],
                    ['color' => 'Green', 'color_hex' => '#1A9E6B', 'material' => 'Fabric', 'price_modifier' => 100, 'stock' => 5],
                ],
            ],
        ];

        $sellers = [$seller1, $seller2];

        foreach ($products as $i => $data) {
            $seller = $sellers[$i % 2];

            $product = Product::firstOrCreate(
                ['slug' => Str::slug($data['name']) . '-' . Str::lower(Str::random(4))],
                [
                    'name'          => $data['name'],
                    'description'   => $data['description'],
                    'price'         => $data['price'],
                    'compare_price' => $data['compare_price'],
                    'stock'         => $data['stock'],
                    'category_id'   => $catMap[$data['category']]->id,
                    'space_id'      => $data['space'] ? $spaceMap[$data['space']]->id : null,
                    'taste_id'      => $tasteMap[$data['taste']]->id,
                    'seller_id'     => $seller->id,
                    'is_featured'   => $data['is_featured'],
                    'is_active'     => true,
                ]
            );

            // Placeholder image (use Supabase Storage URL in production)
            if ($product->images()->count() === 0) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url'        => "https://placehold.co/600x600/F8F8F8/1A1A1A?text=" . urlencode($product->name),
                    'alt_text'   => $product->name,
                    'is_primary' => true,
                    'sort_order' => 0,
                ]);
            }

            // Specs
            if ($product->specifications()->count() === 0) {
                foreach ($data['specs'] as $j => $spec) {
                    ProductSpecification::create([
                        'product_id' => $product->id,
                        'key'        => $spec['key'],
                        'value'      => $spec['value'],
                        'sort_order' => $j,
                    ]);
                }
            }

            // Variants
            if ($product->variants()->count() === 0) {
                foreach ($data['variants'] as $variant) {
                    ProductVariant::create([
                        'product_id'     => $product->id,
                        'color'          => $variant['color'],
                        'color_hex'      => $variant['color_hex'],
                        'material'       => $variant['material'],
                        'price_modifier' => $variant['price_modifier'],
                        'stock'          => $variant['stock'],
                        'is_active'      => true,
                    ]);
                }
            }
        }

        $this->command->info('✅ Desk+ seeded: admin, 2 sellers, 1 customer, 6 categories, 8 spaces, 6 tastes, 8 products');
        $this->command->info('   Admin:    admin@deskplus.ma    / Admin@DeskPlus2025!');
        $this->command->info('   Seller:   seller1@deskplus.ma / Seller@123');
        $this->command->info('   Customer: customer@deskplus.ma / Customer@123');
    }
}
