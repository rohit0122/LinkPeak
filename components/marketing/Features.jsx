"use client";

import { CONFIG } from "@/constants/config";
import { RiBarChartBoxLine, RiHeartFill, RiPaletteLine } from "react-icons/ri";
import { motion } from "framer-motion";

const features = [
    {
        title: "Live Analytics",
        description: "Track every view and click in real-time. Understand your audience with high-resolution engagement data.",
        icon: RiBarChartBoxLine,
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        title: "Fan Love",
        description: "Turn visitors into fans with the first-ever link-in-bio 'Like' button. Gamify your links and see the love flow.",
        icon: RiHeartFill,
        color: "text-pink-500",
        bg: "bg-pink-50"
    },
    {
        title: "Custom Branding",
        description: `${CONFIG.DAISY_THEMES.length}+ high-end color themes and ${CONFIG.PLAN_LIMITS.PRO.allowedTemplates.length} pro templates. Your bio page should look as unique as your content.`,
        icon: RiPaletteLine,
        color: "text-purple-500",
        bg: "bg-purple-50"
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-base-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">Why Creators Choose {CONFIG.SITE_NAME}</h2>
                    <p className="text-xl opacity-60">The only platform built for high-performance engagement.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12" role="list">
                    {features.map((f, i) => (
                        <motion.article
                            key={i}
                            className="group flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            role="listitem"
                        >
                            <div className={`w-20 h-20  ${f.bg} flex items-center justify-center mb-8 transition-transform group-hover:rotate-6 group-hover:scale-110 duration-300 shadow-sm border border-base-200`}>
                                <f.icon className={`text-4xl ${f.color}`} aria-hidden="true" />
                            </div>
                            <h3 className="text-2xl font-medium mb-4 tracking-tight">{f.title}</h3>
                            <p className="text-base-content/70 leading-relaxed font-medium">
                                {f.description}
                            </p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

