<?php

namespace Database\Factories;

use App\Enums\ShopStatus;
use App\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Shop>
 */
class ShopFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'menu_slug' => fake()->unique()->slug(2),
            'logo_path' => 'shop-logos/example.png',
            'theme_color' => '#1F573F',
            'status' => ShopStatus::Trial,
            'duration_months' => 1,
            'expires_at' => now()->addMonth(),
        ];
    }

    public function trial(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => ShopStatus::Trial,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => ShopStatus::Active,
        ]);
    }
}
