import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';

const features = [
    { label: 'Live updates', title: 'ဈေးပြောင်းတိုင်း Menu အသစ်မလို', description: 'E‑Menu မှာ ပြင်လိုက်တာနဲ့ Customer တွေက ရှိပြီးသား QR ကနေ ချက်ချင်းမြင်ရပါတယ်။', tone: 'bg-[#e8f5d0]' },
    { label: 'Zero friction', title: 'App ထည့်စရာမလို', description: 'ဖုန်း Camera နဲ့ QR ကို scan ဖတ်လိုက်ရုံနဲ့ Browser ထဲမှာ Menu တန်းပွင့်လာပါတယ်။', tone: 'bg-[#eeeaff]' },
    { label: 'Your identity', title: 'ဆိုင်ရဲ့ Brand အတိုင်း', description: 'Logo၊ အရောင်နဲ့ ဆိုင်ရဲ့ atmosphere ကိုလိုက်ပြီး ကိုယ်ပိုင် menu experience တည်ဆောက်ပေးပါတယ်။', tone: 'bg-[#ffe8df]' },
];

const steps = [
    ['01', 'Menu ပို့ပါ', 'လက်ရှိ Menu၊ ဈေးနှုန်းနဲ့ ရှိပြီးသား food photo တွေကို ပို့ပေးပါ။'],
    ['02', 'ကျွန်တော်တို့ ပြင်ဆင်မယ်', 'Menu structure ကနေ QR stand အထိ ဆိုင်နဲ့လိုက်အောင် ပြင်ဆင်ပေးပါမယ်။'],
    ['03', 'စားပွဲပေါ် တင်လိုက်ပါ', 'QR stand ရောက်တာနဲ့ ချက်ချင်းအသုံးပြုနိုင်ပြီး update တွေကိုလည်း ဆက်ကူညီပေးပါတယ်။'],
];

const faqs = [
    ['Customer က App ထည့်ဖို့လိုပါသလား?', 'မလိုပါဘူး။ ဖုန်း Camera နဲ့ QR ကို scan ဖတ်လိုက်ရုံနဲ့ Browser ထဲမှာ Menu တန်းပွင့်လာမှာပါ။'],
    ['ဈေးနှုန်းပြောင်းရင် QR အသစ်လုပ်ရမလား?', 'မလိုပါဘူး။ E‑Menu မှာ update လုပ်လိုက်ရုံနဲ့ ရှိပြီးသား QR ကနေ အသစ်ပြင်ထားတာကို ချက်ချင်းမြင်ရပါတယ်။'],
    ['ဆိုင် Logo နဲ့ အရောင်ကို သုံးပေးလား?', 'သုံးပေးပါတယ်။ ဆိုင်ရဲ့ visual identity ကိုလိုက်ပြီး E‑Menu နဲ့ QR stand နှစ်ခုလုံးကို တစ်သားတည်းဖြစ်အောင် ပြင်ဆင်ပေးပါတယ်။'],
    ['Menu စတင်တင်တာကို ဘယ်သူလုပ်ပေးမှာလဲ?', 'စတင်အသုံးပြုချိန်မှာ Menu အချက်အလက်တွေကို ကျွန်တော်တို့ဘက်က အပြီးအစီးတင်ပေးပြီး အသုံးပြုပုံကိုလည်း လမ်းညွှန်ပေးပါတယ်။'],
];

function Arrow({ diagonal = false }) {
    return (
        <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {diagonal ? <path d="M7 17 17 7M7 7h10v10" /> : <path d="M5 12h14m-5-5 5 5-5 5" />}
        </svg>
    );
}

function Check() {
    return <svg aria-hidden="true" className="size-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10 4 4 8-9" /></svg>;
}

function Wordmark() {
    return (
        <img src="/images/brand/oomenee-logo.png" alt="OoMeNee Digital Menu Solution" className="h-12 w-auto object-contain sm:h-14" />
    );
}

function QrCode({ compact = false }) {
    const isDark = (row, column) => {
        const corners = [[0, 0], [0, 14], [14, 0]];

        for (const [top, left] of corners) {
            const localRow = row - top;
            const localColumn = column - left;

            if (localRow >= 0 && localRow < 7 && localColumn >= 0 && localColumn < 7) {
                return localRow === 0 || localRow === 6 || localColumn === 0 || localColumn === 6 || (localRow >= 2 && localRow <= 4 && localColumn >= 2 && localColumn <= 4);
            }

            if (localRow >= -1 && localRow < 8 && localColumn >= -1 && localColumn < 8) {
                return false;
            }
        }

        return (row * 3 + column * 5) % 7 < 3 || (row + column) % 11 === 0;
    };

    return (
        <div className={`grid aspect-square grid-cols-[repeat(21,minmax(0,1fr))] bg-white ${compact ? 'p-1' : 'p-2'}`}>
            {Array.from({ length: 441 }, (_, index) => {
                const row = Math.floor(index / 21);
                const column = index % 21;
                return <span key={index} className={isDark(row, column) ? 'bg-[#181a1f]' : 'bg-white'} />;
            })}
        </div>
    );
}

const productScreens = [
    { src: '/images/previews/public-menu.png', alt: 'Customer-facing restaurant menu on a phone', header: 'public', fill: '#f4f1e9' },
    { src: '/images/previews/menu-items.png', alt: 'Menu item management screen on a phone', header: 'admin', fill: '#f8f8f6' },
    { src: '/images/previews/menu-create.png', alt: 'New menu item form on a phone', header: 'admin', fill: '#f8f8f6' },
];

function ProductScreen({ screen, delay = '0s' }) {
    return (
        <div className="phone-float relative h-[610px] w-[290px] shrink-0" style={{ animationDelay: delay }}>
            <span aria-hidden="true" className="absolute -left-[3px] top-24 h-8 w-1 rounded-l-md bg-[#34363c]" />
            <span aria-hidden="true" className="absolute -left-[3px] top-36 h-14 w-1 rounded-l-md bg-[#34363c]" />
            <span aria-hidden="true" className="absolute -left-[3px] top-[13rem] h-14 w-1 rounded-l-md bg-[#34363c]" />
            <span aria-hidden="true" className="absolute -right-[3px] top-36 h-20 w-1 rounded-r-md bg-[#34363c]" />
            <div className="h-full rounded-[3.25rem] bg-gradient-to-br from-[#73757c] via-[#17181c] to-[#505258] p-[3px] shadow-[0_36px_90px_rgba(20,23,32,0.28)]">
                <div className="relative h-full overflow-hidden rounded-[3.05rem] bg-[#090a0d] p-[7px]">
                    <div className="relative h-full overflow-hidden rounded-[2.6rem]" style={{ backgroundColor: screen.fill }}>
                        <span aria-hidden="true" className="absolute left-1/2 top-2 z-20 flex h-5 w-[78px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2 shadow-sm">
                            <span className="size-1.5 rounded-full bg-[#19212d] ring-1 ring-white/10" />
                        </span>
                        <div className="relative h-full overflow-hidden">
                            <img src={screen.src} alt={screen.alt} className="h-full w-full object-cover object-top" />
                            <span aria-hidden="true" className="absolute left-[32%] top-[5.4%] z-10 h-[3.4%] w-[39%] rounded-full bg-white/25 backdrop-blur-[5px]" />
                            {screen.header === 'public' ? (
                                <>
                                    <span aria-hidden="true" className="absolute left-[4%] top-[12%] z-10 flex aspect-square w-[12.5%] items-center justify-center rounded-[22%] bg-white shadow-sm">
                                        <span className="flex size-[58%] items-center justify-center rounded-full bg-[#6b5cff] text-[8px] font-black text-white">S</span>
                                    </span>
                                    <span aria-hidden="true" className="absolute left-[18.5%] top-[14.7%] z-10 flex h-[3.3%] w-[31%] items-center bg-[#f4f1e9] text-[11px] font-bold tracking-[-0.03em] text-[#15171b]">Shop Menu</span>
                                </>
                            ) : (
                                <>
                                    <span aria-hidden="true" className="absolute left-[4%] top-[10.8%] z-10 flex aspect-square w-[9.5%] items-center justify-center rounded-[24%] bg-white shadow-sm">
                                        <span className="flex size-[58%] items-center justify-center rounded-full bg-[#6b5cff] text-[6px] font-black text-white">S</span>
                                    </span>
                                    <span aria-hidden="true" className="absolute left-[15%] top-[10.9%] z-10 flex h-[2.5%] w-[17%] items-center bg-[#f8f8f6] text-[9px] font-bold text-[#15171b]">Shop</span>
                                </>
                            )}
                        </div>
                        <span aria-hidden="true" className="absolute bottom-2.5 left-1/2 z-20 h-1 w-24 -translate-x-1/2 rounded-full bg-black/80" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function HeroPreview() {
    return (
        <div className="relative mx-auto mt-14 min-h-[730px] max-w-6xl sm:min-h-[780px]">
            <div className="absolute inset-x-0 bottom-0 top-10 overflow-hidden rounded-[2rem] border border-black/6 bg-[#e9e8ff] sm:rounded-[2.75rem]">
                <div className="preview-grid absolute inset-0 opacity-70" /><div className="soft-orb absolute -left-24 -top-28 size-72 rounded-full bg-[#b7f47c]/55 blur-3xl" /><div className="soft-orb soft-orb-delay absolute -bottom-24 -right-16 size-80 rounded-full bg-[#ffb69f]/50 blur-3xl" />
            </div>
            <div className="absolute left-1/2 top-12 z-20 -translate-x-1/2 -rotate-2 sm:left-[34%]"><ProductScreen screen={productScreens[1]} delay="-1.2s" /></div>
            <div className="absolute right-[10%] top-28 hidden rotate-[4deg] sm:block lg:right-[17%]"><ProductScreen screen={productScreens[0]} delay="-3.4s" /></div>
        </div>
    );
}

function SectionHeading({ eyebrow, title, description, light = false }) {
    return (
        <div className="max-w-2xl">
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${light ? 'text-white/40' : 'text-[#6b5cff]'}`}>{eyebrow}</p>
            <h2 className={`mt-4 text-[1.75rem] font-bold leading-[1.45] tracking-[-0.035em] sm:text-[2.1rem] ${light ? 'text-white' : 'text-[#181a1f]'}`}>{title}</h2>
            {description && <p className={`mt-4 text-sm leading-7 ${light ? 'text-white/50' : 'text-black/48'}`}>{description}</p>}
        </div>
    );
}

export default function Welcome() {
    const primaryHref = route('contact');
    const cleanSectionHash = () => {
        window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
    };
    const scrollToSection = (event, sectionId) => {
        event.preventDefault();
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        cleanSectionHash();
    };

    useEffect(() => {
        if (window.location.hash) {
            cleanSectionHash();
        }
    }, []);

    return (
        <>
            <Head title="Restaurant E‑Menu & QR Menu Service"><meta name="description" content="စားသောက်ဆိုင်များအတွက် QR E‑Menu ဝန်ဆောင်မှု။ ဈေးနှုန်းပြောင်းတိုင်း Menu စာအုပ်အသစ် ထပ်ထုတ်စရာမလိုဘဲ QR scan တစ်ချက်နဲ့ Menu ကိုကြည့်နိုင်ပါပြီ။" /></Head>
            <div className="min-h-screen bg-[#f8f8f6] font-sans text-[#181a1f] selection:bg-[#6b5cff] selection:text-white">
                <header className="sticky top-0 z-50 border-b border-black/6 bg-[#f8f8f6]/85 backdrop-blur-xl">
                    <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
                        <a href="#top" onClick={(event) => scrollToSection(event, 'top')} aria-label="OoMeNee home"><Wordmark /></a>
                        <nav className="hidden items-center gap-7 lg:flex">
                            {[[ 'ဝန်ဆောင်မှု', 'service' ], [ 'Product', 'product' ], [ 'အလုပ်လုပ်ပုံ', 'process' ], [ 'ဈေးနှုန်း', 'pricing' ]].map(([label, sectionId]) => <a key={sectionId} href={`#${sectionId}`} onClick={(event) => scrollToSection(event, sectionId)} className="text-[11px] font-semibold text-black/45 transition hover:text-black">{label}</a>)}
                        </nav>
                        <div className="flex items-center gap-4">
                            <Link href={primaryHref} className="group inline-flex items-center gap-3 rounded-full bg-[#181a1f] py-2 pl-4 pr-2 text-[10px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2b2d32] hover:shadow-[0_10px_24px_rgba(24,26,31,0.16)]">စတင်အသုံးပြုရန်<span className="flex size-7 items-center justify-center rounded-full bg-white/14 transition group-hover:translate-x-0.5"><Arrow diagonal /></span></Link>
                        </div>
                    </div>
                </header>

                <main id="top">
                    <section className="overflow-hidden px-5 pb-12 pt-20 sm:px-8 sm:pt-24">
                        <div className="mx-auto max-w-7xl text-center">
                            <div className="hero-enter mx-auto inline-flex items-center gap-2 rounded-full border border-black/7 bg-white px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-black/45 shadow-sm"><span className="size-1.5 rounded-full bg-[#7bcf6d]" />Built for restaurants in Myanmar</div>
                            <h1 className="hero-enter enter-delay-1 mx-auto mt-7 max-w-4xl text-[2rem] font-bold leading-[1.45] tracking-[-0.045em] sm:text-[2.7rem]">စျေးနှုန်း change တိုင်း<br className="hidden sm:block" /> Menu စာအုပ်အသစ် ထပ်ထုတ်နေရတဲ့အလုပ်ကို ဒီနေ့ရပ်လိုက်ပါ<span className="text-[#6b5cff]">။</span></h1>
                            <p className="hero-enter enter-delay-2 mx-auto mt-6 max-w-2xl text-sm leading-7 text-black/48 sm:text-[15px]">QR တစ်ချက် scan ဖတ်ရုံနဲ့ ကြည့်နိုင်တဲ့ E‑Menu။ Customer အတွက် ရွေးရလွယ်ပြီး ဆိုင်အတွက် ဈေးနှုန်းနဲ့ Menu ကို အချိန်မရွေးပြင်နိုင်ပါတယ်။</p>
                            <div className="hero-enter enter-delay-3 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link href={primaryHref} className="group inline-flex items-center gap-4 rounded-full bg-[#6b5cff] px-6 py-3.5 text-[11px] font-bold text-white shadow-[0_12px_30px_rgba(107,92,255,0.25)] transition hover:-translate-y-0.5 hover:bg-[#6257e8] hover:shadow-[0_16px_34px_rgba(107,92,255,0.3)]">E‑Menu စတင်မယ် <span className="transition group-hover:translate-x-1"><Arrow /></span></Link>
                                <a href="#product" onClick={(event) => scrollToSection(event, 'product')} className="inline-flex items-center gap-3 rounded-full border border-black/8 bg-white px-6 py-3.5 text-[11px] font-bold transition hover:border-black/20">Product ကိုကြည့်မယ် <Arrow diagonal /></a>
                            </div>
                            <HeroPreview />
                        </div>
                    </section>

                    <section className="border-y border-black/6 bg-white">
                        <div className="mx-auto grid max-w-7xl divide-y divide-black/6 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
                            {[[ '01', 'No app required', 'Camera နဲ့ scan ဖတ်ရုံ' ], [ '02', 'Always current', 'ပြင်လိုက်တာနဲ့ ချက်ချင်း update' ], [ '03', 'Made for your brand', 'ဆိုင်ရဲ့ပုံစံအတိုင်း ဒီဇိုင်း' ]].map(([number, title, subtitle]) => (
                                <div key={number} className="flex items-center gap-4 py-6 sm:px-6 sm:first:pl-0"><span className="flex size-9 items-center justify-center rounded-xl bg-[#f1f0ff] text-[9px] font-bold text-[#6b5cff]">{number}</span><div><p className="text-[10px] font-bold uppercase tracking-[0.08em]">{title}</p><p className="mt-1 text-[10px] text-black/38">{subtitle}</p></div></div>
                            ))}
                        </div>
                    </section>

                    <section id="service" className="px-5 py-24 sm:px-8 sm:py-28">
                        <div className="mx-auto max-w-7xl">
                            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><SectionHeading eyebrow="Why OoMeNee" title="Menu တစ်ခုထက်ပိုတဲ့ experience" description="စာအုပ်တစ်အုပ်ကို digital ပြောင်းရုံမဟုတ်ဘဲ Customer ကြည့်ရ၊ ရွေးရလွယ်အောင် အစအဆုံး စီစဉ်ပေးပါတယ်။" /><p className="rounded-full bg-[#e8f5d0] px-4 py-2 text-[10px] font-bold text-[#345227]">တစ်လ ၁၀,၀၀၀ ကျပ်</p></div>
                            <div className="mt-12 grid gap-4 lg:grid-cols-3">
                                {features.map((feature, index) => (
                                    <article key={feature.label} className={`${feature.tone} group flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[1.75rem] p-6 sm:p-7`}>
                                        <div><div className="flex items-center justify-between"><span className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/35">{feature.label}</span><span className="flex size-8 items-center justify-center rounded-full bg-white/65 text-[10px] font-bold">0{index + 1}</span></div><h3 className="mt-6 text-[1.2rem] font-bold leading-8 tracking-[-0.025em]">{feature.title}</h3><p className="mt-3 text-[13px] leading-7 text-black/48">{feature.description}</p></div>
                                        {index === 0 && <div className="mt-8 rounded-2xl bg-white/75 p-3 shadow-sm"><div className="flex items-center justify-between text-[8px] font-semibold"><span>မုန့်ဟင်းခါး</span><span className="text-[#6b5cff]">3,500 Ks</span></div><div className="mt-3 flex items-center gap-2 text-[7px] text-black/35"><span className="rounded-full bg-[#dff6bd] px-2 py-1 font-bold text-[#3c6c32]">Updated</span><span>Customer view is live</span></div></div>}
                                        {index === 1 && <div className="mx-auto mt-8 flex w-[84%] items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm"><div className="size-14 overflow-hidden rounded-xl bg-white p-1"><QrCode compact /></div><div><p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#6b5cff]">Table 08</p><p className="mt-1 text-[10px] font-bold">Scan & view</p></div></div>}
                                        {index === 2 && <div className="mt-8 flex gap-2">{['#181a1f', '#6b5cff', '#ff8067', '#e5f6ce'].map((color) => <span key={color} className="size-10 rounded-full border-4 border-white/60" style={{ backgroundColor: color }} />)}</div>}
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="product" className="bg-[#181a1f] px-5 py-24 text-white sm:px-8 sm:py-28">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end"><SectionHeading light eyebrow="Product experience" title="ဖုန်းကနေ Menu အားလုံးကို စီမံပါ" description="Menu item ထည့်တာ၊ ရှာတာ၊ ဈေးနှုန်းနဲ့ availability ပြင်တာတွေကို ဖုန်းကနေ တစ်နေရာတည်း စီမံနိုင်ပါတယ်။" /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{[[ 'Instant', 'Live update' ], [ 'One link', 'All tables' ], [ 'Simple', 'Easy to use' ]].map(([value, label]) => <div key={value} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-sm font-bold">{value}</p><p className="mt-1 text-[9px] text-white/35">{label}</p></div>)}</div></div>
                            <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-[#262932] px-4 py-10 sm:px-8 lg:px-10"><div className="absolute -right-24 -top-24 size-72 rounded-full bg-[#6b5cff]/30 blur-3xl" /><div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-[#ff8067]/10 blur-3xl" /><div className="relative flex snap-x items-start gap-5 overflow-x-auto pb-10 pt-4 lg:justify-center">{productScreens.map((screen, index) => <div key={screen.src} className={`snap-center ${index === 1 ? 'sm:pt-10' : index === 2 ? 'sm:pt-4' : ''}`}><ProductScreen screen={screen} delay={`${index * -1.6}s`} /></div>)}</div></div>
                        </div>
                    </section>

                    <section id="process" className="px-5 py-24 sm:px-8 sm:py-28">
                        <div className="mx-auto max-w-7xl"><SectionHeading eyebrow="How it works" title="စတင်ဖို့ အဆင့်သုံးဆင့်ပဲလိုပါတယ်" description="နည်းပညာပိုင်းသိစရာမလိုပါဘူး။ စတင်တဲ့နေ့ကနေ အသုံးပြုပြီးနောက်အထိ ကူညီပေးပါတယ်။" /><div className="mt-12 grid gap-4 lg:grid-cols-3">{steps.map(([number, title, description]) => <article key={number} className="rounded-[1.5rem] border border-black/7 bg-white p-6 shadow-[0_12px_40px_rgba(24,26,31,0.04)] sm:p-7"><div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[#6b5cff]">{number}</span><span className="h-px w-12 bg-black/10" /></div><h3 className="mt-12 text-base font-bold">{title}</h3><p className="mt-3 text-[13px] leading-7 text-black/45">{description}</p></article>)}</div></div>
                    </section>

                    <section id="pricing" className="scroll-mt-28 px-5 pb-24 sm:px-8 sm:pb-28 lg:scroll-mt-56">
                        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#e8f5d0] lg:grid-cols-[0.8fr_1.2fr]">
                            <div className="flex flex-col justify-between gap-12 p-7 sm:p-10 lg:p-12"><SectionHeading eyebrow="Simple pricing" title="Package တစ်ခုတည်း၊ ရိုးရိုးရှင်းရှင်း" description="ရွေးချယ်ရခက်တဲ့ plan တွေမရှိပါဘူး။ E‑Menu အတွက် လိုအပ်တာတွေကို package တစ်ခုတည်းနဲ့ ရရှိမှာပါ။" /><p className="text-[10px] font-semibold text-black/35">အချိန်မရွေး စတင်အသုံးပြုနိုင်ပါတယ်</p></div>
                            <div className="m-3 rounded-[1.5rem] bg-white p-6 sm:m-5 sm:p-8 lg:p-10">
                                <div className="flex flex-col gap-6 border-b border-black/7 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b5cff]">Restaurant package</p><p className="mt-2 text-sm font-bold">OoMeNee E‑Menu</p></div><div className="flex items-baseline gap-2"><span className="text-[2.4rem] font-bold tracking-[-0.05em]">၁၀,၀၀၀</span><span className="text-[11px] font-semibold text-black/40">ကျပ် / လ</span></div></div>
                                <ul className="grid gap-4 py-7 text-[12px] font-semibold sm:grid-cols-2">{['Brand နဲ့ကိုက်ညီတဲ့ E‑Menu', 'Menu နဲ့ ဈေးနှုန်း ပြင်ဆင်နိုင်ခြင်း', 'QR ကနေ တိုက်ရိုက်ကြည့်နိုင်ခြင်း', 'Setup နဲ့ အသုံးပြုမှု အကူအညီ'].map((item) => <li key={item} className="flex items-start gap-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e8f5d0] text-[#3f6a30]"><Check /></span><span className="leading-5">{item}</span></li>)}</ul>
                                <Link href={primaryHref} className="group flex items-center justify-between rounded-2xl bg-[#181a1f] px-5 py-4 text-[11px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2b2d32] hover:shadow-[0_12px_28px_rgba(24,26,31,0.16)]">စတင်အသုံးပြုရန် <span className="transition group-hover:translate-x-1"><Arrow /></span></Link>
                            </div>
                        </div>
                    </section>

                    <section id="faq" className="border-y border-black/6 bg-white px-5 py-24 sm:px-8 sm:py-28">
                        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]"><SectionHeading eyebrow="Frequently asked" title="မေးလေ့ရှိတာတွေ" description="ထပ်သိချင်တာရှိရင် စတင်အသုံးပြုရန်ကိုနှိပ်ပြီး ကျွန်တော်တို့ကို ဆက်သွယ်နိုင်ပါတယ်။" /><div className="border-t border-black/8">{faqs.map(([question, answer], index) => <details key={question} className="group border-b border-black/8" open={index === 0}><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[13px] font-bold marker:content-none"><span>{question}</span><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-base font-normal transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-6 pr-10 text-[12px] leading-7 text-black/45">{answer}</p></details>)}</div></div>
                    </section>

                    <section className="px-5 py-16 sm:px-8 sm:py-20">
                        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 overflow-hidden rounded-[2rem] bg-[#6b5cff] p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:p-12"><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">Ready when you are</p><h2 className="mt-4 max-w-2xl text-[1.7rem] font-bold leading-[1.5] tracking-[-0.035em] sm:text-[2rem]">Menu စာအုပ်အသစ် ထပ်ထုတ်နေရတဲ့အလုပ်ကို ဒီနေ့ရပ်လိုက်ပါ<span className="text-[#dff6bd]">။</span></h2></div><Link href={primaryHref} className="group inline-flex shrink-0 items-center gap-5 rounded-full bg-white px-6 py-4 text-[11px] font-bold text-[#181a1f] transition hover:-translate-y-0.5">စတင်အသုံးပြုရန် <span className="transition group-hover:translate-x-1"><Arrow /></span></Link></div>
                    </section>
                </main>

                <footer className="border-t border-black/6 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between"><div><Wordmark /><p className="mt-3 text-[10px] text-black/30">Built for better dining in Myanmar.</p></div><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/25">© {new Date().getFullYear()} OoMeNee · All rights reserved</p></div></footer>
            </div>
        </>
    );
}
