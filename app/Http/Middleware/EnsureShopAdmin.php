<?php

namespace App\Http\Middleware;

use App\Models\Shop;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureShopAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $shop = $request->route('shop');
        $shopAdmin = Auth::guard('shop_admin')->user();

        if (! $shop instanceof Shop) {
            abort(404);
        }

        if ($shopAdmin === null) {
            return redirect()->guest(route('shop-admin.login', $shop->menu_slug));
        }

        if ($shopAdmin->shop_id !== $shop->id) {
            abort(404);
        }

        return $next($request);
    }
}
