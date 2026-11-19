import { Head } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';

const money = (value) => new Intl.NumberFormat('en-US').format(value);

const categorySymbol = (category) => {
    const symbols = {
        'Myanmar Breakfast': '☀',
        'Rice & Noodles': '♨',
        'Main Dishes': '●',
        Salads: '❋',
        Starters: '◇',
        Soups: '◌',
        'Cold Drinks': '◍',
        Coffee: '☕',
        Desserts: '✦',
    };

    return symbols[category] ?? '•';
};

export default function Show({ shop, menu_items: menuItems }) {
    const categories = useMemo(() => [...new Set(menuItems.map((item) => item.category))], [menuItems]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [logoFailed, setLogoFailed] = useState(false);
    const [search, setSearch] = useState('');
    const categoryScrollRef = useRef(null);
    const categoryDragRef = useRef({ active: false, moved: false, scrollLeft: 0, startX: 0 });
    const themeColor = shop.theme_color || '#1F573F';

    const startCategoryDrag = (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) {
            return;
        }

        categoryDragRef.current = {
            active: true,
            moved: false,
            scrollLeft: event.currentTarget.scrollLeft,
            startX: event.clientX,
        };
    };

    const moveCategoryDrag = (event) => {
        const drag = categoryDragRef.current;

        if (!drag.active || event.pointerType !== 'mouse') {
            return;
        }

        const distance = event.clientX - drag.startX;

        if (Math.abs(distance) > 6 && !drag.moved) {
            drag.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
        }

        if (!drag.moved) {
            return;
        }

        event.preventDefault();
        event.currentTarget.scrollLeft = drag.scrollLeft - distance;
    };

    const stopCategoryDrag = (event) => {
        if (!categoryDragRef.current.active) {
            return;
        }

        categoryDragRef.current.active = false;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        window.setTimeout(() => {
            categoryDragRef.current.moved = false;
        }, 0);
    };

    const preventCategoryClickAfterDrag = (event) => {
        if (!categoryDragRef.current.moved) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
    };

    const filteredItems = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();

        return menuItems.filter((item) => {
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            const matchesSearch = !query || `${item.name} ${item.description ?? ''} ${item.category}`.toLocaleLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, menuItems, search]);

    return (
        <>
            <Head title={`${shop.name} Menu`}>
                <meta name="description" content={`${shop.name} digital menu`} />
            </Head>

            <div
                className="min-h-screen border-t-[7px] border-[var(--menu-primary)] bg-[#f4f2eb] font-sans text-[#17231d] selection:bg-[var(--menu-primary)] selection:text-white"
                style={{ '--menu-primary': themeColor, '--menu-soft': `${themeColor}14` }}
            >
                <main className="mx-auto w-full max-w-2xl px-4 pb-14 pt-7 sm:px-6 sm:pt-9">
                    <header className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3.5">
                            {logoFailed ? (
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--menu-primary)] text-base font-extrabold text-white shadow-sm sm:size-14">{shop.name.charAt(0).toUpperCase()}</span>
                            ) : (
                                <img
                                    src={shop.logo_url}
                                    alt={`${shop.name} logo`}
                                    onError={() => setLogoFailed(true)}
                                    className="size-12 shrink-0 rounded-2xl border border-black/5 bg-white object-cover shadow-sm sm:size-14"
                                />
                            )}
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a87322]">Restaurant menu</p>
                                <h1 className="mt-1 truncate text-xl font-extrabold tracking-[-0.035em] sm:text-2xl">
                                    {shop.name} <span className="font-semibold">Menu</span>
                                </h1>
                            </div>
                        </div>
                        <span className="shrink-0 rounded-full border border-black/5 bg-white/80 px-3.5 py-2 text-[11px] font-bold text-[var(--menu-primary)] shadow-sm">
                            {menuItems.length} items
                        </span>
                    </header>

                    <label className="mt-6 flex h-14 items-center gap-3 rounded-[1.15rem] bg-white px-4 shadow-[0_8px_24px_rgba(46,39,26,0.045)] sm:h-16 sm:px-5">
                        <svg aria-hidden="true" className="size-5 shrink-0 text-[#839088]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m16.5 16.5 4 4" />
                        </svg>
                        <span className="sr-only">Search menu</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Menu ရှာရန်..."
                            className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-medium text-[#17231d] placeholder:text-black/28 focus:ring-0"
                        />
                        {search && (
                            <button type="button" onClick={() => setSearch('')} className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f1f0ea] text-[12px] text-black/35" aria-label="Clear search">×</button>
                        )}
                    </label>

                    {categories.length > 0 && (
                        <nav
                            ref={categoryScrollRef}
                            className="menu-scrollbar -mx-4 mt-4 flex cursor-grab touch-pan-y select-none gap-2 overflow-x-auto px-4 pb-2 active:cursor-grabbing sm:-mx-6 sm:px-6"
                            aria-label="Menu categories"
                            onClickCapture={preventCategoryClickAfterDrag}
                            onPointerDown={startCategoryDrag}
                            onPointerMove={moveCategoryDrag}
                            onPointerUp={stopCategoryDrag}
                            onPointerCancel={stopCategoryDrag}
                        >
                            <button
                                type="button"
                                onClick={() => setActiveCategory('all')}
                                className={`shrink-0 rounded-xl px-4 py-2.5 text-[11px] font-bold transition ${activeCategory === 'all' ? 'bg-[var(--menu-primary)] text-white shadow-sm' : 'border border-black/5 bg-white text-black/45 hover:text-[var(--menu-primary)]'}`}
                            >
                                အားလုံး
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className={`shrink-0 rounded-xl px-4 py-2.5 text-[11px] font-bold transition ${activeCategory === category ? 'bg-[var(--menu-primary)] text-white shadow-sm' : 'border border-black/5 bg-white text-black/45 hover:text-[var(--menu-primary)]'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </nav>
                    )}

                    {filteredItems.length > 0 ? (
                        <section className="mt-5 grid gap-3.5" aria-label="Menu items">
                            {filteredItems.map((item) => (
                                <article key={item.id} className="flex min-h-32 gap-3.5 rounded-[1.35rem] bg-white p-2.5 shadow-[0_9px_28px_rgba(46,39,26,0.065)] sm:min-h-36 sm:gap-4 sm:p-3">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="aspect-square w-28 shrink-0 rounded-[1rem] object-cover sm:w-30" />
                                    ) : (
                                        <div className="flex aspect-square w-28 shrink-0 flex-col items-center justify-center rounded-[1rem] bg-[var(--menu-soft)] text-[var(--menu-primary)] sm:w-30">
                                            <span className="text-2xl">{categorySymbol(item.category)}</span>
                                            <span className="mt-2 max-w-20 truncate text-[7px] font-bold uppercase tracking-[0.1em] opacity-55">{item.category}</span>
                                        </div>
                                    )}

                                    <div className="flex min-w-0 flex-1 flex-col px-1 py-1 sm:py-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="truncate pt-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#a87322]">{item.category}</p>
                                            <span className="shrink-0 rounded-lg bg-[var(--menu-soft)] px-2.5 py-1.5 text-[12px] font-extrabold text-[var(--menu-primary)]">{money(item.price)} ကျပ်</span>
                                        </div>
                                        <h2 className="mt-2 text-base font-extrabold leading-6 tracking-[-0.02em] sm:text-[17px]">{item.name}</h2>
                                        {item.description && <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-black/42 sm:text-[13px]">{item.description}</p>}
                                    </div>
                                </article>
                            ))}
                        </section>
                    ) : (
                        <section className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-[1.35rem] bg-white px-6 text-center shadow-[0_9px_28px_rgba(46,39,26,0.055)]">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--menu-soft)] text-lg text-[var(--menu-primary)]">⌕</span>
                            <h2 className="mt-4 text-[12px] font-extrabold">Menu မတွေ့ပါ</h2>
                            <p className="mt-2 text-[9px] leading-5 text-black/35">ရှာဖွေထားတဲ့ စာလုံး ဒါမှမဟုတ် category ကို ပြောင်းပြီး ပြန်ရှာကြည့်ပါ။</p>
                        </section>
                    )}

                    <footer className="flex items-center justify-between px-1 pt-9 text-[7px] font-bold uppercase tracking-[0.15em] text-black/25">
                        <span>Powered by OoMeNee</span>
                        <span>QR E-Menu</span>
                    </footer>
                </main>
            </div>
        </>
    );
}
