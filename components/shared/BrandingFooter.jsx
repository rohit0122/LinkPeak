"use client";

import Link from "next/link";
import { CONFIG } from "@/constants/config";

export default function BrandingFooter({ branding }) {
    // If user has removed watermark (paid feature)
    if (branding?.removeWatermark) {
        // If they have custom branding text
        if (branding?.customText) {
            return (
                <div className="mt-6 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">
                        Created by
                    </span>
                    {branding.customUrl ? (
                        <a
                            href={branding.customUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium tracking-tighter opacity-70 hover:text-primary hover:opacity-100 transition-all"
                        >
                            {branding.customText}
                        </a>
                    ) : (
                        <span className="text-xs font-medium tracking-tighter opacity-70">
                            {branding.customText}
                        </span>
                    )}
                </div>
            );
        }
        // Removed watermark and no custom text -> Show nothing
        return null;
    }

    // Default: Show LinkPeak Watermark
    return (
        <div className="mt-6 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">
                Powered by
            </span>
            <span className="text-xs font-medium tracking-tighter opacity-70">
                <Link
                    href={CONFIG.SITE_URL || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {CONFIG.SITE_NAME || "LinkPeak"}
                </Link>
            </span>
        </div>
    );
}
