<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShopAdminRequest;
use App\Models\Shop;
use App\Models\ShopAdmin;
use Illuminate\Http\RedirectResponse;

class ShopAdminController extends Controller
{
    public function store(StoreShopAdminRequest $request, Shop $shop): RedirectResponse
    {
        $shop->shopAdmins()->create($request->safe()->only(['name', 'email', 'password']));

        return back()->with('success', 'ဆိုင် admin account ကို ထည့်ပြီးပါပြီ။');
    }

    public function destroy(Shop $shop, ShopAdmin $shopAdmin): RedirectResponse
    {
        $shopAdmin->delete();

        return back()->with('success', 'ဆိုင် admin account ကို ဖျက်ပြီးပါပြီ။');
    }
}
