<?php

use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\ShopAdminController;
use App\Http\Controllers\Admin\ShopController;
use App\Http\Controllers\Admin\ShopStatusController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ShopAdmin\Auth\AuthenticatedSessionController as ShopAuthenticatedSessionController;
use App\Http\Controllers\ShopAdmin\MenuItemController;
use App\Http\Controllers\ShopAdmin\ShopThemeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/contact', function () {
    return Inertia::render('Contact', [
        'contacts' => [
            [
                'username' => '@BeBee2x',
                'url' => 'https://t.me/BeBee2x',
            ],
            [
                'username' => '@nakeblac613',
                'url' => 'https://t.me/nakeblac613',
            ],
        ],
    ]);
})->name('contact');

Route::get('/menu/{shop:menu_slug}', MenuController::class)->name('menus.show');

Route::prefix('menu/{shop:menu_slug}/admin')
    ->name('shop-admin.')
    ->scopeBindings()
    ->group(function () {
        Route::get('/', [ShopAuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('/login', [ShopAuthenticatedSessionController::class, 'store'])
            ->middleware('throttle:6,1')
            ->name('login.store');

        Route::middleware('shop.admin')->group(function () {
            Route::resource('menu-items', MenuItemController::class)->except('show');
            Route::patch('/theme', ShopThemeController::class)->name('theme.update');
            Route::post('/logout', [ShopAuthenticatedSessionController::class, 'destroy'])->name('logout');
        });
    });

Route::prefix('admin')
    ->name('admin.')
    ->middleware('guest')
    ->group(function () {
        Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
    });

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'can:access-admin'])
    ->group(function () {
        Route::get('/', [ShopController::class, 'index'])->name('shops.index');
        Route::get('/shops/create', [ShopController::class, 'create'])->name('shops.create');
        Route::post('/shops', [ShopController::class, 'store'])->name('shops.store');
        Route::get('/shops/{shop}/edit', [ShopController::class, 'edit'])->name('shops.edit');
        Route::patch('/shops/{shop}', [ShopController::class, 'update'])->name('shops.update');
        Route::get('/shops/{shop}', [ShopController::class, 'show'])->name('shops.show');
        Route::post('/shops/{shop}/admins', [ShopAdminController::class, 'store'])->name('shops.admins.store');
        Route::delete('/shops/{shop}/admins/{shopAdmin}', [ShopAdminController::class, 'destroy'])
            ->scopeBindings()
            ->name('shops.admins.destroy');
        Route::patch('/shops/{shop}/status', ShopStatusController::class)->name('shops.status.update');
        Route::delete('/shops/{shop}', [ShopController::class, 'destroy'])->name('shops.destroy');
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    });
