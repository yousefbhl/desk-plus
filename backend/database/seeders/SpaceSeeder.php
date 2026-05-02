<?php

namespace Database\Seeders;

use App\Models\Space;
use Illuminate\Database\Seeder;

class SpaceSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Home', 'Office', 'Cafe', 'Outdoor'] as $name) {
            Space::firstOrCreate(['name' => $name]);
        }
    }
}
