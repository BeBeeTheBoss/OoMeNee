import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

function StatusBadge({ status }) {
    const active = status === 'active';
    return <span className="inline-flex items-center gap-2 text-[10px] font-semibold"><span className={`size-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-amber-500'}`} />{active ? 'Active' : 'Trial'}</span>;
}

function AccountSwitch({ shop }) {
    const update = (status) => router.patch(route('admin.shops.status.update', shop.id), { status }, { preserveScroll: true });
    return <div className="inline-flex rounded-lg border border-black/8 p-0.5">{['trial', 'active'].map((status) => <button key={status} type="button" onClick={() => update(status)} disabled={shop.status === status} className={`rounded-md px-3 py-1.5 text-[9px] font-semibold capitalize ${shop.status === status ? 'bg-[#181a1f] text-white' : 'text-black/35 hover:text-black'}`}>{status}</button>)}</div>;
}

function Actions({ shop }) {
    const remove = () => {
        if (window.confirm(`“${shop.name}” ကို ဖျက်မှာ သေချာပါသလား?`)) router.delete(route('admin.shops.destroy', shop.id), { preserveScroll: true });
    };
    const buttonClass = 'grid size-8 place-items-center rounded-lg border border-black/8 text-black/40 hover:bg-[#f1f0ed] hover:text-black';
    return <div className="flex justify-end gap-1.5"><Link href={route('admin.shops.edit', shop.id)} className={buttonClass} aria-label={`Edit ${shop.name}`}><svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m14 5 5 5M4 20l4-1 11-11-4-4L4 15v5Z" /></svg></Link><Link href={route('admin.shops.show', shop.id)} className={buttonClass} aria-label={`View ${shop.name}`}>→</Link><button type="button" onClick={remove} className={`${buttonClass} text-red-400 hover:bg-red-50 hover:text-red-500`} aria-label={`Delete ${shop.name}`}>×</button></div>;
}

function Restaurant({ shop }) {
    return <div className="flex min-w-0 items-center gap-3"><img src={shop.logo_url} alt={`${shop.name} logo`} className="size-10 shrink-0 rounded-lg border border-black/8 bg-white object-cover" /><div className="min-w-0"><Link href={route('admin.shops.show', shop.id)} className="block truncate text-[12px] font-bold hover:underline">{shop.name}</Link><a href={shop.menu_url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-[9px] text-black/35 hover:text-black">/menu/{shop.menu_slug}</a></div></div>;
}

function MobileCard({ shop }) {
    return <article className="border-b border-black/8 bg-white px-4 py-5 last:border-0"><div className="flex items-start justify-between gap-3"><Restaurant shop={shop} /><StatusBadge status={shop.status} /></div><div className="mt-4 grid grid-cols-2 gap-4 text-[10px]"><div><p className="text-black/35">Duration</p><p className="mt-1 font-semibold">{shop.duration_months ? `${shop.duration_months} month${shop.duration_months > 1 ? 's' : ''}` : 'Custom date'}</p></div><div><p className="text-black/35">Expires</p><p className="mt-1 font-semibold">{shop.expires_at ?? '—'}</p></div></div><div className="mt-4 flex items-center justify-between border-t border-black/8 pt-4"><AccountSwitch shop={shop} /><Actions shop={shop} /></div></article>;
}

export default function Index({ shops, stats }) {
    const { flash } = usePage().props;
    const statsItems = [['Total shops', stats.total], ['Active', stats.active], ['Trial', stats.trial]];

    return <><Head title="Shop Management" /><AdminLayout>
        {flash.success && <div className="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-[11px] font-semibold text-emerald-800">{flash.success}</div>}

        <div className="flex flex-col gap-5 border-b border-black/8 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35">Overview</p><h1 className="mt-3 text-[2rem] font-bold tracking-[-0.045em]">Shop management</h1><p className="mt-2 text-[12px] leading-6 text-black/45">ဆိုင်တွေ၊ account status နဲ့ menu workspace access တွေကို စီမံနိုင်ပါတယ်။</p></div>
            <Link href={route('admin.shops.create')} className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#181a1f] px-4 py-3 text-[10px] font-bold text-white hover:bg-black/80">Create shop <span>＋</span></Link>
        </div>

        <div className="grid grid-cols-3 border-b border-black/8 py-6">{statsItems.map(([label, value], index) => <div key={label} className={`px-3 sm:px-5 ${index > 0 ? 'border-l border-black/8' : ''}`}><p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-black/35">{label}</p><p className="mt-2 text-2xl font-bold tracking-[-0.04em]">{value}</p></div>)}</div>

        <section className="mt-7 overflow-hidden rounded-xl border border-black/8 bg-white">
            <div className="flex items-center justify-between border-b border-black/8 px-5 py-4"><div><h2 className="text-[13px] font-bold">Restaurants</h2><p className="mt-1 text-[9px] text-black/35">Manage access and account status.</p></div><span className="text-[10px] font-semibold text-black/40">{stats.total} total</span></div>
            {shops.data.length ? <><div className="md:hidden">{shops.data.map((shop) => <MobileCard key={shop.id} shop={shop} />)}</div><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[820px] text-left"><thead><tr className="border-b border-black/8 bg-[#fafaf8] text-[9px] font-semibold uppercase tracking-[0.12em] text-black/35"><th className="px-5 py-3">Restaurant</th><th className="px-4 py-3">Account</th><th className="px-4 py-3">Subscription</th><th className="px-4 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody>{shops.data.map((shop) => <tr key={shop.id} className="border-b border-black/8 last:border-0 hover:bg-[#fafaf8]"><td className="px-5 py-4"><Restaurant shop={shop} /></td><td className="px-4 py-4"><StatusBadge status={shop.status} /></td><td className="px-4 py-4"><p className="text-[10px] font-semibold">{shop.duration_months ? `${shop.duration_months} month${shop.duration_months > 1 ? 's' : ''}` : 'Custom date'}</p><p className="mt-1 text-[9px] text-black/35">Ends {shop.expires_at ?? '—'}</p></td><td className="px-4 py-4"><AccountSwitch shop={shop} /></td><td className="px-5 py-4"><Actions shop={shop} /></td></tr>)}</tbody></table></div></> : <div className="px-6 py-14 text-center"><p className="text-[12px] font-bold">ဆိုင်မရှိသေးပါ</p><p className="mt-2 text-[10px] text-black/35">Create shop ကိုနှိပ်ပြီး ပထမဆုံးဆိုင်ကို ထည့်ပါ။</p></div>}
            {(shops.prev_page_url || shops.next_page_url) && <div className="flex items-center justify-between border-t border-black/8 px-5 py-4 text-[10px]"><Link href={shops.prev_page_url ?? '#'} preserveScroll className={shops.prev_page_url ? 'font-semibold' : 'pointer-events-none text-black/20'}>← Previous</Link><span className="text-black/35">{shops.current_page} / {shops.last_page}</span><Link href={shops.next_page_url ?? '#'} preserveScroll className={shops.next_page_url ? 'font-semibold' : 'pointer-events-none text-black/20'}>Next →</Link></div>}
        </section>
    </AdminLayout></>;
}
