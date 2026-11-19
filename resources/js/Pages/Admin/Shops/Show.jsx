import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function CopyLink({ href, label }) {
    const copy = async () => {
        await navigator.clipboard.writeText(href);
    };

    return (
        <div className="rounded-2xl border border-black/6 bg-[#f7f7f3] p-4 transition hover:border-[#6b5cff]/20 hover:bg-[#eeeaff]/45">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/30">{label}</p>
            <div className="mt-2 flex items-center gap-2">
                <a href={href} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-[12px] font-bold text-[#6b5cff] hover:underline">{href}</a>
                <button type="button" onClick={copy} className="shrink-0 rounded-xl border border-black/6 bg-white px-3 py-2 text-[9px] font-bold text-black/45 shadow-sm transition hover:border-[#6b5cff]/25 hover:text-[#6b5cff]">Copy</button>
            </div>
        </div>
    );
}

export default function Show({ shop }) {
    const { flash } = usePage().props;
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('admin.shops.admins.store', shop.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsAdminModalOpen(false);
            },
        });
    };

    const openAdminModal = () => {
        clearErrors();
        setIsAdminModalOpen(true);
    };

    const closeAdminModal = () => {
        if (processing) {
            return;
        }

        reset();
        clearErrors();
        setIsAdminModalOpen(false);
    };

    useEffect(() => {
        if (!isAdminModalOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeAdminModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAdminModalOpen, processing]);

    const removeAdmin = (admin) => {
        if (!window.confirm(`“${admin.name}” account ကို ဖျက်မှာ သေချာပါသလား?`)) {
            return;
        }

        router.delete(route('admin.shops.admins.destroy', [shop.id, admin.id]), { preserveScroll: true });
    };

    return (
        <>
            <Head title={`${shop.name} · Shop details`} />
            <AdminLayout>
                {flash.success && (
                    <div className="mb-7 flex items-center gap-3 rounded-2xl border border-black/5 bg-[#e8f5d0] px-4 py-3.5 text-[13px] font-bold text-[#345227]">
                        <span className="flex size-6 items-center justify-center rounded-full bg-white/70">✓</span>{flash.success}
                    </div>
                )}

                <div className="flex items-center justify-between gap-4">
                    <Link href={route('admin.shops.index')} className="group inline-flex items-center gap-2.5 text-[11px] font-bold text-black/40 transition hover:text-[#6b5cff]"><span className="grid size-8 place-items-center rounded-xl border border-black/6 bg-white shadow-sm group-hover:bg-[#eeeaff]">←</span>Back to shops</Link>
                    <Link href={route('admin.shops.edit', shop.id)} className="inline-flex items-center gap-2 rounded-lg bg-[#181a1f] px-4 py-3 text-[10px] font-bold text-white hover:bg-black/80">
                        <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m14 5 5 5M4 20l4-1 11-11-4-4L4 15v5Z" /></svg>
                        Edit shop
                    </Link>
                </div>

                <div className="mx-auto mt-7 max-w-5xl">
                    <div className="space-y-6">
                        <section className="overflow-hidden rounded-xl border border-black/8 bg-white">
                            <div className="border-b border-black/8 p-6 sm:p-7">
                                <div className="flex items-center gap-4">
                                    <img src={shop.logo_url} alt={`${shop.name} logo`} className="size-16 rounded-2xl border border-white/60 bg-white object-cover shadow-sm" />
                                    <div className="min-w-0">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${shop.status === 'active' ? 'bg-[#e8f5d0] text-[#345227]' : 'bg-[#ffe8df] text-[#7a4637]'}`}>{shop.status === 'active' ? 'Active' : 'Trial'}</span>
                                        <h1 className="mt-3 truncate text-xl font-bold tracking-[-0.04em] sm:text-2xl">{shop.name}</h1>
                                        <p className="mt-1 text-[10px] text-black/40">Access ends {shop.expires_at ?? '—'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                                <CopyLink href={shop.menu_url} label="Public menu" />
                                <CopyLink href={shop.admin_url} label="Shop admin login" />
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-xl border border-black/8 bg-white">
                            <div className="flex items-center justify-between border-b border-black/6 px-5 py-5 sm:px-6">
                                <div>
                                    <h2 className="text-[13px] font-bold">Shop admins</h2>
                                    <p className="mt-1 text-[11px] text-black/35">ဒီဆိုင်ရဲ့ menu ကို စီမံနိုင်မယ့် accounts များ</p>
                                </div>
                                <span className="rounded-xl bg-[#eeeaff] px-3 py-2 text-[9px] font-bold text-[#6b5cff]">{shop.shop_admins.length} accounts</span>
                            </div>
                            {shop.shop_admins.length ? (
                                <div className="divide-y divide-black/6">
                                    {shop.shop_admins.map((admin) => (
                                        <div key={admin.id} className="flex items-center gap-3 px-5 py-4 sm:px-6">
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5d0] text-[13px] font-bold text-[#345227]">{admin.name.charAt(0).toUpperCase()}</span>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[13px] font-bold">{admin.name}</p>
                                                <p className="mt-1 truncate text-[11px] text-black/35">{admin.email} · Added {admin.created_at}</p>
                                            </div>
                                            <button type="button" onClick={() => removeAdmin(admin)} className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-100 text-red-400 transition hover:bg-red-50" aria-label={`Delete ${admin.name}`}>
                                                <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center"><p className="text-[13px] font-bold">Admin account မရှိသေးပါ</p><p className="mt-2 text-[11px] text-black/35">အောက်က + button ကိုနှိပ်ပြီး account အသစ်ထည့်နိုင်ပါတယ်။</p></div>
                            )}
                            <div className="flex justify-center border-t border-black/6 px-5 py-5 sm:px-6">
                                <button type="button" onClick={openAdminModal} className="inline-flex items-center gap-2 rounded-lg border border-black/8 px-4 py-2.5 text-[10px] font-bold hover:bg-[#f1f0ed]">
                                    <span className="text-base font-medium leading-none">+</span>
                                    Add shop admin
                                </button>
                            </div>
                        </section>
                    </div>
                </div>

                {isAdminModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181a1f]/45 p-4" onMouseDown={closeAdminModal}>
                        <section role="dialog" aria-modal="true" aria-labelledby="add-shop-admin-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-xl border border-black/8 bg-white shadow-2xl">
                            <div className="p-6 sm:p-8">
                            <div className="flex items-start justify-between gap-5">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b5cff]">New access</p>
                                    <h2 id="add-shop-admin-title" className="mt-2 text-xl font-bold tracking-[-0.03em]">Add shop admin</h2>
                                    <p className="mt-2 text-[12px] leading-5 text-black/40">ဒီ account နဲ့ shop admin URL ကနေ menu တွေကို စီမံနိုင်ပါမယ်။</p>
                                </div>
                                <button type="button" onClick={closeAdminModal} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f3f0] text-lg text-black/40 transition hover:bg-[#eeeaff] hover:text-[#6b5cff]" aria-label="Close add admin dialog">×</button>
                            </div>

                            <form onSubmit={submit} className="mt-7 grid gap-4">
                                {[
                                    ['name', 'Name', 'Restaurant manager'],
                                    ['email', 'Email', 'manager@example.com'],
                                    ['password', 'Password', 'Minimum 8 characters'],
                                ].map(([field, label, placeholder], index) => (
                                    <label key={field}>
                                        <span className="text-[11px] font-bold text-black/65">{label}</span>
                                        <input autoFocus={index === 0} type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} value={data[field]} onChange={(event) => setData(field, event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-2xl border-black/8 bg-[#f8f8f6] px-4 py-3.5 text-[13px] outline-none placeholder:text-black/25 focus:border-[#6b5cff] focus:ring-[#6b5cff]" />
                                        {errors[field] && <span className="mt-1.5 block text-[11px] font-semibold text-red-500">{errors[field]}</span>}
                                    </label>
                                ))}

                                <div className="mt-3 flex justify-end gap-3 border-t border-black/6 pt-5">
                                    <button type="button" onClick={closeAdminModal} className="rounded-full px-4 py-3 text-[12px] font-bold text-black/40 transition hover:bg-black/4 hover:text-black">Cancel</button>
                                    <button type="submit" disabled={processing} className="rounded-lg bg-[#181a1f] px-6 py-3 text-[10px] font-bold text-white hover:bg-black/80 disabled:opacity-50">{processing ? 'Adding…' : 'Add admin'}</button>
                                </div>
                            </form>
                            </div>
                        </section>
                    </div>
                )}
            </AdminLayout>
        </>
    );
}
