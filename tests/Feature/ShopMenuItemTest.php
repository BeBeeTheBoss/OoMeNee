<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\Shop;
use App\Models\ShopAdmin;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShopMenuItemTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_shop_admin_can_log_in_only_to_their_shop(): void
    {
        $shop = Shop::factory()->create(['menu_slug' => 'green-table']);
        Shop::factory()->create(['menu_slug' => 'other-shop']);
        ShopAdmin::factory()->for($shop)->create(['email' => 'manager@example.com', 'password' => 'password123']);

        $this->post('/menu/green-table/admin/login', ['email' => 'manager@example.com', 'password' => 'password123'])
            ->assertRedirect('/menu/green-table/admin/menu-items');

        auth('shop_admin')->logout();

        $this->post('/menu/other-shop/admin/login', ['email' => 'manager@example.com', 'password' => 'password123'])
            ->assertSessionHasErrors('email');

        $this->assertGuest('shop_admin');
    }

    public function test_guest_is_redirected_to_shop_admin_login(): void
    {
        Shop::factory()->create(['menu_slug' => 'green-table']);

        $this->get('/menu/green-table/admin/menu-items')->assertRedirect('/menu/green-table/admin');
    }

    public function test_shop_admin_menu_page_includes_the_shop_expiry_date(): void
    {
        $shop = Shop::factory()->create([
            'menu_slug' => 'green-table',
            'expires_at' => '2026-12-09 12:00:00',
        ]);
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();

        $this->actingAs($shopAdmin, 'shop_admin')
            ->get('/menu/green-table/admin/menu-items')
            ->assertInertia(fn (Assert $page) => $page
                ->component('ShopAdmin/MenuItems/Index')
                ->where('shop.expires_at', 'Dec 9, 2026'));
    }

    public function test_create_page_lists_unique_categories_for_the_current_shop(): void
    {
        $shop = Shop::factory()->create(['menu_slug' => 'green-table']);
        $otherShop = Shop::factory()->create();
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();
        MenuItem::factory()->for($shop)->create(['category' => 'Drinks']);
        MenuItem::factory()->for($shop)->create(['category' => 'Mains']);
        MenuItem::factory()->for($shop)->create(['category' => 'Drinks']);
        MenuItem::factory()->for($otherShop)->create(['category' => 'Private category']);

        $this->actingAs($shopAdmin, 'shop_admin')
            ->get('/menu/green-table/admin/menu-items/create')
            ->assertInertia(fn (Assert $page) => $page
                ->component('ShopAdmin/MenuItems/Create')
                ->where('categories', ['Drinks', 'Mains']));
    }

    public function test_shop_admin_can_create_menu_item_with_image(): void
    {
        Storage::fake('public');
        $shop = Shop::factory()->create(['menu_slug' => 'green-table']);
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();

        $response = $this->actingAs($shopAdmin, 'shop_admin')->post('/menu/green-table/admin/menu-items', [
            'name' => 'Tea Leaf Salad', 'category' => 'Starters',
            'description' => 'Classic Myanmar tea leaf salad', 'price' => 6500,
            'image' => UploadedFile::fake()->image('salad.jpg'), 'is_available' => true,
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect('/menu/green-table/admin/menu-items');
        $menuItem = MenuItem::query()->sole();
        $this->assertSame($shop->id, $menuItem->shop_id);
        Storage::disk('public')->assertExists($menuItem->image_path);
    }

    public function test_shop_admin_can_create_hidden_menu_item(): void
    {
        $shop = Shop::factory()->create(['menu_slug' => 'green-table']);
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();

        $response = $this->actingAs($shopAdmin, 'shop_admin')->post('/menu/green-table/admin/menu-items', [
            'name' => 'Hidden Item', 'category' => 'Specials',
            'description' => null, 'price' => 5000, 'is_available' => false,
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect('/menu/green-table/admin/menu-items');
        $this->assertDatabaseHas('menu_items', [
            'shop_id' => $shop->id,
            'name' => 'Hidden Item',
            'is_available' => false,
        ]);
    }

    public function test_shop_admin_can_update_and_delete_own_menu_item(): void
    {
        Storage::fake('public');
        $shop = Shop::factory()->create(['menu_slug' => 'green-table']);
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();
        Storage::disk('public')->put('menu-items/old.jpg', 'image');
        $menuItem = MenuItem::factory()->for($shop)->create(['image_path' => 'menu-items/old.jpg']);

        $this->actingAs($shopAdmin, 'shop_admin')->patch("/menu/green-table/admin/menu-items/{$menuItem->id}", [
            'name' => 'Updated Item', 'category' => 'Mains', 'description' => 'Updated description',
            'price' => 8000, 'is_available' => false,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('menu_items', ['id' => $menuItem->id, 'name' => 'Updated Item', 'is_available' => false]);

        $this->actingAs($shopAdmin, 'shop_admin')->delete("/menu/green-table/admin/menu-items/{$menuItem->id}")
            ->assertSessionHasNoErrors();

        $this->assertModelMissing($menuItem);
        Storage::disk('public')->assertMissing('menu-items/old.jpg');
    }

    public function test_shop_admin_cannot_manage_another_shops_menu_item(): void
    {
        $shop = Shop::factory()->create(['menu_slug' => 'green-table']);
        $otherShop = Shop::factory()->create(['menu_slug' => 'other-shop']);
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();
        $otherMenuItem = MenuItem::factory()->for($otherShop)->create();

        $this->actingAs($shopAdmin, 'shop_admin')
            ->get("/menu/other-shop/admin/menu-items/{$otherMenuItem->id}/edit")
            ->assertNotFound();
    }

    public function test_public_menu_displays_only_available_items(): void
    {
        $shop = Shop::factory()->create(['menu_slug' => 'green-table']);
        MenuItem::factory()->for($shop)->create(['name' => 'Visible Item', 'is_available' => true]);
        MenuItem::factory()->for($shop)->create(['name' => 'Hidden Item', 'is_available' => false]);

        $this->get('/menu/green-table')->assertInertia(fn (Assert $page) => $page
            ->component('Menus/Show')->has('menu_items', 1)
            ->where('menu_items.0.name', 'Visible Item'));
    }
}
