<?php

namespace Database\Seeders;

use App\Models\ShopAdmin;
use Illuminate\Database\Seeder;

class ShopAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ShopAdmin::factory()->create();
    }
}
