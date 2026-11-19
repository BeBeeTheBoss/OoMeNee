<?php

namespace Tests\Feature\ShopAdmin;

use App\Models\Shop;
use App\Models\ShopAdmin;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShopThemeControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_shop_admin_can_update_their_menu_theme_color(): void
    {
        $shop = Shop::factory()->create([
            'name' => 'Green Table',
            'menu_slug' => 'green-table',
            'theme_color' => '#1F573F',
        ]);
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();

        $this->actingAs($shopAdmin, 'shop_admin')
            ->patch('/menu/green-table/admin/theme', [
                'theme_color' => '#6b5cff',
                'name' => 'Changed without permission',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertDatabaseHas('shops', [
            'id' => $shop->id,
            'name' => 'Green Table',
            'theme_color' => '#6B5CFF',
        ]);

        $this->get('/menu/green-table')->assertInertia(fn (Assert $page) => $page
            ->component('Menus/Show')
            ->where('shop.theme_color', '#6B5CFF'));
    }

    public function test_theme_color_must_be_a_six_digit_hex_value(): void
    {
        $shop = Shop::factory()->create(['menu_slug' => 'green-table', 'theme_color' => '#1F573F']);
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();

        $this->actingAs($shopAdmin, 'shop_admin')
            ->patch('/menu/green-table/admin/theme', ['theme_color' => 'not-a-color'])
            ->assertSessionHasErrors('theme_color');

        $this->assertSame('#1F573F', $shop->refresh()->theme_color);
    }

    public function test_shop_admin_cannot_update_another_shops_theme(): void
    {
        $shop = Shop::factory()->create(['menu_slug' => 'green-table']);
        $otherShop = Shop::factory()->create(['menu_slug' => 'other-shop', 'theme_color' => '#1F573F']);
        $shopAdmin = ShopAdmin::factory()->for($shop)->create();

        $this->actingAs($shopAdmin, 'shop_admin')
            ->patch('/menu/other-shop/admin/theme', ['theme_color' => '#6B5CFF'])
            ->assertNotFound();

        $this->assertSame('#1F573F', $otherShop->refresh()->theme_color);
    }

    public function test_guest_is_redirected_before_updating_theme(): void
    {
        $shop = Shop::factory()->create(['menu_slug' => 'green-table', 'theme_color' => '#1F573F']);

        $this->patch('/menu/green-table/admin/theme', ['theme_color' => '#6B5CFF'])
            ->assertRedirect('/menu/green-table/admin');

        $this->assertSame('#1F573F', $shop->refresh()->theme_color);
    }
}
