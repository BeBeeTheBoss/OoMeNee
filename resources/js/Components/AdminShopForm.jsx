import { Link, useForm } from '@inertiajs/react';

function FieldError({ message }) {
    return message ? <span className="mt-2 block text-[11px] font-semibold text-red-500">{message}</span> : null;
}

export default function AdminShopForm({ shop = null }) {
    const isEditing = Boolean(shop);
    const { data, setData, post, processing, errors } = useForm({
        ...(isEditing ? { _method: 'patch' } : {}), name: shop?.name ?? '', menu_slug: shop?.menu_slug ?? '', logo: null,
        status: shop?.status ?? 'trial', duration_type: shop?.duration_type ?? 'quick', duration_months: shop?.duration_months ?? 1, expires_at: shop?.expires_at ?? '',
    });

    const updateMenuSlug = (value) => setData('menu_slug', value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-'));
    const selectDurationType = (durationType) => setData({ ...data, duration_type: durationType, duration_months: durationType === 'quick' ? (data.duration_months ?? 1) : null, expires_at: durationType === 'custom' ? data.expires_at : '' });
    const submit = (event) => { event.preventDefault(); post(isEditing ? route('admin.shops.update', shop.id) : route('admin.shops.store'), { forceFormData: true }); };
    const backUrl = isEditing ? route('admin.shops.show', shop.id) : route('admin.shops.index');

    return (
        <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between gap-4">
                <Link href={backUrl} className="group inline-flex items-center gap-2.5 text-[11px] font-bold text-black/40 transition hover:text-[#6b5cff]"><span className="grid size-8 place-items-center rounded-xl border border-black/6 bg-white shadow-sm transition group-hover:border-[#6b5cff]/20 group-hover:bg-[#eeeaff]">←</span>{isEditing ? 'Shop details' : 'All shops'}</Link>
                <span className="hidden rounded-full border border-black/6 bg-white px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-black/35 sm:inline">{isEditing ? 'Editing restaurant' : 'New restaurant'}</span>
            </div>

            <div className="mt-8 grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
                <div className="lg:sticky lg:top-28">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b5cff]">{isEditing ? 'Restaurant settings' : 'Create workspace'}</p>
                    <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.45] tracking-[-0.055em] sm:text-[2.2rem]">{isEditing ? 'ဆိုင်အချက်အလက် ပြင်ရန်' : 'ဆိုင်အသစ် ထည့်ရန်'}</h1>
                    <p className="mt-4 max-w-sm text-[13px] leading-7 text-black/45">ဆိုင်ရဲ့ identity၊ public menu URL၊ account status နဲ့ သက်တမ်းကို ဒီနေရာကနေ သတ်မှတ်နိုင်ပါတယ်။</p>
                    <div className="mt-7 border-y border-black/8 py-5">
                        <div className="flex items-center gap-3">{isEditing ? <img src={shop.logo_url} alt="" className="size-11 rounded-lg border border-black/8 bg-white object-cover" /> : <span className="grid size-11 place-items-center rounded-lg border border-black/8 bg-white text-lg">＋</span>}<div className="min-w-0"><p className="truncate text-[12px] font-bold">{data.name || 'Your restaurant'}</p><p className="mt-1 truncate text-[9px] text-black/35">/menu/{data.menu_slug || 'restaurant-name'}</p></div></div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-[10px]"><div><p className="text-black/35">Account</p><p className="mt-1 font-semibold capitalize">{data.status}</p></div><div><p className="text-black/35">Duration</p><p className="mt-1 font-semibold">{data.duration_type === 'quick' ? `${data.duration_months ?? 1} month` : 'Custom date'}</p></div></div>
                    </div>
                </div>

                <form onSubmit={submit} className="overflow-hidden rounded-xl border border-black/8 bg-white">
                    <section className="p-5 sm:p-7">
                        <div className="flex items-center gap-3 border-b border-black/6 pb-5"><span className="grid size-9 place-items-center rounded-xl bg-[#eeeaff] text-[11px] font-extrabold text-[#6b5cff]">01</span><div><h2 className="text-[13px] font-bold">Restaurant profile</h2><p className="mt-0.5 text-[10px] text-black/35">ဆိုင်နာမည်၊ URL နဲ့ logo</p></div></div>
                        <div className="mt-6 grid gap-5">
                            <label><span className="text-[12px] font-bold text-black/60">ဆိုင်နာမည်</span><input type="text" value={data.name} onChange={(event) => setData('name', event.target.value)} placeholder="ဥပမာ — The Green Table" autoFocus className="mt-2.5 w-full rounded-2xl border-black/8 bg-[#f7f7f3] px-4 py-4 text-[14px] placeholder:text-black/25 focus:border-[#6b5cff] focus:ring-4 focus:ring-[#6b5cff]/8" /><FieldError message={errors.name} /></label>
                            <label><span className="text-[12px] font-bold text-black/60">Menu URI</span><span className="mt-2.5 flex overflow-hidden rounded-2xl border border-black/8 bg-[#f7f7f3] transition focus-within:border-[#6b5cff] focus-within:ring-4 focus-within:ring-[#6b5cff]/8"><span className="flex items-center border-r border-black/6 bg-black/[0.025] px-3 text-[11px] font-bold text-black/30">/menu/</span><input type="text" value={data.menu_slug} onChange={(event) => updateMenuSlug(event.target.value)} placeholder="the-green-table" className="min-w-0 flex-1 border-0 bg-transparent px-3 py-4 text-[14px] placeholder:text-black/25 focus:ring-0" /></span><span className="mt-2 block text-[10px] leading-5 text-black/35">QR ကနေ ဖွင့်မယ့် unique public menu address ဖြစ်ပါတယ်။</span><FieldError message={errors.menu_slug} /></label>
                            <label><span className="text-[12px] font-bold text-black/60">ဆိုင် Logo</span><span className="mt-2.5 flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-black/12 bg-[#f7f7f3] p-4 transition hover:border-[#6b5cff]/35 hover:bg-[#eeeaff]/60">{isEditing ? <img src={shop.logo_url} alt={`${shop.name} logo`} className="size-12 rounded-xl border border-black/6 bg-white object-cover" /> : <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white text-[#6b5cff] shadow-sm">↑</span>}<span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-bold">{data.logo?.name ?? (isEditing ? 'Logo အသစ်ရွေးရန်' : 'Upload restaurant logo')}</span><span className="mt-1 block text-[10px] text-black/35">PNG, JPG or WebP · Max 2 MB</span></span><span className="rounded-xl border border-black/6 bg-white px-3 py-2 text-[9px] font-bold text-black/45">Browse</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setData('logo', event.target.files[0])} className="sr-only" /></span><FieldError message={errors.logo} /></label>
                        </div>
                    </section>

                    <section className="border-t border-black/8 bg-[#fafaf8] p-5 sm:p-7">
                        <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#e8f5d0] text-[11px] font-extrabold text-[#345227]">02</span><div><h2 className="text-[13px] font-bold">Access & subscription</h2><p className="mt-0.5 text-[10px] text-black/35">Account type နဲ့ duration</p></div></div>
                        <fieldset className="mt-6"><legend className="text-[12px] font-bold text-black/60">Account type</legend><div className="mt-2.5 grid grid-cols-2 gap-3">{[['trial', 'Trial', 'စမ်းသုံး account', '#ff8067'], ['active', 'Active', 'ပုံမှန် account', '#76b84b']].map(([value, title, subtitle, color]) => <label key={value} className={`cursor-pointer rounded-2xl border p-4 transition ${data.status === value ? 'border-[#6b5cff] bg-[#eeeaff]' : 'border-black/7 bg-white hover:border-black/15'}`}><input type="radio" name="status" value={value} checked={data.status === value} onChange={(event) => setData('status', event.target.value)} className="sr-only" /><span className="flex items-start justify-between gap-2"><span><span className="flex items-center gap-2 text-[11px] font-bold"><span className="size-2 rounded-full" style={{ backgroundColor: color }} />{title}</span><span className="mt-2 block text-[10px] text-black/35">{subtitle}</span></span><span className={`grid size-4 place-items-center rounded-full border ${data.status === value ? 'border-[#6b5cff]' : 'border-black/15'}`}>{data.status === value && <span className="size-2 rounded-full bg-[#6b5cff]" />}</span></span></label>)}</div><FieldError message={errors.status} /></fieldset>
                        <fieldset className="mt-6"><legend className="text-[12px] font-bold text-black/60">အသုံးပြုမည့်ကာလ</legend><div className="mt-2.5 grid grid-cols-2 rounded-2xl bg-[#ecece7] p-1.5"><button type="button" onClick={() => selectDurationType('quick')} className={`rounded-xl px-3 py-2.5 text-[10px] font-bold transition ${data.duration_type === 'quick' ? 'bg-white shadow-sm' : 'text-black/35'}`}>Quick duration</button><button type="button" onClick={() => selectDurationType('custom')} className={`rounded-xl px-3 py-2.5 text-[10px] font-bold transition ${data.duration_type === 'custom' ? 'bg-white shadow-sm' : 'text-black/35'}`}>Calendar date</button></div>
                            {data.duration_type === 'quick' ? <div className="mt-3 grid grid-cols-3 gap-2.5">{[1, 2, 3].map((months) => <label key={months} className={`cursor-pointer rounded-2xl border px-2 py-4 text-center transition ${data.duration_months === months ? 'border-[#6b5cff] bg-[#eeeaff] text-[#6b5cff]' : 'border-black/7 bg-white text-black/40'}`}><input type="radio" name="duration_months" value={months} checked={data.duration_months === months} onChange={() => setData('duration_months', months)} className="sr-only" /><span className="block text-xl font-extrabold">{months}</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.1em]">{months === 1 ? 'Month' : 'Months'}</span></label>)}</div> : <label className="mt-3 block rounded-2xl border border-[#6b5cff]/20 bg-[#eeeaff] p-4"><span className="text-[10px] font-bold text-[#6b5cff]">သက်တမ်းကုန်မည့်ရက်</span><input type="date" value={data.expires_at} onChange={(event) => setData('expires_at', event.target.value)} className="mt-3 w-full rounded-xl border-black/8 bg-white px-4 py-3 text-[12px] font-semibold focus:border-[#6b5cff] focus:ring-[#6b5cff]" /></label>}<FieldError message={errors.duration_type || errors.duration_months || errors.expires_at} />
                        </fieldset>
                    </section>
                    <div className="flex items-center justify-end gap-3 border-t border-black/8 bg-white px-5 py-5 sm:px-7"><Link href={backUrl} className="rounded-lg px-4 py-3 text-[10px] font-bold text-black/40 hover:bg-[#f1f0ed] hover:text-black">Cancel</Link><button type="submit" disabled={processing} className="inline-flex items-center gap-3 rounded-lg bg-[#181a1f] px-5 py-3 text-[10px] font-bold text-white hover:bg-black/80 disabled:pointer-events-none disabled:opacity-50">{processing ? 'Saving…' : isEditing ? 'Save changes' : 'Create shop'}<span>→</span></button></div>
                </form>
            </div>
        </div>
    );
}
