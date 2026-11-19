<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateShopStatusRequest;
use App\Models\Shop;
use Illuminate\Http\RedirectResponse;

class ShopStatusController extends Controller
{
    public function __invoke(UpdateShopStatusRequest $request, Shop $shop): RedirectResponse
    {
        $shop->update($request->safe()->only('status'));

        return back()->with('success', 'Account status ကို ပြောင်းပြီးပါပြီ။');
    }
}
