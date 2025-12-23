"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { RiDownloadLine, RiCloseLine, RiQrCodeLine, RiShareLine } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { CONFIG } from "@/constants/config";

export default function QRModal({ slug, isOpen, onClose }) {
    const [centerIcon, setCenterIcon] = useState("Peak");
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/${slug}`;
    /*
        const icons = [
            { name: "LinkPeak", url: "https://api.dicebear.com/7.x/shapes/svg?seed=LinkPeak" },
            { name: "Star", url: "https://api.dicebear.com/7.x/shapes/svg?seed=Star" },
            { name: "Heart", url: "https://api.dicebear.com/7.x/shapes/svg?seed=Heart" },
            { name: "Bolt", url: "https://api.dicebear.com/7.x/shapes/svg?seed=Bolt" },
        ];*/

    const icons = CONFIG.QR_LOGOS;
    const downloadQR = () => {
        const canvas = document.getElementById("share-qr-canvas");
        if (!canvas) return;

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${CONFIG.SITE_NAME.replace(" ", "-").toLowerCase()}-qr-${slug || 'profile'}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success("QR Code saved to your device! 📲");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-base-100 w-full max-w-sm  shadow-2xl overflow-hidden border border-white/10 animate-in zoom-in-95 duration-300">
                <div className="p-8 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 text-primary">
                                <RiQrCodeLine className="text-xl" />
                            </div>
                            <h2 className="font-medium text-xl">Share Profile</h2>
                        </div>
                        <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
                            <RiCloseLine className="text-xl" />
                        </button>
                    </div>

                    {/* QR Code Canvas Container */}
                    <div className="bg-white p-2 shadow-inner mb-8 border-4 border-primary/5">
                        <QRCodeCanvas
                            id="share-qr-canvas"
                            value={url}
                            size={200}
                            level={"H"}
                            includeMargin={true}
                            imageSettings={{
                                src: icons.find(i => i.name === centerIcon).url,
                                x: undefined,
                                y: undefined,
                                height: 40,
                                width: 40,
                                excavate: true,
                                crossOrigin: "anonymous",
                            }}
                        />
                    </div>

                    {/* Icon Selection */}
                    <div className="w-full mb-8">
                        <p className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-3 ml-1 text-center">Center Icon</p>
                        <div className="grid grid-cols-4 gap-2">
                            {icons.map((icon) => (
                                <button
                                    key={icon.name}
                                    onClick={() => setCenterIcon(icon.name)}
                                    className={`w-10 h-10 flex items-center justify-center border-2 transition-all overflow-hidden ${centerIcon === icon.name ? "border-primary bg-primary/5 p-1" : "border-base-200 hover:border-primary/30 p-2"
                                        }`}
                                >
                                    {icon.url ? <img src={icon.url} alt={icon.name} className="w-8 h-8" /> : <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">{icon.name}</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <button onClick={downloadQR} className="btn btn-primary btn-block  gap-2 font-medium">
                            <RiDownloadLine className="text-xl" /> Download PNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
