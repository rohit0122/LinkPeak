"use client";

import { RiLockLine } from "react-icons/ri";
import { CONFIG } from "@/constants/config";

const TEMPLATES = [
    { id: "classic", name: "Classic", emoji: "📄", description: "Clean list view" },
    { id: "grid", name: "Grid", emoji: "🔳", description: "Bento-style grid" },
    { id: "hero", name: "Hero", emoji: "⭐", description: "Highlighted feature" },
    { id: "social", name: "Social", emoji: "📱", description: "Influencer layout" },
    { id: "modern", name: "Modern", emoji: "✨", description: "Sleek & minimal" },
];

export default function TemplateSelector({ currentTemplate, plan, onSelect }) {
    const limitConfig = CONFIG.PLAN_LIMITS[plan || 'FREE'];
    const allowed = limitConfig.allowedTemplates;
    const isAllUnlocked = allowed === "ALL";

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-base-100 p-2 border border-base-300 shadow-sm rounded-xl overflow-hidden">
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
                            <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <span className="badge badge-xs badge-neutral font-bold uppercase tracking-widest px-2 py-2">
                                    {plan === 'FREE' ? 'PRO' : 'AGENCY'}
                                </span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
