"use client";

import { useState } from "react";
import { HiSparkles, HiCheckCircle } from "react-icons/hi2";

export default function ThemeSelector({ currentTheme, onThemeSelect, isSaving }) {
    const themes = [
        {
            id: "minimal",
            name: "Minimal Peak",
            description: "Clean, focused, and distraction-free.",
            previewColor: "bg-slate-50",
            borderColor: "border-slate-200"
        },
        {
            id: "creator",
            name: "Creator Pulse",
            description: "Vibrant and engaging for digital creators.",
            previewColor: "bg-gradient-to-br from-primary/10 to-transparent",
            borderColor: "border-primary/20"
        },
        {
            id: "professional",
            name: "Executive Suite",
            description: "Polished and authoritative for professionals.",
            previewColor: "bg-slate-900",
            borderColor: "border-slate-800",
            dark: true
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => onThemeSelect(theme.id)}
                        disabled={isSaving}
                        className={`relative group p-6 rounded-[2rem] border-2 text-left transition-all duration-300 ${currentTheme === theme.id
                                ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                                : "border-base-300 hover:border-base-content/20 hover:scale-[1.01]"
                            }`}
                    >
                        {currentTheme === theme.id && (
                            <div className="absolute top-4 right-4 text-primary animate-in zoom-in duration-300">
                                <HiCheckCircle className="w-6 h-6" />
                            </div>
                        )}

                        <div className={`w-full h-24 rounded-2xl mb-4 ${theme.previewColor} border ${theme.borderColor} shadow-inner flex items-center justify-center`}>
                            <div className={`w-12 h-1.5 rounded-full ${theme.dark ? 'bg-white/20' : 'bg-black/10'}`} />
                        </div>

                        <div className="space-y-1">
                            <h3 className="font-black text-sm tracking-tight">{theme.name}</h3>
                            <p className="text-[10px] font-bold opacity-40 leading-relaxed">{theme.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
