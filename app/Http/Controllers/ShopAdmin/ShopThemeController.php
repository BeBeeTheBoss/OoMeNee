<?php

namespace App\Http\Controllers\ShopAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopAdmin\UpdateShopThemeRequest;
use App\Models\Shop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class ShopThemeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(UpdateShopThemeRequest $request, Shop $shop): RedirectResponse
    {
        $shop->update([
            'theme_color' => Str::upper($request->string('theme_color')->toString()),
        ]);

        return back()->with('success', 'Menu theme color ကို ပြောင်းပြီးပါပြီ။');
    }
}
