"use client";

import { CONFIG } from "@/constants/config";
import { RiLockLine } from "react-icons/ri";

export default function ThemeSelector({ currentTheme, plan, onSelect }) {

    const allowedThemes = CONFIG.PLAN_LIMITS[plan || 'FREE'].themes;
    const isAllUnlocked = allowedThemes === "ALL";

    console.log(' allowedThemes', allowedThemes);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {CONFIG.DAISY_THEMES.map((theme) => {
                const isLocked = !isAllUnlocked && !allowedThemes.includes(theme);

                return (
                    <button
                        key={theme}
                        disabled={isLocked}
                        onClick={() => !isLocked && onSelect(theme)}
                        className={`group flex flex-col items-center gap-2 p-3  border-2 transition-all relative ${currentTheme === theme
                            ? "border-primary bg-primary/10"
                            : isLocked ? "border-base-200 opacity-50 grayscale cursor-not-allowed" : "border-base-200 hover:border-base-content/30"
                            }`}
                        data-theme={theme}
                    >
                        {isLocked && (
                            <div className="absolute top-2 right-2 p-1 bg-base-100  shadow-sm text-primary">
                                <RiLockLine className="text-xs" />
                            </div>
                        )}
                        <div className="w-full flex gap-1 h-8  overflow-hidden border border-base-content/10">
                            <div className="flex-1 bg-primary"></div>
                            <div className="flex-1 bg-secondary"></div>
                            <div className="flex-1 bg-accent"></div>
                            <div className="flex-1 bg-neutral"></div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">
                                {theme}
                            </span>
                            {isLocked && (
                                <span className="text-[8px] font-medium text-primary uppercase pt-0.5">PRO Plan</span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
