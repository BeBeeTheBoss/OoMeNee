import { Link, usePage } from '@inertiajs/react';

function StoreIcon() {
    return <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 10h16v10H4V10Z" /><path d="m3 10 2-6h14l2 6M8 20v-6h5v6" /></svg>;
}

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <div className="admin-typography min-h-screen bg-[#f7f7f5] font-sans text-[#181a1f] lg:grid lg:grid-cols-[240px_1fr]">
            <aside className="sticky top-0 hidden h-screen border-r border-black/8 bg-white lg:flex lg:flex-col">
                <Link href={route('admin.shops.index')} className="flex h-[76px] items-center gap-3 border-b border-black/8 px-6">
                    <img src="/images/brand/oomenee-icon.png" alt="OoMeNee" className="size-9 object-contain" />
                    <div><p className="text-[15px] font-bold tracking-[-0.03em]">OoMeNee</p><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35">Admin</p></div>
                </Link>

                <nav className="p-4">
                    <p className="px-3 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-black/30">Management</p>
                    <Link href={route('admin.shops.index')} className="flex items-center gap-3 rounded-lg bg-[#f1f0ed] px-3 py-3 text-[12px] font-bold">
                        <StoreIcon />
                        <span>Shops</span>
                    </Link>
                </nav>

                <div className="mt-auto border-t border-black/8 p-4">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#181a1f] text-[11px] font-bold text-white">{auth.user.name.charAt(0).toUpperCase()}</span>
                        <div className="min-w-0"><p className="truncate text-[11px] font-bold">{auth.user.name}</p><p className="mt-0.5 truncate text-[9px] text-black/35">{auth.user.email}</p></div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <Link href="/" className="rounded-lg border border-black/8 px-3 py-2 text-center text-[9px] font-bold text-black/45 hover:bg-[#f1f0ed]">Website</Link>
                        <Link href={route('admin.logout')} method="post" as="button" className="rounded-lg border border-black/8 px-3 py-2 text-[9px] font-bold text-black/45 hover:bg-[#f1f0ed]">Log out</Link>
                    </div>
                </div>
            </aside>

            <main className="min-w-0">
                <header className="sticky top-0 z-40 border-b border-black/8 bg-white/95 backdrop-blur">
                    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                        <div className="flex items-center gap-3 lg:hidden"><img src="/images/brand/oomenee-icon.png" alt="OoMeNee" className="size-9 object-contain" /><div><p className="text-[14px] font-bold">OoMeNee</p><p className="text-[9px] uppercase tracking-[0.14em] text-black/30">Admin</p></div></div>
                        <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-black/35 lg:block">Restaurant management</p>
                        <div className="flex items-center gap-2">
                            <Link href={route('admin.shops.index')} className="grid size-9 place-items-center rounded-lg border border-black/8 bg-white text-black/45 lg:hidden" aria-label="Shops"><StoreIcon /></Link>
                            <span className="grid size-9 place-items-center rounded-full bg-[#f1f0ed] text-[10px] font-bold">{auth.user.name.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                </header>
                <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</div>
            </main>
        </div>
    );
}
