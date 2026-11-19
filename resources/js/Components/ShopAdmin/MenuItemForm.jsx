import { Link } from '@inertiajs/react';

const fieldClass = 'mt-2.5 w-full rounded-2xl border-black/8 bg-[#f8f8f6] px-4 py-3.5 text-base placeholder:text-black/25 focus:border-[#6b5cff] focus:ring-[#6b5cff] sm:text-[14px]';

export default function MenuItemForm({ shop, data, setData, errors, processing, submitLabel, imageUrl, categories = [] }) {
    const categoryQuery = data.category.trim().toLocaleLowerCase();
    const filteredCategories = categoryQuery
        ? categories.filter((category) => category.toLocaleLowerCase().includes(categoryQuery))
        : categories;

    return (
        <section className="overflow-hidden rounded-[1.5rem] border border-black/6 bg-white shadow-[0_12px_40px_rgba(24,26,31,0.04)] sm:rounded-[2rem]">
            <div className="p-4 sm:p-7">
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block"><span className="text-[12px] font-bold text-black/55">Item name</span><input value={data.name} onChange={(event) => setData('name', event.target.value)} placeholder="e.g. Signature fried rice" className={fieldClass} />{errors.name && <span className="mt-1.5 block text-[12px] text-red-500">{errors.name}</span>}</label>
                    <div className="min-w-0">
                        <label className="block"><span className="text-[12px] font-bold text-black/55">Category</span><input value={data.category} onChange={(event) => setData('category', event.target.value)} placeholder="e.g. Main dishes" className={fieldClass} />{errors.category && <span className="mt-1.5 block text-[12px] text-red-500">{errors.category}</span>}</label>
                        {categories.length > 0 && (
                            <div className="mt-3 min-w-0">
                                <p className="text-[11px] font-semibold text-black/35">ထည့်ပြီးသား category ကို ရွေးပါ</p>
                                {filteredCategories.length ? (
                                    <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1">
                                        {filteredCategories.map((category) => (
                                            <button key={category} type="button" onClick={() => setData('category', category)} aria-pressed={data.category === category} className={`shrink-0 rounded-full border px-3 py-2 text-[11px] font-bold transition ${data.category === category ? 'border-[#6b5cff] bg-[#6b5cff] text-white' : 'border-black/7 bg-white text-black/45 hover:border-[#6b5cff]/30 hover:text-[#6b5cff]'}`}>
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-2 rounded-xl bg-[#f8f8f6] px-3 py-2.5 text-[11px] text-black/40">ကိုက်ညီတဲ့ category မရှိသေးပါ။ အသစ်အဖြစ် ဆက်ရေးနိုင်ပါတယ်။</p>
                                )}
                            </div>
                        )}
                    </div>
                    <label className="block sm:col-span-2"><span className="text-[12px] font-bold text-black/55">Description</span><textarea value={data.description} onChange={(event) => setData('description', event.target.value)} rows="4" placeholder="Short description of the menu item" className={fieldClass} />{errors.description && <span className="mt-1.5 block text-[12px] text-red-500">{errors.description}</span>}</label>
                    <label className="block"><span className="text-[12px] font-bold text-black/55">Price (MMK)</span><input type="number" min="0" inputMode="numeric" value={data.price} onChange={(event) => setData('price', event.target.value)} placeholder="10000" className={fieldClass} />{errors.price && <span className="mt-1.5 block text-[12px] text-red-500">{errors.price}</span>}</label>
                    <label className="block"><span className="text-[12px] font-bold text-black/55">Photo</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setData('image', event.target.files[0])} className={`${fieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-[#eeeaff] file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:text-[#6b5cff]`} />{errors.image && <span className="mt-1.5 block text-[12px] text-red-500">{errors.image}</span>}</label>
                </div>

                {imageUrl && (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-black/6 bg-[#f8f8f6] p-3">
                        <img src={imageUrl} alt="Current menu item" className="size-16 shrink-0 rounded-xl object-cover" />
                        <div className="min-w-0"><p className="text-[12px] font-bold">Current photo</p><p className="mt-1 text-[11px] text-black/40">Photo အသစ်မရွေးရင် ဒီပုံကို ဆက်သုံးပါမယ်။</p></div>
                    </div>
                )}

                <div className="mt-6 border-t border-black/6 pt-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b5cff]">Availability</p>
                    <button type="button" role="switch" aria-checked={data.is_available} onClick={() => setData('is_available', !data.is_available)} className={`mt-3 flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${data.is_available ? 'border-[#8fcb58]/35 bg-[#eff8df]' : 'border-black/7 bg-[#f3f3f0]'}`}>
                        <span>
                            <span className="block text-[14px] font-bold">{data.is_available ? 'Visible on public menu' : 'Hidden from public menu'}</span>
                            <span className="mt-1 block text-[12px] text-black/45">{data.is_available ? 'Customers can see this item' : 'Customers cannot see this item'}</span>
                        </span>
                        <span className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition ${data.is_available ? 'bg-[#6b5cff]' : 'bg-black/15'}`}>
                            <span className={`block size-5 rounded-full bg-white shadow-sm transition-transform ${data.is_available ? 'translate-x-5' : 'translate-x-0'}`} />
                        </span>
                    </button>
                    {errors.is_available && <span className="mt-1.5 block text-[12px] text-red-500">{errors.is_available}</span>}
                </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-black/6 bg-[#fafaf8] p-4 sm:flex-row sm:items-center sm:justify-end sm:p-6">
                <Link href={route('shop-admin.menu-items.index', shop.menu_slug)} className="flex min-h-12 items-center justify-center rounded-full px-6 text-[13px] font-bold text-black/40 transition hover:bg-black/4 hover:text-black">Cancel</Link>
                <button disabled={processing} className="min-h-12 rounded-full bg-[#6b5cff] px-7 py-3.5 text-[14px] font-bold text-white shadow-[0_10px_24px_rgba(107,92,255,0.2)] transition hover:bg-[#584ce5] disabled:opacity-50">{processing ? 'Saving…' : submitLabel}</button>
            </div>
        </section>
    );
}
