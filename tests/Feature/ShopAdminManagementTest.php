<?php

namespace Tests\Feature;

use App\Models\Shop;
use App\Models\ShopAdmin;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShopAdminManagementTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_central_admin_can_view_shop_details_and_accounts(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->create(['menu_slug' => 'green-table']);
        ShopAdmin::factory()->for($shop)->create(['name' => 'Menu Manager']);

        $this->actingAs($admin)->get("/admin/shops/{$shop->id}")
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Shops/Show')
                ->where('shop.name', $shop->name)
                ->where('shop.admin_url', url('/menu/green-table/admin'))
                ->has('shop.shop_admins', 1)
                ->where('shop.shop_admins.0.name', 'Menu Manager'));
    }

    public function test_central_admin_can_add_shop_admin(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->create();

        $response = $this->actingAs($admin)->post("/admin/shops/{$shop->id}/admins", [
            'name' => 'Restaurant Manager',
            'email' => 'MANAGER@example.com',
            'password' => 'strong-password',
        ]);

        $response->assertSessionHasNoErrors();
        $shopAdmin = ShopAdmin::query()->sole();
        $this->assertSame($shop->id, $shopAdmin->shop_id);
        $this->assertSame('manager@example.com', $shopAdmin->email);
        $this->assertTrue(Hash::check('strong-password', $shopAdmin->password));
    }

    public function test_shop_admin_email_must_be_unique_within_a_shop(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->create();
        ShopAdmin::factory()->for($shop)->create(['email' => 'manager@example.com']);

        $this->actingAs($admin)->post("/admin/shops/{$shop->id}/admins", [
            'name' => 'Duplicate Manager',
            'email' => 'manager@example.com',
            'password' => 'strong-password',
        ])->assertSessionHasErrors('email');

        $this->assertDatabaseCount('shop_admins', 1);
    }

    public function test_central_admin_can_remove_an_admin_belonging_to_the_shop(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->create();
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();

        $this->actingAs($admin)->delete("/admin/shops/{$shop->id}/admins/{$shopAdmin->id}")
            ->assertSessionHasNoErrors();

        $this->assertModelMissing($shopAdmin);
    }

    public function test_central_admin_cannot_remove_an_admin_from_another_shop(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->create();
        $otherShopAdmin = ShopAdmin::factory()->for(Shop::factory())->create();

        $this->actingAs($admin)->delete("/admin/shops/{$shop->id}/admins/{$otherShopAdmin->id}")
            ->assertNotFound();

        $this->assertModelExists($otherShopAdmin);
    }
}
