"use client";

import { QRCodeCanvas } from "qrcode.react";
import { RiDownloadLine, RiQrCodeLine, RiPaletteLine } from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import { toast } from "react-hot-toast";

import { useState } from "react";

export default function QRGenerator({ slug, plan }) {
    const [fgColor, setFgColor] = useState("#000000");
    const [logo, setLogo] = useState(CONFIG.QR_LOGOS[2]); // Default to 'LinkPeakk' logo
    const canCustomize = CONFIG.PLAN_LIMITS[plan || 'FREE'].customQR; const url = `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}`;

    const downloadQR = () => {
        const canvas = document.getElementById("linkpeak-qr");
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `linkpeak-qr-${slug}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success("QR Code downloaded! Time to share. 📤");
    };

    return (
        <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
                <h2 className="card-title mb-6 flex items-center gap-2">
                    <RiQrCodeLine className="text-primary" />
                    Your QR Code
                </h2>

                <div className="bg-white p-6  shadow-inner mb-6 border-4 border-primary/10">
                    <QRCodeCanvas
                        id="linkpeak-qr"
                        value={url}
                        size={256}
                        level={"H"}
                        fgColor={fgColor}
                        includeMargin={true}
                        imageSettings={logo.url ? {
                            src: logo.url,
                            x: undefined,
                            y: undefined,
                            height: 48,
                            width: 48,
                            excavate: true,
                            crossOrigin: "anonymous",
                        } : undefined}
                    />
                </div>

                {canCustomize ? (
                    <div className="w-full mb-8">
                        <p className="text-[10px] font-medium uppercase tracking-widest opacity-40 mb-4 text-left">Custom Pixel Color</p>
                        <div className="flex flex-wrap gap-3">
                            {["#000000", "#4F46E5", "#EC4899", "#10B981", "#F59E0B", "#EF4444"].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setFgColor(color)}
                                    className={`w-10 h-10  border-2 transition-all ${fgColor === color ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-base-200'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>

                        <p className="text-[10px] font-medium uppercase tracking-widest opacity-40 mt-6 mb-4 text-left">Premium Center Logo</p>
                        <div className="flex flex-wrap gap-2">
                            {CONFIG.QR_LOGOS.map((l) => (
                                <button
                                    key={l.id}
                                    onClick={() => setLogo(l)}
                                    className={`h-12 px-4  border-2 transition-all flex items-center gap-2 ${logo.id === l.id ? 'border-primary bg-primary/5 font-medium text-primary' : 'border-base-200 hover:border-base-content/20'}`}
                                >
                                    {l.url && <img src={l.url} className="w-5 h-5" alt={l.name} crossOrigin="anonymous" />}
                                    <span className="text-[10px] uppercase tracking-wider">{l.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-primary/5  p-4 mb-8 border border-primary/10 flex items-center gap-3">
                        <div className="p-2 bg-primary/10  text-primary">
                            <RiPaletteLine className="text-sm" />
                        </div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-primary">Unlock colors with PRO</p>
                    </div>
                )}

                <p className="text-sm opacity-60 mb-6 max-w-xs">
                    Download this QR code and use it on your business cards, flyers, or social media to drive traffic to your bio page.
                </p>

                <button
                    onClick={downloadQR}
                    className="btn btn-primary btn-block gap-2"
                >
                    <RiDownloadLine className="text-xl" />
                    Download PNG
                </button>
            </div>
        </div>
    );
}
