<?php

namespace App\Models;

use Database\Factories\ShopAdminFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;

#[Fillable(['shop_id', 'name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class ShopAdmin extends Authenticatable
{
    /** @use HasFactory<ShopAdminFactory> */
    use HasFactory;

    /** @return BelongsTo<Shop, $this> */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }
}
