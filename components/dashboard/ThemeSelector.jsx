"use client";

import { CONFIG } from "@/constants/config";
import { RiLockLine } from "react-icons/ri";

export default function ThemeSelector({ currentTheme, plan, onSelect }) {

    const allowedThemes = CONFIG.PLAN_LIMITS[plan || 'FREE'].themes;
    const isAllUnlocked = allowedThemes === "ALL";

    //console.log(' allowedThemes', allowedThemes);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-base-100 p-2 overflow-hidden">
            {CONFIG.DAISY_THEMES.map((themeObj) => {
                const themeId = themeObj.id;
                const themeLabel = themeObj.label;

                // Check if plan allows widespread "ALL" or specific list
                const isLocked = !isAllUnlocked && !allowedThemes.includes(themeId);
                const is_active = currentTheme === themeId;

                return (
                    <button
                        key={themeId}
                        disabled={isLocked}
                        onClick={() => !isLocked && onSelect(themeId)}
                        className={`
                            relative group flex flex-col items-center gap-3 p-4 
                            border-2 transition-all duration-300 rounded-xl
                            hover:scale-105 active:scale-95 bg-base-100
                            ${is_active
                                ? "border-primary bg-base-100 shadow-inner ring-2 ring-primary ring-offset-2"
                                : isLocked
                                    ? "border-base-200 opacity-50 grayscale cursor-not-allowed"
                                    : "border-base-200 hover:border-primary/30 hover:shadow-lg"
                            }
                        `}
                        data-theme={themeId}
                        suppressHydrationWarning={true}
                    >
                        {/* Lock Badge */}
                        {isLocked && (
                            <div className="absolute top-2 right-2 z-10">
                                <div className="p-1.5 bg-base-100 rounded-full shadow-md text-primary ring-1 ring-base-200">
                                    <RiLockLine className="text-xs" />
                                </div>
                            </div>
                        )}

                        {/* Color Swatch Preview */}
                        <div className="w-full h-10 flex overflow-hidden rounded-lg shadow-sm ring-1 ring-base-content/5">
                            <div className="flex-1 bg-primary"></div>
                            <div className="flex-1 bg-secondary"></div>
                            <div className="flex-1 bg-accent"></div>
                            <div className="flex-1 bg-neutral"></div>
                        </div>

                        {/* Theme Name */}
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                                {themeLabel}
                            </span>
                        </div>

                        {/* Plan Badge for Locked Items */}
                        {isLocked && (
                            <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <span className="badge badge-xs badge-neutral font-bold uppercase tracking-widest px-2 py-2">
                                    PRO
                                </span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
