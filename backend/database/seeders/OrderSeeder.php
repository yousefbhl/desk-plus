<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('email', 'customer@desk.plus')->first();

        if (!$customer) {
            return;
        }

        $products = Product::with('variants')->take(4)->get();

        if ($products->isEmpty()) {
            return;
        }

        $orders = [
            [
                'status'         => 'delivered',
                'payment_status' => 'paid',
                'items_count'    => 1,
            ],
            [
                'status'         => 'shipped',
                'payment_status' => 'paid',
                'items_count'    => 2,
            ],
            [
                'status'         => 'processing',
                'payment_status' => 'paid',
                'items_count'    => 1,
            ],
            [
                'status'         => 'pending',
                'payment_status' => 'unpaid',
                'items_count'    => 1,
            ],
        ];

        foreach ($orders as $i => $orderData) {
            $itemsToAdd = $products->slice($i % $products->count(), $orderData['items_count']);

            $subtotal = 0;
            foreach ($itemsToAdd as $product) {
                $subtotal += $product->price * 1;
            }

            $shipping = 150;
            $total    = $subtotal + $shipping;

            $order = Order::create([
                'reference'      => 'DSK-' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                'user_id'        => $customer->id,
                'status'         => $orderData['status'],
                'subtotal'       => $subtotal,
                'discount_amount'=> 0,
                'shipping_cost'  => $shipping,
                'tax'            => 0,
                'total'          => $total,
                'payment_method' => 'cod',
                'payment_status' => $orderData['payment_status'],
            ]);

            foreach ($itemsToAdd as $product) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $product->id,
                    'variant_id'   => $product->variants->first()?->id,
                    'product_name' => $product->name,
                    'variant_info' => $product->variants->first()?->color ?? null,
                    'quantity'     => 1,
                    'unit_price'   => $product->price,
                    'total'        => $product->price,
                ]);
            }

            ShippingAddress::create([
                'order_id'      => $order->id,
                'first_name'    => 'Test',
                'last_name'     => 'Customer',
                'email'         => $customer->email,
                'phone'         => '+212 600 000 000',
                'address_line1' => '12 Rue Mohammed V',
                'city'          => 'Casablanca',
                'state'         => 'Grand Casablanca',
                'country'       => 'MA',
                'postal_code'   => '20000',
            ]);
        }

        $this->command->info('✅ OrderSeeder: 4 orders created for customer@desk.plus');
    }
}
