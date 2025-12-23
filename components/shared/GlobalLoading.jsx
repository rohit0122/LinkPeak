"use client";

import { useEffect, useState } from "react";

export default function GlobalLoading() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Expose setLoading to the window so the axios interceptor can use it
        window.setGlobalLoading = setLoading;

        return () => {
            delete window.setGlobalLoading;
        };
    }, []);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="bg-base-100 p-6  shadow-2xl flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="font-medium text-sm animate-pulse text-base-content/70">Syncing with LinkPeak...</p>
            </div>
        </div>
    );
}
