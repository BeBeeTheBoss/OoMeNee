import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

function MailIcon() {
    return <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true"><path d="M4 6.75h16v10.5H4V6.75Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m4.75 7.5 6.2 4.84a1.7 1.7 0 0 0 2.1 0l6.2-4.84" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

function LockIcon() {
    return <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="3" stroke="currentColor" strokeWidth="1.7" /><path d="M8 10V7.5a4 4 0 1 1 8 0V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>;
}

function EyeIcon({ hidden }) {
    return hidden ? (
        <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true"><path d="M3.5 4.5 20.5 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M10.4 6.2A9.8 9.8 0 0 1 12 6c5.4 0 8.5 6 8.5 6a14.8 14.8 0 0 1-2.2 3.2M6.1 7.8A15 15 0 0 0 3.5 12s3.1 6 8.5 6c1 0 2-.2 2.8-.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M9.7 9.8a3.3 3.3 0 0 0 4.6 4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true"><path d="M3.5 12s3.1-6 8.5-6 8.5 6 8.5 6-3.1 6-8.5 6-8.5-6-8.5-6Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" /></svg>
    );
}

export default function Login({ shop }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });

    const submit = (event) => {
        event.preventDefault();
        post(route('shop-admin.login.store', shop.menu_slug));
    };

    return (
        <>
            <Head title={`${shop.name} Admin`} />
            <main className="shop-login-layout min-h-screen bg-[#f7f7f3] font-sans text-[#181a1f]">
                <section className="relative hidden min-h-screen overflow-hidden p-5 lg:block">
                    <div className="relative flex h-full min-h-[calc(100vh-2.5rem)] flex-col overflow-hidden rounded-[2.5rem] bg-[#e9e8ff] p-10 xl:p-14">
                        <div className="preview-grid absolute inset-0 opacity-55" />
                        <div className="absolute -left-24 bottom-14 size-80 rounded-full bg-[#c8ef9c]/70 blur-3xl" />
                        <div className="absolute -right-16 top-16 size-72 rounded-full bg-[#ffccd7]/60 blur-3xl" />

                        <div className="relative flex items-center gap-3">
                            <img src="/images/brand/oomenee-icon.png" alt="OoMeNee" className="size-12 rounded-2xl bg-white object-contain p-1.5 shadow-sm" />
                            <div>
                                <p className="text-lg font-extrabold tracking-[-0.04em]">OoMeNee</p>
                                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">Digital menu solution</p>
                            </div>
                        </div>

                        <div className="relative my-auto max-w-xl py-14">
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6b5cff]">Restaurant workspace</p>
                            <h1 className="mt-5 max-w-lg text-[clamp(2.4rem,4.2vw,4.5rem)] font-extrabold leading-[1.22] tracking-[-0.065em]">Menu စီမံမှုတိုင်းကို ပိုလွယ်ကူစေပါ။</h1>
                            <p className="mt-6 max-w-md text-[15px] leading-7 text-black/55">Item အသစ်ထည့်တာကနေ စျေးနှုန်းနဲ့ availability ပြင်ဆင်တာအထိ တစ်နေရာတည်းကနေ စီမံနိုင်ပါတယ်။</p>

                            <div className="relative mt-12 h-60 max-w-[31rem]">
                                <div className="absolute left-0 top-4 w-[76%] rotate-[-2deg] rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(53,46,120,0.13)] backdrop-blur-xl">
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">Menu overview</p><p className="mt-1 text-lg font-extrabold">Today&apos;s menu</p></div>
                                        <span className="rounded-full bg-[#e8f5d0] px-3 py-1.5 text-[10px] font-bold text-[#345c16]">Live</span>
                                    </div>
                                    <div className="mt-5 grid grid-cols-3 gap-2.5">
                                        {['50 Items', '8 Categories', '1 Menu link'].map((item) => <div key={item} className="rounded-2xl bg-[#f5f4ef] px-3 py-4 text-center text-[11px] font-bold text-black/55">{item}</div>)}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-[58%] rotate-3 rounded-[1.6rem] bg-[#181a1f] p-4 text-white shadow-[0_24px_60px_rgba(24,26,31,0.24)]">
                                    <div className="flex items-center gap-3">
                                        <div className="grid size-11 place-items-center rounded-2xl bg-[#6b5cff]"><svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true"><path d="m7 12 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                                        <div><p className="text-[12px] font-bold">Changes published</p><p className="mt-1 text-[10px] text-white/45">Customers can see updates now</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex items-center gap-2 text-[11px] font-semibold text-black/40"><span className="size-1.5 rounded-full bg-[#6b5cff]" />Simple, fast and always up to date</div>
                    </div>
                </section>

                <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
                    <div className="absolute -right-20 -top-28 size-72 rounded-full bg-[#e9e8ff]/70 blur-3xl lg:hidden" />
                    <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-[#e8f5d0]/70 blur-3xl lg:hidden" />
                    <div className="relative w-full max-w-[28rem]">
                        <div className="mb-12 flex items-center justify-between lg:hidden">
                            <div className="flex items-center gap-2.5"><img src="/images/brand/oomenee-icon.png" alt="OoMeNee" className="size-10 rounded-xl bg-white object-contain p-1 shadow-sm" /><span className="text-base font-extrabold tracking-[-0.04em]">OoMeNee</span></div>
                            <span className="rounded-full border border-black/7 bg-white/75 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-black/40 backdrop-blur">Menu admin</span>
                        </div>

                        <div className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-black/6 bg-white px-3 py-2.5 shadow-[0_8px_30px_rgba(24,26,31,0.05)]">
                            <img src={shop.logo_url} alt={`${shop.name} logo`} className="size-10 shrink-0 rounded-xl bg-[#f5f4ef] object-cover" />
                            <div className="min-w-0 pr-2"><p className="truncate text-[13px] font-extrabold">{shop.name}</p><p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b5cff]">Menu workspace</p></div>
                        </div>

                        <div className="mt-8">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6b5cff]">Welcome back</p>
                            <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.3] tracking-[-0.055em] sm:text-[2.35rem]">ပြန်လည်ကြိုဆိုပါတယ်</h2>
                            <p className="mt-3 text-[14px] leading-7 text-black/48">ဆိုင်ရဲ့ menu items တွေကို စီမံဖို့ သင့် account နဲ့ ဝင်ပါ။</p>
                        </div>

                        <form onSubmit={submit} className="mt-9 space-y-5">
                            <label className="block">
                                <span className="text-[12px] font-bold text-black/60">Email address</span>
                                <div className={`mt-2.5 flex items-center gap-3 rounded-2xl border bg-white px-4 transition focus-within:border-[#6b5cff] focus-within:ring-4 focus-within:ring-[#6b5cff]/8 ${errors.email ? 'border-red-300' : 'border-black/8'}`}>
                                    <span className="text-black/30"><MailIcon /></span>
                                    <input type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} autoComplete="email" autoFocus placeholder="name@example.com" className="min-w-0 flex-1 border-0 bg-transparent px-0 py-4 text-base outline-none placeholder:text-black/25 focus:ring-0 sm:text-[14px]" />
                                </div>
                                {errors.email && <span className="mt-2 block text-[12px] font-medium text-red-500">{errors.email}</span>}
                            </label>

                            <label className="block">
                                <span className="text-[12px] font-bold text-black/60">Password</span>
                                <div className={`mt-2.5 flex items-center gap-3 rounded-2xl border bg-white px-4 transition focus-within:border-[#6b5cff] focus-within:ring-4 focus-within:ring-[#6b5cff]/8 ${errors.password ? 'border-red-300' : 'border-black/8'}`}>
                                    <span className="text-black/30"><LockIcon /></span>
                                    <input type={showPassword ? 'text' : 'password'} value={data.password} onChange={(event) => setData('password', event.target.value)} autoComplete="current-password" placeholder="Enter your password" className="min-w-0 flex-1 border-0 bg-transparent px-0 py-4 text-base outline-none placeholder:text-black/25 focus:ring-0 sm:text-[14px]" />
                                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="grid size-9 shrink-0 place-items-center rounded-full text-black/35 transition hover:bg-black/5 hover:text-black/65" aria-label={showPassword ? 'Hide password' : 'Show password'}><EyeIcon hidden={showPassword} /></button>
                                </div>
                                {errors.password && <span className="mt-2 block text-[12px] font-medium text-red-500">{errors.password}</span>}
                            </label>

                            <label className="flex w-fit cursor-pointer items-center gap-3 py-1 text-[12px] font-semibold text-black/50">
                                <input type="checkbox" checked={data.remember} onChange={(event) => setData('remember', event.target.checked)} className="size-4 rounded border-black/15 text-[#6b5cff] focus:ring-[#6b5cff] focus:ring-offset-[#f7f7f3]" />
                                Keep me signed in
                            </label>

                            <button disabled={processing} className="group flex w-full items-center justify-between rounded-2xl bg-[#181a1f] px-5 py-4 text-[13px] font-bold text-white shadow-[0_14px_35px_rgba(24,26,31,0.16)] transition hover:-translate-y-0.5 hover:bg-[#292c32] hover:shadow-[0_18px_40px_rgba(24,26,31,0.2)] disabled:pointer-events-none disabled:opacity-50">
                                <span>{processing ? 'Signing in…' : 'Sign in to workspace'}</span>
                                <span className="grid size-9 place-items-center rounded-xl bg-[#6b5cff] transition group-hover:translate-x-0.5"><svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                            </button>
                        </form>

                        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-semibold text-black/30"><LockIcon /><span>Your account is securely protected</span></div>
                    </div>
                </section>
            </main>
        </>
    );
}
