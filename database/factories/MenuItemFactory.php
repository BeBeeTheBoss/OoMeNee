<?php

namespace Database\Factories;

use App\Models\MenuItem;
use App\Models\Shop;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MenuItem>
 */
class MenuItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'shop_id' => Shop::factory(),
            'name' => fake()->words(2, true),
            'category' => fake()->randomElement(['Main dishes', 'Drinks', 'Desserts']),
            'description' => fake()->sentence(),
            'price' => fake()->numberBetween(3000, 30000),
            'image_path' => null,
            'is_available' => true,
        ];
    }
}
