<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ShopStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShopRequest;
use App\Http\Requests\Admin\UpdateShopRequest;
use App\Models\Shop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/Shops/Create');
    }

    public function index(): Response
    {
        $shops = Shop::query()
            ->latest('id')
            ->paginate(10)
            ->through(fn (Shop $shop): array => [
                'id' => $shop->id,
                'name' => $shop->name,
                'menu_slug' => $shop->menu_slug,
                'menu_url' => $shop->menu_slug ? route('menus.show', $shop->menu_slug) : null,
                'logo_url' => Storage::disk('public')->url($shop->logo_path),
                'status' => $shop->status->value,
                'duration_months' => $shop->duration_months,
                'expires_at' => $shop->expires_at?->format('M j, Y'),
                'created_at' => $shop->created_at->format('M j, Y'),
            ]);

        return Inertia::render('Admin/Shops/Index', [
            'shops' => $shops,
            'stats' => [
                'total' => Shop::query()->count(),
                'trial' => Shop::query()->where('status', ShopStatus::Trial)->count(),
                'active' => Shop::query()->where('status', ShopStatus::Active)->count(),
            ],
        ]);
    }

    public function edit(Shop $shop): Response
    {
        return Inertia::render('Admin/Shops/Edit', [
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
                'menu_slug' => $shop->menu_slug,
                'logo_url' => Storage::disk('public')->url($shop->logo_path),
                'status' => $shop->status->value,
                'duration_type' => $shop->duration_months ? 'quick' : 'custom',
                'duration_months' => $shop->duration_months,
                'expires_at' => $shop->expires_at?->format('Y-m-d'),
            ],
        ]);
    }

    public function show(Shop $shop): Response
    {
        $shop->load(['shopAdmins' => fn ($query) => $query->latest('id')]);

        return Inertia::render('Admin/Shops/Show', [
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
                'logo_url' => Storage::disk('public')->url($shop->logo_path),
                'status' => $shop->status->value,
                'expires_at' => $shop->expires_at?->format('M j, Y'),
                'menu_url' => $shop->menu_slug ? route('menus.show', $shop->menu_slug) : null,
                'admin_url' => $shop->menu_slug ? route('shop-admin.login', $shop->menu_slug) : null,
                'shop_admins' => $shop->shopAdmins->map(fn ($shopAdmin): array => [
                    'id' => $shopAdmin->id,
                    'name' => $shopAdmin->name,
                    'email' => $shopAdmin->email,
                    'created_at' => $shopAdmin->created_at->format('M j, Y'),
                ]),
            ],
        ]);
    }

    public function store(StoreShopRequest $request): RedirectResponse
    {
        $logoPath = $request->file('logo')->store('shop-logos', 'public');
        $usesCustomExpiry = $request->string('duration_type')->toString() === 'custom';
        $durationMonths = $usesCustomExpiry ? null : $request->integer('duration_months');
        $expiresAt = $usesCustomExpiry
            ? Carbon::parse($request->string('expires_at')->toString())->endOfDay()
            : now()->addMonths($durationMonths);

        Shop::create([
            'name' => $request->string('name')->toString(),
            'menu_slug' => $request->string('menu_slug')->toString(),
            'logo_path' => $logoPath,
            'status' => $request->enum('status', ShopStatus::class),
            'duration_months' => $durationMonths,
            'expires_at' => $expiresAt,
        ]);

        return to_route('admin.shops.index')->with('success', 'ဆိုင်အသစ်ကို ထည့်ပြီးပါပြီ။');
    }

    public function update(UpdateShopRequest $request, Shop $shop): RedirectResponse
    {
        $usesCustomExpiry = $request->string('duration_type')->toString() === 'custom';
        $durationMonths = $usesCustomExpiry ? null : $request->integer('duration_months');
        $expiresAt = $usesCustomExpiry
            ? Carbon::parse($request->string('expires_at')->toString())->endOfDay()
            : now()->addMonths($durationMonths);
        $oldLogoPath = $shop->logo_path;
        $logoPath = $request->hasFile('logo')
            ? $request->file('logo')->store('shop-logos', 'public')
            : $oldLogoPath;

        $shop->update([
            'name' => $request->string('name')->toString(),
            'menu_slug' => $request->string('menu_slug')->toString(),
            'logo_path' => $logoPath,
            'status' => $request->enum('status', ShopStatus::class),
            'duration_months' => $durationMonths,
            'expires_at' => $expiresAt,
        ]);

        if ($logoPath !== $oldLogoPath) {
            Storage::disk('public')->delete($oldLogoPath);
        }

        return to_route('admin.shops.show', $shop)->with('success', 'ဆိုင်အချက်အလက်တွေကို ပြင်ပြီးပါပြီ။');
    }

    public function destroy(Shop $shop): RedirectResponse
    {
        Storage::disk('public')->delete($shop->logo_path);
        $shop->delete();

        return to_route('admin.shops.index')->with('success', 'ဆိုင်ကို ဖျက်ပြီးပါပြီ။');
    }
}
