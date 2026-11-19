import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

const qrOptions = {
    errorCorrectionLevel: 'H',
    margin: 3,
    width: 768,
    color: {
        dark: '#181A1FFF',
        light: '#FFFFFFFF',
    },
};

export default function MenuQrModal({ open, onClose, shop }) {
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!open) {
            return undefined;
        }

        let active = true;

        setQrDataUrl('');
        setError('');
        setCopied(false);

        QRCode.toDataURL(shop.menu_url, qrOptions)
            .then((dataUrl) => {
                if (active) {
                    setQrDataUrl(dataUrl);
                }
            })
            .catch(() => {
                if (active) {
                    setError('QR code ပြုလုပ်လို့မရပါ။ ပြန်ဖွင့်ပြီး ထပ်စမ်းကြည့်ပါ။');
                }
            });

        return () => {
            active = false;
        };
    }, [open, shop.menu_url]);

    const copyMenuUrl = async () => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shop.menu_url);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = shop.menu_url;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }

            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    };

    const downloadQrCode = () => {
        if (!qrDataUrl) {
            return;
        }

        const downloadLink = document.createElement('a');
        downloadLink.href = qrDataUrl;
        downloadLink.download = `${shop.menu_slug}-menu-qr.png`;
        downloadLink.click();
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-[#181a1f]/45 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 overflow-y-auto px-4 py-6 sm:py-10">
                <div className="flex min-h-full items-center justify-center">
                    <DialogPanel className="w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_90px_rgba(24,26,31,0.28)] sm:rounded-[2rem]">
                        <div className="flex items-start justify-between gap-5 border-b border-black/6 px-5 py-5 sm:px-7 sm:py-6">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6b5cff]">Public menu QR</p>
                                <DialogTitle className="mt-2 text-xl font-bold tracking-[-0.035em]">{shop.name} Menu QR</DialogTitle>
                                <p className="mt-2 text-[12px] leading-5 text-black/40">စားပွဲပေါ်မှာထားဖို့ QR code ကို PNG အဖြစ် download လုပ်နိုင်ပါတယ်။</p>
                            </div>
                            <button type="button" onClick={onClose} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f3f3f0] text-lg text-black/35 transition hover:text-black" aria-label="Close QR code">
                                ×
                            </button>
                        </div>

                        <div className="p-5 sm:p-7">
                            <div className="mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-black/6 bg-[#f8f8f6] p-4 shadow-inner sm:max-w-[300px]">
                                {qrDataUrl ? (
                                    <img src={qrDataUrl} alt={`${shop.name} public menu QR code`} className="size-full rounded-2xl" />
                                ) : error ? (
                                    <p className="max-w-52 text-center text-[12px] leading-6 text-red-500">{error}</p>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-black/35">
                                        <span className="size-7 animate-spin rounded-full border-2 border-black/10 border-t-[#6b5cff]" />
                                        <span className="text-[11px] font-semibold">QR code ပြုလုပ်နေပါတယ်…</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-black/6 bg-[#f8f8f6] p-3.5">
                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">Public menu URL</p>
                                    <p className="mt-1 truncate text-[11px] font-semibold text-black/60">{shop.menu_url}</p>
                                </div>
                                <button type="button" onClick={copyMenuUrl} className="shrink-0 rounded-full bg-white px-3 py-2 text-[10px] font-bold text-[#6b5cff] shadow-sm transition hover:-translate-y-0.5">
                                    {copied ? 'Copied ✓' : 'Copy'}
                                </button>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-2.5">
                                <button type="button" onClick={onClose} className="min-h-12 rounded-full bg-[#f3f3f0] px-4 text-[12px] font-bold text-black/45 transition hover:text-black">Cancel</button>
                                <button type="button" onClick={downloadQrCode} disabled={!qrDataUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#181a1f] px-4 text-[12px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2b2d32] disabled:cursor-not-allowed disabled:opacity-35">
                                    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M5 20h14" /></svg>
                                    Download PNG
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
