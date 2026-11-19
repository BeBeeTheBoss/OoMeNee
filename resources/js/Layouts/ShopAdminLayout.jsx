import { Link, usePage } from '@inertiajs/react';

export default function ShopAdminLayout({ shop, children }) {
    const { shop_auth: shopAuth } = usePage().props;

    return (
        <div className="admin-typography shop-admin-typography min-h-screen overflow-x-hidden bg-[#f8f8f6] font-sans text-[#181a1f] selection:bg-[#6b5cff] selection:text-white">
            <header className="sticky top-0 z-40 border-b border-black/6 bg-[#f8f8f6]/92 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8">
                    <Link href={route('shop-admin.menu-items.index', shop.menu_slug)} className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
                        <img src={shop.logo_url} alt={`${shop.name} logo`} className="size-9 shrink-0 rounded-xl border border-black/6 bg-white object-cover sm:size-10" />
                        <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold sm:text-[14px]">{shop.name}</p>
                            <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.13em] text-[#6b5cff] sm:text-[10px] sm:tracking-[0.15em]">Menu workspace</p>
                        </div>
                    </Link>
                    <div className="flex shrink-0 items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[#e5e2da] bg-white px-2.5 py-2 text-[9px] font-semibold tracking-normal text-black/45 shadow-sm sm:px-3">
                            <span className="size-1.5 rounded-full bg-[#f59e0b]" />
                            <span className="hidden md:inline">Expire date</span>
                            <span className="text-[#181a1f]">{shop.expires_at ?? '—'}</span>
                        </span>
                        <a href={shop.menu_url} target="_blank" rel="noreferrer" className="flex size-10 items-center justify-center rounded-full border border-black/6 bg-white text-black/45 transition hover:text-[#6b5cff] sm:h-auto sm:w-auto sm:px-4 sm:py-2.5 sm:text-[11px] sm:font-bold" aria-label="View public menu">
                            <svg aria-hidden="true" className="size-4 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 5h5v5M10 14 19 5M19 14v5H5V5h5" /></svg>
                            <span className="hidden sm:inline">View menu ↗</span>
                        </a>
                        <div className="hidden items-center gap-2 rounded-full bg-[#181a1f] py-1.5 pl-2 pr-3 text-white sm:flex">
                            <span className="flex size-7 items-center justify-center rounded-full bg-[#6b5cff] text-[11px] font-bold">{shopAuth.user.name.charAt(0).toUpperCase()}</span>
                            <span className="max-w-28 truncate text-[11px] font-bold">{shopAuth.user.name}</span>
                        </div>
                        <Link href={route('shop-admin.logout', shop.menu_slug)} method="post" as="button" className="flex size-10 items-center justify-center rounded-full border border-black/6 bg-white text-black/35 transition hover:bg-[#ffe8df] hover:text-black" aria-label="Log out">
                            <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 17l5-5-5-5M15 12H3M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /></svg>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-6 sm:px-8 sm:py-12">{children}</main>
        </div>
    );
}
