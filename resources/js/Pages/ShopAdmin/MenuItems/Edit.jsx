import MenuItemForm from '@/Components/ShopAdmin/MenuItemForm';
import ShopAdminLayout from '@/Layouts/ShopAdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ shop, categories, menu_item: menuItem }) {
    const { data, setData, post, processing, errors } = useForm({ name: menuItem.name, category: menuItem.category, description: menuItem.description ?? '', price: menuItem.price, image: null, is_available: menuItem.is_available, _method: 'patch' });
    const submit = (event) => { event.preventDefault(); post(route('shop-admin.menu-items.update', [shop.menu_slug, menuItem.id]), { forceFormData: true }); };

    return <><Head title={`Edit ${menuItem.name} · ${shop.name}`} /><ShopAdminLayout shop={shop}><div className="mx-auto max-w-4xl"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b5cff]">Edit menu item</p><h1 className="mt-2 truncate text-2xl font-bold tracking-[-0.04em] sm:mt-3 sm:text-[1.65rem]">{menuItem.name}</h1><p className="mt-2 text-[13px] leading-5 text-black/45 sm:text-[14px]">Item အချက်အလက်တွေကို ပြင်ဆင်ပါ။</p><form onSubmit={submit} className="mt-6 sm:mt-8"><MenuItemForm shop={shop} data={data} setData={setData} errors={errors} processing={processing} submitLabel="Save changes" imageUrl={menuItem.image_url} categories={categories} /></form></div></ShopAdminLayout></>;
}
