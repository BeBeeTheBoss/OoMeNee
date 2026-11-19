<?php

namespace App\Http\Requests\Admin;

use App\Enums\ShopStatus;
use App\Models\Shop;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShopRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('access-admin') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'menu_slug' => [
                'required',
                'string',
                'min:3',
                'max:80',
                'lowercase',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique(Shop::class, 'menu_slug')->ignore($this->route('shop')),
            ],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'status' => ['required', Rule::enum(ShopStatus::class)],
            'duration_type' => ['required', Rule::in(['quick', 'custom'])],
            'duration_months' => ['nullable', 'required_if:duration_type,quick', 'integer', Rule::in([1, 2, 3])],
            'expires_at' => ['nullable', 'required_if:duration_type,custom', 'date', 'after_or_equal:today'],
        ];
    }
}
