<?php

namespace App\Http\Controllers\ShopAdmin\Auth;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(Shop $shop): Response|RedirectResponse
    {
        $shopAdmin = Auth::guard('shop_admin')->user();

        if ($shopAdmin?->shop_id === $shop->id) {
            return to_route('shop-admin.menu-items.index', $shop->menu_slug);
        }

        return Inertia::render('ShopAdmin/Auth/Login', [
            'shop' => [
                'name' => $shop->name,
                'logo_url' => Storage::disk('public')->url($shop->logo_path),
                'menu_slug' => $shop->menu_slug,
            ],
        ]);
    }

    public function store(Request $request, Shop $shop): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['boolean'],
        ]);

        $authenticated = Auth::guard('shop_admin')->attempt([
            'email' => Str::lower($credentials['email']),
            'password' => $credentials['password'],
            'shop_id' => $shop->id,
        ], $request->boolean('remember'));

        if (! $authenticated) {
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('shop-admin.menu-items.index', $shop->menu_slug, absolute: false));
    }

    public function destroy(Request $request, Shop $shop): RedirectResponse
    {
        Auth::guard('shop_admin')->logout();
        $request->session()->regenerateToken();

        return to_route('shop-admin.login', $shop->menu_slug);
    }
}
