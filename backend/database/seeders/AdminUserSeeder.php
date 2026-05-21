<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['admin', 'seller', 'customer'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $admin = User::firstOrCreate(
            ['email' => 'admin@desk.plus'],
            [
                'name' => 'Desk Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        $admin->syncRoles(['admin']);
    }
}
