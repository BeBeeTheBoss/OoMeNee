<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Shop $shop): Response
    {
        $menuItems = $shop->menuItems()
            ->where('is_available', true)
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->map(fn ($menuItem): array => [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'category' => $menuItem->category,
                'description' => $menuItem->description,
                'price' => $menuItem->price,
                'image_url' => $menuItem->image_path ? Storage::disk('public')->url($menuItem->image_path) : null,
            ]);

        return Inertia::render('Menus/Show', [
            'shop' => [
                'name' => $shop->name,
                'logo_url' => Storage::disk('public')->url($shop->logo_path),
                'menu_slug' => $shop->menu_slug,
                'theme_color' => $shop->theme_color,
            ],
            'menu_items' => $menuItems,
        ]);
    }
}
