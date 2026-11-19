<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_admin_login_page_is_displayed(): void
    {
        $response = $this->get('/admin/login');

        $response->assertOk();
    }

    public function test_default_login_page_is_not_available(): void
    {
        $response = $this->get('/login');

        $response->assertNotFound();
    }

    public function test_public_registration_is_not_available(): void
    {
        $response = $this->get('/register');

        $response->assertNotFound();
    }

    public function test_configured_admin_can_authenticate(): void
    {
        config(['admin.email' => 'owner@example.com']);
        User::factory()->create([
            'email' => 'owner@example.com',
            'password' => 'secure-password',
        ]);

        $response = $this->post('/admin/login', [
            'email' => 'owner@example.com',
            'password' => 'secure-password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/admin');
    }

    public function test_non_admin_database_account_cannot_authenticate_to_admin_dashboard(): void
    {
        config(['admin.email' => 'owner@example.com']);
        User::factory()->create([
            'email' => 'staff@example.com',
            'password' => 'secure-password',
        ]);

        $response = $this->post('/admin/login', [
            'email' => 'staff@example.com',
            'password' => 'secure-password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_admin_cannot_authenticate_with_wrong_password(): void
    {
        config(['admin.email' => 'owner@example.com']);
        User::factory()->create([
            'email' => 'owner@example.com',
            'password' => 'secure-password',
        ]);

        $response = $this->post('/admin/login', [
            'email' => 'owner@example.com',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_admin_can_log_out(): void
    {
        config(['admin.email' => 'owner@example.com']);
        $admin = User::factory()->create(['email' => 'owner@example.com']);

        $response = $this->actingAs($admin)->post('/admin/logout');

        $this->assertGuest();
        $response->assertRedirect('/admin/login');
    }

    public function test_admin_seeder_creates_configured_database_account(): void
    {
        config([
            'admin.name' => 'System Owner',
            'admin.email' => 'owner@example.com',
            'admin.password' => 'seeded-password',
        ]);

        $this->seed(AdminUserSeeder::class);

        $admin = User::query()->sole();

        $this->assertSame('System Owner', $admin->name);
        $this->assertSame('owner@example.com', $admin->email);
        $this->assertTrue(Hash::check('seeded-password', $admin->password));
        $this->assertNotNull($admin->email_verified_at);
    }
}
