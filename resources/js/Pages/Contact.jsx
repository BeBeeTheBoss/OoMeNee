import { Head, Link } from '@inertiajs/react';

function TelegramIcon() {
    return (
        <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.6 3.1 18.4 19c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L5.9 12.8 1 11.3C-.1 11 .9 9.7 2 9.3L20.9 2c.9-.3 1.7.2.7 1.1Z" />
        </svg>
    );
}

function Arrow() {
    return (
        <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M7 7h10v10" />
        </svg>
    );
}

export default function Contact({ contacts }) {
    return (
        <>
            <Head title="Contact OoMeNee">
                <meta name="description" content="OoMeNee E-Menu ဝန်ဆောင်မှုအတွက် Telegram မှတစ်ဆင့် ဆက်သွယ်ပါ။" />
            </Head>

            <div className="min-h-screen bg-[#f8f8f6] font-sans text-[#181a1f] selection:bg-[#6b5cff] selection:text-white">
                <header className="border-b border-black/6 bg-[#f8f8f6]/90 backdrop-blur-xl">
                    <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
                        <Link href="/" aria-label="OoMeNee home">
                            <img src="/images/brand/oomenee-logo.png" alt="OoMeNee Digital Menu Solution" className="h-12 w-auto object-contain sm:h-14" />
                        </Link>
                        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-black/7 bg-white px-4 py-2.5 text-[10px] font-bold text-black/55 shadow-sm transition hover:-translate-y-0.5 hover:border-black/15 hover:text-black">
                            <span aria-hidden="true">←</span>
                            Home
                        </Link>
                    </div>
                </header>

                <main className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden px-5 py-14 sm:px-8 sm:py-20">
                    <div aria-hidden="true" className="absolute -left-32 top-16 -z-10 size-80 rounded-full bg-[#dff6bd]/65 blur-3xl" />
                    <div aria-hidden="true" className="absolute -right-24 bottom-4 -z-10 size-80 rounded-full bg-[#e5e2ff]/75 blur-3xl" />

                    <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
                        <section>
                            <div className="inline-flex items-center gap-2 rounded-full border border-black/7 bg-white px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-black/45 shadow-sm">
                                <span className="size-1.5 rounded-full bg-[#7bcf6d]" />
                                Contact OoMeNee
                            </div>
                            <h1 className="mt-7 max-w-xl text-[2rem] font-bold leading-[1.5] tracking-[-0.045em] sm:text-[2.45rem]">
                                E‑Menu စတင်ဖို့<br className="hidden sm:block" /> Telegram ကနေ ဆက်သွယ်ပါ<span className="text-[#6b5cff]">။</span>
                            </h1>
                            <p className="mt-5 max-w-lg text-[13px] leading-7 text-black/48 sm:text-sm">
                                ဆိုင်အကြောင်းနဲ့ လက်ရှိ Menu အချက်အလက်တွေကို ပို့ပေးလိုက်ပါ။ Package နဲ့ စတင်အသုံးပြုပုံကို ပြန်လည်ရှင်းပြပေးပါမယ်။
                            </p>
                            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-black/6 bg-white/75 px-4 py-3 text-[10px] font-semibold text-black/45 shadow-sm backdrop-blur">
                                <span className="relative flex size-2.5">
                                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7bcf6d] opacity-50" />
                                    <span className="relative inline-flex size-2.5 rounded-full bg-[#62b653]" />
                                </span>
                                Telegram မှာ message ပို့ထားနိုင်ပါတယ်
                            </div>
                        </section>

                        <section className="rounded-[2rem] border border-black/6 bg-white/80 p-3 shadow-[0_28px_80px_rgba(24,26,31,0.1)] backdrop-blur-xl sm:p-4">
                            <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b5cff]">Telegram contacts</p>
                                <h2 className="mt-2 text-lg font-bold tracking-[-0.025em]">ဆက်သွယ်မယ့် account ကိုရွေးပါ</h2>
                            </div>

                            <div className="grid gap-3">
                                {contacts.map((contact, index) => (
                                    <a key={contact.username} href={contact.url} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-[1.5rem] border border-black/6 bg-[#f8f8f6] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#229ed9]/20 hover:bg-white hover:shadow-[0_16px_36px_rgba(34,158,217,0.12)] sm:p-5">
                                        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#229ed9] text-white shadow-[0_10px_24px_rgba(34,158,217,0.22)]">
                                            <TelegramIcon />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-black/30">Telegram account 0{index + 1}</span>
                                            <span className="mt-1 block truncate text-base font-bold tracking-[-0.02em]">{contact.username}</span>
                                        </span>
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-black/7 bg-white text-black/40 transition group-hover:border-[#229ed9]/20 group-hover:bg-[#229ed9] group-hover:text-white">
                                            <Arrow />
                                        </span>
                                    </a>
                                ))}
                            </div>

                            <p className="px-4 pb-3 pt-5 text-[10px] leading-6 text-black/35 sm:px-5">Account နှစ်ခုထဲက အဆင်ပြေတာကို ရွေးပြီး တိုက်ရိုက် message ပို့နိုင်ပါတယ်။</p>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
