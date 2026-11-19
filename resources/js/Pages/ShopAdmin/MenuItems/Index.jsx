import MenuQrModal from '@/Components/ShopAdmin/MenuQrModal';
import ShopAdminLayout from '@/Layouts/ShopAdminLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const money = (value) => new Intl.NumberFormat('en-US').format(value);
const themePresets = ['#1F573F', '#6B5CFF', '#B45309', '#BE123C', '#0369A1', '#181A1F'];

export default function Index({ shop, menu_items: menuItems }) {
    const { flash } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [qrOpen, setQrOpen] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);
    const themeForm = useForm({ theme_color: shop.theme_color || '#1F573F' });
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    const filteredItems = normalizedQuery
        ? menuItems.filter((item) => [item.name, item.category, item.description, item.price]
            .filter(Boolean)
            .some((value) => String(value).toLocaleLowerCase().includes(normalizedQuery)))
        : menuItems;

    const removeItem = (item) => {
        if (!window.confirm(`“${item.name}” ကို ဖျက်မှာ သေချာပါသလား?`)) {
            return;
        }
        router.delete(route('shop-admin.menu-items.destroy', [shop.menu_slug, item.id]), { preserveScroll: true });
    };

    const saveTheme = (event) => {
        event.preventDefault();
        themeForm.patch(route('shop-admin.theme.update', shop.menu_slug), {
            preserveScroll: true,
            onSuccess: () => setThemeOpen(false),
        });
    };

    return (
        <>
            <Head title={`${shop.name} Menu Items`} />
            <ShopAdminLayout shop={shop}>
                {flash.success && <div className="mb-5 rounded-2xl bg-[#e8f5d0] px-4 py-3.5 text-[13px] font-bold text-[#345227] sm:mb-6">✓ {flash.success}</div>}
                <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6b5cff]">Menu management</p>
                        <h1 className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:mt-3 sm:text-[1.65rem]">Menu items</h1>
                        <p className="mt-2 max-w-lg text-[13px] leading-5 text-black/45 sm:text-[14px]">အစားအသောက်နဲ့ သောက်စရာတွေကို ဒီနေရာမှာ စီမံနိုင်ပါတယ်။</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                        <button type="button" onClick={() => setQrOpen(true)} className="flex size-11 items-center justify-center rounded-full border border-black/7 bg-white text-black/45 shadow-sm transition hover:-translate-y-0.5 hover:border-[#6b5cff]/25 hover:text-[#6b5cff] lg:h-auto lg:w-auto lg:gap-2 lg:px-4 lg:py-3" aria-label="Show public menu QR code">
                            <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v6h-6v-2M14 18h2" /></svg>
                            <span className="hidden text-[12px] font-bold lg:inline">QR code</span>
                        </button>
                        <button type="button" onClick={() => setThemeOpen(true)} className="flex size-11 items-center justify-center rounded-full border border-black/7 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#6b5cff]/25 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3" aria-label="Change menu theme">
                            <span className="size-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" style={{ backgroundColor: themeForm.data.theme_color }} />
                            <span className="hidden text-[12px] font-bold text-black/55 sm:inline">Theme</span>
                        </button>
                        <Link href={route('shop-admin.menu-items.create', shop.menu_slug)} className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#6b5cff] py-1.5 pl-4 pr-1.5 text-[12px] font-bold text-white shadow-[0_12px_30px_rgba(107,92,255,0.2)] transition hover:-translate-y-0.5 sm:h-auto sm:gap-3 sm:py-2 sm:pl-5 sm:pr-2 sm:text-[13px]">
                            <span>Add item</span>
                            <span className="flex size-8 items-center justify-center rounded-full bg-white/15 text-base transition group-hover:rotate-90">＋</span>
                        </Link>
                    </div>
                </div>

                <section className="-mx-2 mt-6 min-w-0 max-w-none overflow-hidden rounded-[1.5rem] border border-black/6 bg-white shadow-[0_12px_40px_rgba(24,26,31,0.04)] sm:mx-0 sm:mt-8 sm:max-w-full sm:rounded-[2rem]">
                    <div className="flex items-center justify-between gap-4 border-b border-black/6 px-4 py-4 sm:px-6 sm:py-5">
                        <div className="min-w-0"><h2 className="text-[15px] font-bold">All items</h2><p className="mt-1 truncate text-[12px] text-black/40">Hidden items ကို public menu မှာ မပြပါဘူး။</p></div>
                        <span className="shrink-0 rounded-full bg-[#eeeaff] px-3 py-1.5 text-[11px] font-bold text-[#6b5cff]">{normalizedQuery ? `${filteredItems.length} of ${menuItems.length}` : `${menuItems.length} items`}</span>
                    </div>
                    {menuItems.length > 0 && (
                        <div className="border-b border-black/6 px-4 py-4 sm:px-6">
                            <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-black/7 bg-[#f8f8f6] px-4 transition focus-within:border-[#6b5cff]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#6b5cff]/10">
                                <svg aria-hidden="true" className="size-5 shrink-0 text-black/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
                                <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Menu name၊ category နဲ့ ရှာရန်…" className="min-w-0 flex-1 border-0 bg-transparent p-0 text-base placeholder:text-black/30 focus:ring-0 sm:text-[14px]" />
                                {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-lg text-black/35 shadow-sm transition hover:text-[#6b5cff]" aria-label="Clear search">×</button>}
                            </label>
                        </div>
                    )}
                    {filteredItems.length ? (
                        <>
                            <div className="grid min-w-0 max-w-full gap-2.5 overflow-hidden bg-[#f3f3f0] p-2 md:hidden">
                                {filteredItems.map((item) => (
                                    <article key={item.id} className="min-w-0 max-w-full overflow-hidden rounded-[1.35rem] border border-black/5 bg-white p-3.5 shadow-[0_8px_24px_rgba(24,26,31,0.04)]">
                                        <div className="flex min-w-0 items-start gap-3.5">
                                            {item.image_url ? <img src={item.image_url} alt="" className="size-[76px] shrink-0 rounded-2xl object-cover" /> : <span className="flex size-[76px] shrink-0 items-center justify-center rounded-2xl bg-[#eeeaff] text-xl text-[#6b5cff]">✦</span>}
                                            <div className="min-w-0 flex-1">
                                                <span className="inline-flex max-w-full rounded-full bg-[#f3f3f0] px-2.5 py-1 text-[10px] font-bold text-black/45">
                                                    <span className="truncate">{item.category}</span>
                                                </span>
                                                <h3 className="mt-2 line-clamp-2 break-words text-[16px] font-bold leading-6 tracking-[-0.02em]">{item.name}</h3>
                                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                                    <p className="text-[15px] font-bold text-[#6b5cff]">{money(item.price)} Ks</p>
                                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.is_available ? 'bg-[#e8f5d0] text-[#345227]' : 'bg-[#f1f1ee] text-black/35'}`}>{item.is_available ? 'Available' : 'Hidden'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mt-3 line-clamp-2 min-w-0 break-words text-[12px] leading-5 text-black/40">{item.description || 'No description'}</p>
                                        <div className="mt-3.5 grid w-full min-w-0 grid-cols-2 gap-2 border-t border-black/6 pt-3">
                                            <Link href={route('shop-admin.menu-items.edit', [shop.menu_slug, item.id])} className="flex min-h-11 min-w-0 items-center justify-center rounded-full bg-[#eeeaff] px-3 text-[13px] font-bold text-[#6b5cff] transition active:scale-[0.98]">Edit</Link>
                                            <button type="button" onClick={() => removeItem(item)} className="min-h-11 min-w-0 rounded-full bg-red-50 px-3 text-[13px] font-bold text-red-500 transition active:scale-[0.98]">Delete</button>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full min-w-[760px] text-left">
                                    <thead><tr className="border-b border-black/6 bg-[#f5f5f2] text-[10px] font-bold uppercase tracking-[0.12em] text-black/30"><th className="px-5 py-3 sm:px-6">Item</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 sm:pr-6">Actions</th></tr></thead>
                                    <tbody>{filteredItems.map((item) => (
                                        <tr key={item.id} className="border-b border-black/6 last:border-0 hover:bg-[#f8f8f6]">
                                            <td className="px-5 py-4 sm:px-6"><div className="flex items-center gap-3">{item.image_url ? <img src={item.image_url} alt="" className="size-12 rounded-xl object-cover" /> : <span className="flex size-12 items-center justify-center rounded-xl bg-[#eeeaff] text-[#6b5cff]">✦</span>}<div className="min-w-0"><p className="max-w-64 truncate text-[13px] font-bold">{item.name}</p><p className="mt-1 max-w-64 truncate text-[11px] text-black/35">{item.description || 'No description'}</p></div></div></td>
                                            <td className="px-5 py-4 text-[11px] font-semibold text-black/45">{item.category}</td>
                                            <td className="px-5 py-4 text-[12px] font-bold">{money(item.price)} Ks</td>
                                            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${item.is_available ? 'bg-[#e8f5d0] text-[#345227]' : 'bg-[#f1f1ee] text-black/35'}`}>{item.is_available ? 'Available' : 'Hidden'}</span></td>
                                            <td className="px-5 py-4 sm:pr-6"><div className="flex gap-2"><Link href={route('shop-admin.menu-items.edit', [shop.menu_slug, item.id])} className="rounded-full border border-black/6 bg-white px-4 py-2 text-[10px] font-bold text-black/45 transition hover:text-[#6b5cff]">Edit</Link><button type="button" onClick={() => removeItem(item)} className="rounded-full border border-red-100 px-4 py-2 text-[10px] font-bold text-red-400 transition hover:bg-red-50">Delete</button></div></td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </>
                    ) : menuItems.length ? (
                        <div className="px-6 py-14 text-center sm:py-16">
                            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#6b5cff]"><svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg></span>
                            <h2 className="mt-5 text-[16px] font-bold">ရှာနေတဲ့ menu မတွေ့ပါ</h2>
                            <p className="mt-2 text-[13px] text-black/40">တခြားနာမည် ဒါမှမဟုတ် category နဲ့ ထပ်ရှာကြည့်ပါ။</p>
                            <button type="button" onClick={() => setSearchQuery('')} className="mt-5 rounded-full bg-[#eeeaff] px-5 py-3 text-[13px] font-bold text-[#6b5cff]">Clear search</button>
                        </div>
                    ) : (
                        <div className="px-6 py-14 text-center sm:py-16"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eeeaff] text-xl text-[#6b5cff]">＋</span><h2 className="mt-5 text-[16px] font-bold">Menu item မရှိသေးပါ</h2><p className="mt-2 text-[13px] text-black/40">Add item button ကနေ ပထမဆုံး item ကို ထည့်ပါ။</p></div>
                    )}
                </section>

                <MenuQrModal open={qrOpen} onClose={() => setQrOpen(false)} shop={shop} />

                {themeOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181a1f]/45 px-4 py-8 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setThemeOpen(false); }}>
                        <form onSubmit={saveTheme} className="w-full max-w-md rounded-[1.75rem] bg-white p-5 shadow-[0_28px_90px_rgba(24,26,31,0.28)] sm:p-7" role="dialog" aria-modal="true" aria-labelledby="theme-dialog-title">
                            <div className="flex items-start justify-between gap-5">
                                <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b5cff]">Menu appearance</p><h2 id="theme-dialog-title" className="mt-2 text-xl font-bold tracking-[-0.035em]">Theme color</h2><p className="mt-2 text-[12px] leading-5 text-black/40">Customer တွေမြင်ရတဲ့ menu ရဲ့ အဓိကအရောင်ကို ရွေးပါ။</p></div>
                                <button type="button" onClick={() => setThemeOpen(false)} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f3f0] text-lg text-black/35" aria-label="Close theme settings">×</button>
                            </div>

                            <div className="mt-6 grid grid-cols-6 gap-2.5">
                                {themePresets.map((color) => (
                                    <button key={color} type="button" onClick={() => themeForm.setData('theme_color', color)} className={`aspect-square rounded-2xl border-4 transition hover:scale-105 ${themeForm.data.theme_color === color ? 'border-[#181a1f]' : 'border-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]'}`} style={{ backgroundColor: color }} aria-label={`Use ${color}`} />
                                ))}
                            </div>

                            <label className="mt-5 flex items-center gap-3 rounded-2xl border border-black/7 bg-[#f8f8f6] p-3.5 focus-within:border-[#6b5cff]/35">
                                <input type="color" value={/^#[0-9A-F]{6}$/i.test(themeForm.data.theme_color) ? themeForm.data.theme_color : '#1F573F'} onChange={(event) => themeForm.setData('theme_color', event.target.value.toUpperCase())} className="size-10 shrink-0 cursor-pointer rounded-xl border-0 bg-transparent p-0" aria-label="Choose a custom theme color" />
                                <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-black/30">Custom color</span><input value={themeForm.data.theme_color} onChange={(event) => themeForm.setData('theme_color', event.target.value.toUpperCase())} maxLength={7} className="mt-1 w-full border-0 bg-transparent p-0 text-[14px] font-bold uppercase focus:ring-0" aria-label="Theme color hex value" /></span>
                            </label>
                            {themeForm.errors.theme_color && <p className="mt-2 text-[11px] font-semibold text-red-500">Hex color ကို #1F573F ပုံစံနဲ့ ထည့်ပါ။</p>}

                            <div className="mt-5 rounded-2xl bg-[#f4f2eb] p-3.5">
                                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/30">Preview</p>
                                <div className="mt-3 flex items-center gap-2"><span className="rounded-xl px-3 py-2 text-[10px] font-bold text-white" style={{ backgroundColor: themeForm.data.theme_color }}>အားလုံး</span><span className="rounded-xl bg-white px-3 py-2 text-[10px] font-bold text-black/40">အစားအစာ</span></div>
                                <div className="mt-3 flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"><span className="text-[12px] font-bold">Signature menu</span><span className="rounded-lg px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: `${themeForm.data.theme_color}14`, color: themeForm.data.theme_color }}>5,500 ကျပ်</span></div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-2.5">
                                <button type="button" onClick={() => setThemeOpen(false)} className="min-h-12 rounded-full bg-[#f3f3f0] px-5 text-[12px] font-bold text-black/45">Cancel</button>
                                <button type="submit" disabled={themeForm.processing} className="min-h-12 rounded-full bg-[#181a1f] px-5 text-[12px] font-bold text-white transition hover:bg-[#6b5cff] disabled:opacity-50">{themeForm.processing ? 'Saving…' : 'Save theme'}</button>
                            </div>
                        </form>
                    </div>
                )}
            </ShopAdminLayout>
        </>
    );
}
