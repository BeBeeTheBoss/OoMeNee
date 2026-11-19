<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use LogicException;

class AdminUserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (blank(config('admin.email')) || blank(config('admin.password'))) {
            throw new LogicException('ADMIN_EMAIL and ADMIN_PASSWORD must be configured before seeding the admin user.');
        }

        User::query()->updateOrCreate(
            ['email' => config('admin.email')],
            [
                'name' => config('admin.name'),
                'password' => Hash::make(config('admin.password')),
                'email_verified_at' => now(),
            ],
        );
    }
}
