"use client";

import { RiLayoutLine, RiGridFill, RiProfileLine, RiLayoutMasonryLine, RiUserStarLine, RiLockLine } from "react-icons/ri";
import { CONFIG } from "@/constants/config";

const TEMPLATES = [
    { id: "classic", name: "Classic", icon: RiLayoutLine, description: "Clean list view" },
    { id: "grid", name: "Grid", icon: RiGridFill, description: "Modern card grid" },
    { id: "hero", name: "Hero", icon: RiProfileLine, description: "Focus on featured content" },
    { id: "social", name: "Social Pro", icon: RiUserStarLine, description: "Influencer style layout" },
    { id: "modern", name: "Modern", icon: RiLayoutMasonryLine, description: "Asymmetric design" },
];

export default function TemplateSelector({ currentTemplate, plan, onSelect }) {
    // Get allowed templates based on plan
    const limitConfig = CONFIG.PLAN_LIMITS[plan || 'FREE'];
    const allowed = limitConfig.allowedTemplates;
    const isAllUnlocked = allowed === "ALL";

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEMPLATES.map((template) => {
                const isLocked = !isAllUnlocked && !allowed.includes(template.id);
                const isActive = currentTemplate === template.id;

                return (
                    <button
                        key={template.id}
                        disabled={isLocked}
                        onClick={() => !isLocked && onSelect(template.id)}
                        className={`relative group flex flex-col items-start p-4  border-2 transition-all text-left
                            ${isActive
                                ? "border-primary bg-primary/5 shadow-md"
                                : isLocked
                                    ? "border-base-200 opacity-60 bg-base-100/50 cursor-not-allowed"
                                    : "border-base-200 hover:border-primary/30 hover:shadow-sm bg-base-100"
                            }
                        `}
                    >
                        {isLocked && (
                            <div className="absolute top-3 right-3 p-1.5 bg-base-200  text-primary/70">
                                <RiLockLine />
                            </div>
                        )}

                        <div className={`p-3 mb-3 ${isActive ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/70'}`}>
                            <template.icon className="text-xl" />
                        </div>

                        <div>
                            <h3 className={`font-bold ${isActive ? 'text-primary' : ''}`}>{template.name}</h3>
                            <p className="text-xs opacity-50 mt-1 font-medium">{template.description}</p>
                        </div>

                        {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-base-100/10 backdrop-blur-[1px]  opacity-0 hover:opacity-100 transition-opacity">
                                <span className="badge badge-sm badge-neutral font-bold uppercase tracking-widest scale-90">
                                    {plan === 'FREE' ? 'Upgrade' : 'Agency'}
                                </span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
