import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route('admin.login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Admin Login" />

            <div className="grid min-h-screen bg-[#f4f4f1] font-sans text-[#181a1f] lg:grid-cols-[0.95fr_1.05fr]">
                <section className="relative hidden overflow-hidden bg-[#181a1f] p-12 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -left-20 -top-20 size-80 rounded-full bg-[#6b5cff]/30 blur-3xl" />
                    <div className="absolute -bottom-28 -right-20 size-96 rounded-full bg-[#dff6bd]/15 blur-3xl" />

                    <div className="relative flex items-center gap-2.5">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-white p-1.5"><img src="/images/brand/oomenee-icon.png" alt="" className="size-full object-contain" /></span>
                        <div><p className="text-sm font-bold">OoMeNee</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Backoffice</p></div>
                    </div>

                    <div className="relative max-w-md">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a99fff]">Private workspace</p>
                        <h1 className="mt-5 text-[2.1rem] font-bold leading-[1.45] tracking-[-0.04em]">ဆိုင်တွေနဲ့ account status တွေကို တစ်နေရာတည်းကနေ စီမံပါ<span className="text-[#a99fff]">။</span></h1>
                        <p className="mt-5 max-w-sm text-[14px] leading-7 text-white/40">ဒီနေရာကို OoMeNee administrator account တစ်ခုတည်းကသာ ဝင်ရောက်နိုင်ပါတယ်။</p>
                    </div>

                    <p className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">Protected admin access</p>
                </section>

                <section className="flex items-center justify-center px-5 py-12 sm:px-8">
                    <div className="w-full max-w-sm">
                        <div className="mb-10 flex items-center gap-2.5 lg:hidden">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm"><img src="/images/brand/oomenee-icon.png" alt="" className="size-full object-contain" /></span>
                            <div><p className="text-sm font-bold">OoMeNee</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-black/30">Backoffice</p></div>
                        </div>

                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b5cff]">Administrator only</p>
                        <h2 className="mt-3 text-[1.75rem] font-bold tracking-[-0.04em]">Welcome back</h2>
                        <p className="mt-2 text-[13px] leading-5 text-black/40">သတ်မှတ်ထားသော admin account ဖြင့် ဝင်ပါ။</p>

                        <form onSubmit={submit} className="mt-8 grid gap-5">
                            <label>
                                <span className="text-[13px] font-bold">Email address</span>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                    className="mt-2.5 w-full rounded-xl border-black/8 bg-white px-4 py-3.5 text-[14px] placeholder:text-black/25 focus:border-[#6b5cff] focus:ring-[#6b5cff]"
                                    placeholder="admin@example.com"
                                />
                                {errors.email && <span className="mt-1.5 block text-[12px] font-semibold text-red-600">Email သို့မဟုတ် password မမှန်ပါ။</span>}
                            </label>

                            <label>
                                <span className="text-[13px] font-bold">Password</span>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                    autoComplete="current-password"
                                    className="mt-2.5 w-full rounded-xl border-black/8 bg-white px-4 py-3.5 text-[14px] placeholder:text-black/25 focus:border-[#6b5cff] focus:ring-[#6b5cff]"
                                    placeholder="••••••••"
                                />
                                {errors.password && <span className="mt-1.5 block text-[12px] font-semibold text-red-600">{errors.password}</span>}
                            </label>

                            <label className="flex w-fit cursor-pointer items-center gap-2.5">
                                <input type="checkbox" checked={data.remember} onChange={(event) => setData('remember', event.target.checked)} className="rounded border-black/15 text-[#6b5cff] focus:ring-[#6b5cff]" />
                                <span className="text-[12px] font-semibold text-black/45">Keep me signed in</span>
                            </label>

                            <button type="submit" disabled={processing} className="mt-2 flex items-center justify-center gap-3 rounded-xl bg-[#181a1f] px-5 py-3.5 text-[13px] font-bold text-white transition hover:bg-[#6b5cff] disabled:cursor-not-allowed disabled:opacity-50">
                                {processing ? 'ဝင်နေပါတယ်…' : 'Admin dashboard ဝင်မယ်'}
                                {!processing && <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-[11px] text-black/28">Account အသစ်ဖွင့်၍မရပါ။ Admin account ကို database seeder ဖြင့်သာ ထည့်နိုင်ပါတယ်။</p>
                    </div>
                </section>
            </div>
        </>
    );
}
