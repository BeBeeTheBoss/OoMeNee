<?php

namespace Tests\Feature\Admin;

use App\Enums\ShopStatus;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShopControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_unauthenticated_request_redirects_to_login(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/admin/login');
    }

    public function test_non_admin_user_is_forbidden_from_admin_dashboard(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $user = User::factory()->create(['email' => 'staff@example.com']);

        $response = $this->actingAs($user)->get('/admin');

        $response->assertForbidden();
    }

    public function test_admin_can_view_shop_management_dashboard(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        Shop::factory()->trial()->create(['name' => 'Trial Cafe']);
        Shop::factory()->active()->create(['name' => 'Active Bistro']);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Shops/Index')
            ->where('stats.total', 2)
            ->where('stats.trial', 1)
            ->where('stats.active', 1)
            ->has('shops.data', 2));
    }

    public function test_admin_can_view_shop_creation_page(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);

        $response = $this->actingAs($admin)->get('/admin/shops/create');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Shops/Create'));
    }

    public function test_admin_can_create_trial_shop_with_logo(): void
    {
        $this->travelTo('2026-11-09 12:00:00');
        Storage::fake('public');
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $logo = UploadedFile::fake()->image('green-table.png', 300, 300);

        $response = $this->actingAs($admin)->post('/admin/shops', [
            'name' => 'The Green Table',
            'menu_slug' => 'the-green-table',
            'logo' => $logo,
            'status' => 'trial',
            'duration_type' => 'quick',
            'duration_months' => 1,
            'logo_path' => 'untrusted/path.svg',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/admin');

        $shop = Shop::query()->sole();

        $this->assertSame('The Green Table', $shop->name);
        $this->assertSame('the-green-table', $shop->menu_slug);
        $this->assertSame(ShopStatus::Trial, $shop->status);
        $this->assertSame(1, $shop->duration_months);
        $this->assertSame('2026-12-09 12:00:00', $shop->expires_at->toDateTimeString());
        $this->assertStringStartsWith('shop-logos/', $shop->logo_path);
        $this->assertSame('png', pathinfo($shop->logo_path, PATHINFO_EXTENSION));
        Storage::disk('public')->assertExists($shop->logo_path);
    }

    public function test_admin_can_create_active_shop_with_three_month_duration(): void
    {
        $this->travelTo('2026-11-09 12:00:00');
        Storage::fake('public');
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);

        $response = $this->actingAs($admin)->post('/admin/shops', [
            'name' => 'Active Bistro',
            'menu_slug' => 'active-bistro',
            'logo' => UploadedFile::fake()->image('active-bistro.png', 300, 300),
            'status' => 'active',
            'duration_type' => 'quick',
            'duration_months' => 3,
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/admin');

        $shop = Shop::query()->sole();

        $this->assertSame(ShopStatus::Active, $shop->status);
        $this->assertSame(3, $shop->duration_months);
        $this->assertSame('2027-02-09 12:00:00', $shop->expires_at->toDateTimeString());
    }

    public function test_admin_can_create_shop_with_custom_expiry_date(): void
    {
        $this->travelTo('2026-11-09 12:00:00');
        Storage::fake('public');
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);

        $response = $this->actingAs($admin)->post('/admin/shops', [
            'name' => 'Calendar Cafe',
            'menu_slug' => 'calendar-cafe',
            'logo' => UploadedFile::fake()->image('calendar-cafe.png', 300, 300),
            'status' => 'trial',
            'duration_type' => 'custom',
            'expires_at' => '2027-01-25',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/admin');

        $shop = Shop::query()->sole();

        $this->assertNull($shop->duration_months);
        $this->assertSame('2027-01-25 23:59:59', $shop->expires_at->toDateTimeString());
    }

    public function test_shop_creation_requires_name_logo_and_status(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);

        $response = $this->actingAs($admin)->post('/admin/shops', []);

        $response
            ->assertSessionHasErrors(['name', 'menu_slug', 'logo', 'status', 'duration_type'])
            ->assertRedirect();
        $this->assertDatabaseCount('shops', 0);
    }

    public function test_shop_creation_rejects_invalid_logo_and_status(): void
    {
        Storage::fake('public');
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);

        $response = $this->actingAs($admin)->post('/admin/shops', [
            'name' => 'Unsafe Shop',
            'menu_slug' => 'Invalid URI!',
            'logo' => UploadedFile::fake()->create('logo.svg', 10, 'image/svg+xml'),
            'status' => 'suspended',
            'duration_type' => 'quick',
            'duration_months' => 4,
        ]);

        $response
            ->assertSessionHasErrors(['menu_slug', 'logo', 'status', 'duration_months'])
            ->assertRedirect();
        $this->assertDatabaseCount('shops', 0);
    }

    public function test_shop_creation_rejects_duplicate_menu_uri(): void
    {
        Storage::fake('public');
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        Shop::factory()->create(['menu_slug' => 'shared-menu']);

        $response = $this->actingAs($admin)->post('/admin/shops', [
            'name' => 'Another Shop',
            'menu_slug' => 'shared-menu',
            'logo' => UploadedFile::fake()->image('another-shop.png', 300, 300),
            'status' => 'active',
            'duration_type' => 'quick',
            'duration_months' => 1,
        ]);

        $response->assertSessionHasErrors(['menu_slug']);
        $this->assertDatabaseCount('shops', 1);
    }

    public function test_custom_expiry_date_cannot_be_in_the_past(): void
    {
        $this->travelTo('2026-11-09 12:00:00');
        Storage::fake('public');
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);

        $response = $this->actingAs($admin)->post('/admin/shops', [
            'name' => 'Expired Cafe',
            'menu_slug' => 'expired-cafe',
            'logo' => UploadedFile::fake()->image('expired-cafe.png', 300, 300),
            'status' => 'trial',
            'duration_type' => 'custom',
            'expires_at' => '2026-11-08',
        ]);

        $response->assertSessionHasErrors(['expires_at']);
        $this->assertDatabaseCount('shops', 0);
    }

    public function test_public_can_view_shop_menu_by_uri(): void
    {
        $shop = Shop::factory()->create([
            'name' => 'Public Kitchen',
            'menu_slug' => 'public-kitchen',
        ]);

        $response = $this->get('/menu/public-kitchen');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Menus/Show')
            ->where('shop.name', $shop->name)
            ->where('shop.menu_slug', 'public-kitchen'));
    }

    public function test_admin_can_view_shop_edit_page(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->active()->create([
            'name' => 'Edit Cafe',
            'menu_slug' => 'edit-cafe',
            'duration_months' => 2,
        ]);

        $response = $this->actingAs($admin)->get("/admin/shops/{$shop->id}/edit");

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Shops/Edit')
            ->where('shop.id', $shop->id)
            ->where('shop.name', 'Edit Cafe')
            ->where('shop.menu_slug', 'edit-cafe')
            ->where('shop.status', 'active')
            ->where('shop.duration_type', 'quick')
            ->where('shop.duration_months', 2));
    }

    public function test_admin_can_update_shop_without_replacing_logo(): void
    {
        $this->travelTo('2026-11-09 12:00:00');
        Storage::fake('public');
        Storage::disk('public')->put('shop-logos/original.png', 'original');
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->trial()->create([
            'menu_slug' => 'old-uri',
            'logo_path' => 'shop-logos/original.png',
        ]);

        $response = $this->actingAs($admin)->patch("/admin/shops/{$shop->id}", [
            'name' => 'Updated Restaurant',
            'menu_slug' => 'updated-restaurant',
            'status' => 'active',
            'duration_type' => 'quick',
            'duration_months' => 3,
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect("/admin/shops/{$shop->id}");
        $shop->refresh();
        $this->assertSame('Updated Restaurant', $shop->name);
        $this->assertSame('updated-restaurant', $shop->menu_slug);
        $this->assertSame(ShopStatus::Active, $shop->status);
        $this->assertSame(3, $shop->duration_months);
        $this->assertSame('2027-02-09 12:00:00', $shop->expires_at->toDateTimeString());
        $this->assertSame('shop-logos/original.png', $shop->logo_path);
        Storage::disk('public')->assertExists('shop-logos/original.png');
    }

    public function test_admin_can_replace_shop_logo_and_use_custom_expiry(): void
    {
        $this->travelTo('2026-11-09 12:00:00');
        Storage::fake('public');
        Storage::disk('public')->put('shop-logos/old.png', 'old');
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->create([
            'menu_slug' => 'logo-cafe',
            'logo_path' => 'shop-logos/old.png',
        ]);

        $response = $this->actingAs($admin)->patch("/admin/shops/{$shop->id}", [
            'name' => 'Logo Cafe',
            'menu_slug' => 'logo-cafe',
            'logo' => UploadedFile::fake()->image('new-logo.webp', 300, 300),
            'status' => 'trial',
            'duration_type' => 'custom',
            'expires_at' => '2027-03-15',
        ]);

        $response->assertSessionHasNoErrors();
        $shop->refresh();
        $this->assertNull($shop->duration_months);
        $this->assertSame('2027-03-15 23:59:59', $shop->expires_at->toDateTimeString());
        $this->assertNotSame('shop-logos/old.png', $shop->logo_path);
        Storage::disk('public')->assertMissing('shop-logos/old.png');
        Storage::disk('public')->assertExists($shop->logo_path);
    }

    public function test_shop_update_rejects_another_shops_menu_uri(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->create(['menu_slug' => 'first-shop']);
        Shop::factory()->create(['menu_slug' => 'reserved-uri']);

        $response = $this->actingAs($admin)->patch("/admin/shops/{$shop->id}", [
            'name' => 'First Shop',
            'menu_slug' => 'reserved-uri',
            'status' => 'active',
            'duration_type' => 'quick',
            'duration_months' => 1,
        ]);

        $response->assertSessionHasErrors('menu_slug');
        $this->assertSame('first-shop', $shop->refresh()->menu_slug);
    }

    public function test_non_admin_user_cannot_update_shop(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $user = User::factory()->create(['email' => 'staff@example.com']);
        $shop = Shop::factory()->create(['name' => 'Original Shop']);

        $response = $this->actingAs($user)->patch("/admin/shops/{$shop->id}", [
            'name' => 'Unauthorized Update',
            'menu_slug' => 'unauthorized-update',
            'status' => 'active',
            'duration_type' => 'quick',
            'duration_months' => 1,
        ]);

        $response->assertForbidden();
        $this->assertSame('Original Shop', $shop->refresh()->name);
    }

    public function test_admin_can_delete_shop_and_its_logo(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('shop-logos/delete-me.png', 'image');
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->create(['logo_path' => 'shop-logos/delete-me.png']);

        $response = $this->actingAs($admin)->delete("/admin/shops/{$shop->id}");

        $response->assertRedirect('/admin');
        $this->assertModelMissing($shop);
        Storage::disk('public')->assertMissing('shop-logos/delete-me.png');
    }

    public function test_non_admin_user_cannot_delete_shop(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $user = User::factory()->create(['email' => 'staff@example.com']);
        $shop = Shop::factory()->create();

        $response = $this->actingAs($user)->delete("/admin/shops/{$shop->id}");

        $response->assertForbidden();
        $this->assertModelExists($shop);
    }

    public function test_admin_can_activate_trial_shop(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);
        $shop = Shop::factory()->trial()->create();

        $response = $this->actingAs($admin)->patch("/admin/shops/{$shop->id}/status", [
            'status' => 'active',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect();
        $this->assertSame(ShopStatus::Active, $shop->refresh()->status);
    }

    public function test_non_admin_user_cannot_change_shop_status(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $user = User::factory()->create(['email' => 'staff@example.com']);
        $shop = Shop::factory()->trial()->create();

        $response = $this->actingAs($user)->patch("/admin/shops/{$shop->id}/status", [
            'status' => 'active',
        ]);

        $response->assertForbidden();
        $this->assertSame(ShopStatus::Trial, $shop->refresh()->status);
    }
}
