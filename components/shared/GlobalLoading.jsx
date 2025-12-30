"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

export default function GlobalLoading() {
    const { loading, setLoading } = useLoading();
    const pathname = usePathname();

    // We remove the automatic hiding on pathname change to allow 
    // the loader to persist through slow page loads (e.g., login to dashboard)
    // useEffect(() => {
    //     setLoading(false);
    // }, [pathname, setLoading]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="bg-base-100 p-6  shadow-2xl flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="font-medium text-sm animate-pulse text-base-content/70">Working on your request...</p>
            </div>
        </div>
    );
}
