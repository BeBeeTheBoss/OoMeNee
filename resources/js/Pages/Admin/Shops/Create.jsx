import AdminShopForm from '@/Components/AdminShopForm';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Create() {
    return <><Head title="Create Shop" /><AdminLayout><AdminShopForm /></AdminLayout></>;
}
