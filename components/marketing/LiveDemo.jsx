"use client";

import { useState } from "react";
import PreviewPhone from "@/components/shared/PreviewPhone";
import ThemeSelector from "@/components/dashboard/ThemeSelector";
import { RiPaletteLine, RiMagicLine, RiArrowRightUpLine } from "react-icons/ri";
import { CONFIG } from "@/constants/config";

export default function LiveDemo() {
    const [theme, setTheme] = useState("light");

    const demoPage = {
        theme: theme,
        title: "Eco Wanderer 🌿",
        bio: "Sustainable living & ethical travel tips for the modern soul.",
        profileImage: "/avatars/avatar-generic-eco.svg",
        template: "classic",
        socialLinks: {
            instagram: "instagram.com",
            facebook: "facebook.com",
            linkedin: "linkedin.com"
        }
    };

    const demoLinks = [
        { id: 1, title: "Zero Waste Guide 🌍", url: `${CONFIG.SITE_URL}/demo/eco-wanderer?theme=${theme}`, isActive: true },
        { id: 2, title: "My Ethical Kit 👜", url: `${CONFIG.SITE_URL}/demo/eco-wanderer?theme=${theme}`, isActive: true },
        { id: 3, title: "Eco-stays in Bali 🛖", url: `${CONFIG.SITE_URL}/demo/eco-wanderer?theme=${theme}`, isActive: true },
    ];

    return (
        <section id="demo" className="py-24 bg-base-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 flex justify-center">
                        <div className="scale-90 lg:scale-110 transform-gpu origin-center will-change-transform">
                            <PreviewPhone pageData={demoPage} links={demoLinks} key={demoLinks.map(l => l.id).join("-")} />
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="badge badge-secondary gap-2 p-4 font-bold tracking-widest uppercase mb-8">
                            <RiMagicLine /> Interactive Demo
                        </div>

                        <h2 className="text-5xl font-medium tracking-tighter mb-8 leading-none">
                            Style your identity <span className="text-primary italic">instantly.</span>
                        </h2>

                        <p className="text-xl opacity-60 mb-12 font-medium leading-relaxed">
                            Why settle for generic? Switch between 8+ color themes and watch your bio page transform in real-time. No code, no design skills needed.
                        </p>

                        <div className="card bg-base-100 shadow-2xl border border-base-300">
                            <div className="card-body p-8">
                                <h3 className="font-medium text-xl mb-6 flex items-center gap-2">
                                    <RiPaletteLine className="text-primary" />
                                    Pick a palette to play
                                </h3>
                                <ThemeSelector
                                    currentTheme={theme}
                                    onSelect={setTheme}
                                    plan={'DEMO'}
                                />
                                <div className="mt-8 pt-8 border-t border-base-200 flex justify-center">
                                    <a href="/register" className="btn btn-primary btn-block gap-2 shadow-lg shadow-primary/20">
                                        Claim Your Link Now <RiArrowRightUpLine className="text-xl" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
