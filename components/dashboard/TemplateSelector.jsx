"use client";

import { RiLockLine } from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import UpgradeBadge from "./UpgradeBadge";

const TEMPLATES = [
    { id: "classic", name: "Classic", emoji: "📄", description: "Clean list view" },
    { id: "bento", name: "Bento", emoji: "🔳", description: "Bento-style grid" }, // Renamed from grid
    { id: "hero", name: "Hero", emoji: "⭐", description: "Visual header focus" },
    { id: "influencer", name: "Influencer", emoji: "📱", description: "Social-first layout" }, // Renamed from social
    { id: "sleek", name: "Sleek", emoji: "✨", description: "Modern polished look" }, // Renamed from modern
    { id: "minimalist", name: "Minimalist", emoji: "🌿", description: "Simple & airy" },
    { id: "glassmorphism", name: "Glass", emoji: "💎", description: "Frosted blur effect" },
    { id: "brutalist", name: "Brutalist", emoji: "🏗️", description: "Bold raw style" },
    { id: "neobrutalism", name: "NeoPop", emoji: "🎨", description: "Vibrant high contrast" },
    { id: "darkneon", name: "Cyber", emoji: "🌃", description: "Matrix glow effect" },
    { id: "elegantserif", name: "Serif", emoji: "🖋️", description: "Classy & formal" },
    { id: "tiles", name: "Tiles", emoji: "🖼️", description: "Grid of uniform cells" }, // Renamed from gridtiles
    { id: "softpastel", name: "Pastel", emoji: "🌸", description: "Gentle soft tones" },
    { id: "gradientmesh", name: "Liquid", emoji: "🌊", description: "Animated mesh colors" },
    { id: "stack", name: "Stack", emoji: "📚", description: "Physical card layer" }, // Renamed from modernCards
];

export default function TemplateSelector({ currentTemplate, plan, onSelect }) {
    const limitConfig = CONFIG.PLAN_LIMITS[plan || 'FREE'];
    const allowed = limitConfig.allowedTemplates;
    const isAllUnlocked = allowed === "ALL";

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-2 overflow-hidden">
            {TEMPLATES.map((template) => {
                const isLocked = !isAllUnlocked && !allowed.includes(template.id);
                const is_active = currentTemplate === template.id;

                return (
                    <button
                        key={template.id}
                        disabled={isLocked}
                        onClick={() => !isLocked && onSelect(template.id)}
                        className={`
                            relative group flex flex-col items-center justify-center p-4 
                            border-2 transition-all duration-300 rounded-xl
                            hover:scale-105 active:scale-95
                            ${is_active
                                ? "border-primary bg-primary/5 shadow-inner ring-2 ring-primary ring-offset-2"
                                : isLocked
                                    ? "border-base-200 opacity-50 grayscale cursor-not-allowed bg-base-200/50"
                                    : "border-base-200 hover:border-primary/30 hover:shadow-lg bg-base-100"
                            }
                        `}
                    >
                        {/* Lock Badge */}
                        {isLocked && (
                            <div className="absolute top-2 right-2 z-10">
                                <div className="p-1.5 bg-base-100 rounded-full shadow-md text-primary ring-1 ring-base-200">
                                    <RiLockLine className="text-xs" />
                                </div>
                            </div>
                        )}

                        {/* Icon / Emoji */}
                        <div className={`text-4xl mb-3 filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110 ${isLocked ? 'grayscale' : ''}`}>
                            {template.emoji}
                        </div>

                        {/* Name */}
                        <h3 className={`font-bold text-sm uppercase tracking-wide mb-1 ${is_active ? 'text-primary' : 'text-base-content/80'}`}>
                            {template.name}
                        </h3>

                        {/* Description (Optional, hidden on small screens if needed) */}
                        <p className="text-[10px] text-center opacity-50 font-medium leading-tight max-w-[80%]">
                            {template.description}
                        </p>

                        {/* Plan Badge for Locked Items */}
                        {isLocked && (
                            <UpgradeBadge
                                type={(CONFIG.PLAN_LIMITS['PRO'].allowedTemplates === "ALL" || CONFIG.PLAN_LIMITS['PRO'].allowedTemplates.includes(template.id)) ? 'PRO' : 'AGENCY'}
                                rounded={false}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
