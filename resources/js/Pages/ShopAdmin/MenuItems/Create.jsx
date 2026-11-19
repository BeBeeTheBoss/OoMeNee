import MenuItemForm from '@/Components/ShopAdmin/MenuItemForm';
import ShopAdminLayout from '@/Layouts/ShopAdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ shop, categories }) {
    const { data, setData, post, processing, errors } = useForm({ name: '', category: '', description: '', price: '', image: null, is_available: true });
    const submit = (event) => { event.preventDefault(); post(route('shop-admin.menu-items.store', shop.menu_slug), { forceFormData: true }); };

    return <><Head title={`Add Menu Item · ${shop.name}`} /><ShopAdminLayout shop={shop}><div className="mx-auto max-w-4xl"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b5cff]">New menu item</p><h1 className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:mt-3 sm:text-[1.65rem]">Add item</h1><p className="mt-2 text-[13px] leading-5 text-black/45 sm:text-[14px]">Menu မှာပြမယ့် item အချက်အလက်တွေကို ဖြည့်ပါ။</p><form onSubmit={submit} className="mt-6 sm:mt-8"><MenuItemForm shop={shop} data={data} setData={setData} errors={errors} processing={processing} submitLabel="Create menu item" categories={categories} /></form></div></ShopAdminLayout></>;
}
