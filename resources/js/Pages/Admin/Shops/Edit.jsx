import AdminShopForm from '@/Components/AdminShopForm';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Edit({ shop }) {
    return <><Head title={`Edit ${shop.name}`} /><AdminLayout><AdminShopForm shop={shop} /></AdminLayout></>;
}
