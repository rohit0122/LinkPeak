"use client";
import { useState } from 'react';
import { HiQrCode, HiArrowDownTray, HiShare } from "react-icons/hi2";

export function QRModal({ url, title }) {
    const [emoji, setEmoji] = useState('🚀');
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}`;

    const downloadQR = async () => {
        try {
            const response = await fetch(qrImageUrl);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `linkpeak-qr-${title}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("QR Download failed", error);
        }
    };

    return (
        <>
            {/* Open the modal using ID.showModal() method */}
            <button
                className="btn btn-circle btn-sm btn-outline border-base-300"
                onClick={() => document.getElementById(`qr_modal_${title.replace(/\s+/g, '_')}`).showModal()}
            >
                <HiQrCode className="text-lg" />
            </button>

            <dialog id={`qr_modal_${title.replace(/\s+/g, '_')}`} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-base-100 border border-base-300 shadow-2xl">
                    <h3 className="font-black text-2xl tracking-tight mb-8 text-center">Smart QR Code</h3>

                    <div className="flex flex-col items-center gap-8">
                        <div className="p-6 bg-white rounded-3xl shadow-xl">
                            <img
                                src={qrImageUrl}
                                alt={`QR Code for ${title}`}
                                className="w-64 h-64"
                            />
                        </div>

                        <div className="flex gap-4 w-full">
                            <button onClick={downloadQR} className="btn btn-primary flex-1 rounded-2xl font-black shadow-lg shadow-primary/20">
                                <HiArrowDownTray className="text-xl" />
                                Download PNG
                            </button>
                            <button className="btn btn-outline border-base-300 rounded-2xl">
                                <HiShare className="text-xl" />
                            </button>
                        </div>
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost btn-sm font-bold uppercase tracking-widest opacity-40">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}
