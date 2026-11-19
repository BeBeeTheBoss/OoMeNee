<?php

namespace App\Http\Controllers\ShopAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopAdmin\StoreMenuItemRequest;
use App\Http\Requests\ShopAdmin\UpdateMenuItemRequest;
use App\Models\MenuItem;
use App\Models\Shop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    public function index(Shop $shop): Response
    {
        $menuItems = $shop->menuItems()
            ->orderBy('category')
            ->orderByDesc('id')
            ->get()
            ->map(fn (MenuItem $menuItem): array => [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'category' => $menuItem->category,
                'description' => $menuItem->description,
                'price' => $menuItem->price,
                'image_url' => $menuItem->image_path ? Storage::disk('public')->url($menuItem->image_path) : null,
                'is_available' => $menuItem->is_available,
            ]);

        return Inertia::render('ShopAdmin/MenuItems/Index', [
            'shop' => $this->shopData($shop),
            'menu_items' => $menuItems,
        ]);
    }

    public function create(Shop $shop): Response
    {
        return Inertia::render('ShopAdmin/MenuItems/Create', [
            'shop' => $this->shopData($shop),
            'categories' => $this->categoriesFor($shop),
        ]);
    }

    public function store(StoreMenuItemRequest $request, Shop $shop): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'category', 'description', 'price']);
        $data['is_available'] = $request->boolean('is_available');

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store("menu-items/{$shop->id}", 'public');
        }

        $shop->menuItems()->create($data);

        return to_route('shop-admin.menu-items.index', $shop->menu_slug)
            ->with('success', 'Menu item ကို ထည့်ပြီးပါပြီ။');
    }

    public function edit(Shop $shop, MenuItem $menuItem): Response
    {
        return Inertia::render('ShopAdmin/MenuItems/Edit', [
            'shop' => $this->shopData($shop),
            'categories' => $this->categoriesFor($shop),
            'menu_item' => [
                'id' => $menuItem->id,
                'name' => $menuItem->name,
                'category' => $menuItem->category,
                'description' => $menuItem->description,
                'price' => $menuItem->price,
                'image_url' => $menuItem->image_path ? Storage::disk('public')->url($menuItem->image_path) : null,
                'is_available' => $menuItem->is_available,
            ],
        ]);
    }

    public function update(UpdateMenuItemRequest $request, Shop $shop, MenuItem $menuItem): RedirectResponse
    {
        $data = $request->safe()->only(['name', 'category', 'description', 'price']);
        $data['is_available'] = $request->boolean('is_available');

        if ($request->hasFile('image')) {
            if ($menuItem->image_path) {
                Storage::disk('public')->delete($menuItem->image_path);
            }

            $data['image_path'] = $request->file('image')->store("menu-items/{$shop->id}", 'public');
        }

        $menuItem->update($data);

        return to_route('shop-admin.menu-items.index', $shop->menu_slug)
            ->with('success', 'Menu item ကို ပြင်ပြီးပါပြီ။');
    }

    public function destroy(Shop $shop, MenuItem $menuItem): RedirectResponse
    {
        if ($menuItem->image_path) {
            Storage::disk('public')->delete($menuItem->image_path);
        }

        $menuItem->delete();

        return back()->with('success', 'Menu item ကို ဖျက်ပြီးပါပြီ။');
    }

    /** @return array<string, mixed> */
    private function shopData(Shop $shop): array
    {
        return [
            'id' => $shop->id,
            'name' => $shop->name,
            'menu_slug' => $shop->menu_slug,
            'logo_url' => Storage::disk('public')->url($shop->logo_path),
            'menu_url' => route('menus.show', $shop->menu_slug),
            'theme_color' => $shop->theme_color,
            'expires_at' => $shop->expires_at?->format('M j, Y'),
        ];
    }

    /** @return array<int, string> */
    private function categoriesFor(Shop $shop): array
    {
        return $shop->menuItems()
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->all();
    }
}
