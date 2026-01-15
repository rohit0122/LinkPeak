"use client";

import { motion } from "framer-motion";
import Avatar from "@/components/shared/Avatar";
import { RiArrowRightUpLine, RiEyeFill, RiLinkM } from "react-icons/ri";

export default function BentoTemplate({ page, links, handleLinkClick, isLCP = false }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 },
    };

    const safeLinks = Array.isArray(links) ? links : [];

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-3xl mx-auto space-y-6 pb-12 px-4"
        >
            {/* Profile Header - Compact for Grid */}
            <div className="flex items-end gap-4 mb-6 px-2">
                <Avatar
                    src={page.profile_image}
                    alt={page.title}
                    size={80}
                    shape="rounded-lg"
                    priority={isLCP}
                    className="shadow-sm bg-base-200"
                />
                <div className="mb-1 flex-1 min-w-0">
                    <h1 className="text-2xl font-black text-base-content leading-none mb-1">{page.title}</h1>
                    <div className="flex items-center gap-2 text-xs font-bold text-base-content/50 mb-2">
                        <RiEyeFill />
                        <span>{page.views} Views</span>
                    </div>
                    {page.bio && (
                        <p className="text-sm text-base-content/70 leading-snug line-clamp-2 max-w-lg">
                            {page.bio}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[120px]">
                {safeLinks.map((link, index) => {
                    // Bento Logic: 
                    // Index 0: Large square (2x2)
                    // Index 3: Wide (2x1)
                    // Others: Small (1x1)
                    const isHero = index === 0;
                    const isWide = index === 3;

                    let colSpan = "col-span-1";
                    let rowSpan = "row-span-1";

                    if (isHero) {
                        colSpan = "col-span-2 md:col-span-2";
                        rowSpan = "row-span-2";
                    } else if (isWide) {
                        colSpan = "col-span-2 md:col-span-1"; // Wide on mobile, standard on desktop
                    }

                    return (
                        <motion.a
                            key={link.id || index}
                            variants={item}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleLinkClick?.(link.id)}
                            className={`
                                group relative
                                overflow-hidden
                                rounded-3xl
                                ${colSpan} ${rowSpan}
                                ${page.theme === 'aurora' ? 'glass-card' : 'bg-base-100 hover:bg-base-200'}
                                border border-base-content/5
                                shadow-sm hover:shadow-xl hover:shadow-primary/10
                                transition-all duration-300
                                hover:scale-[0.98]
                                ${page.theme === 'cyberglow' ? 'neon-glow' : ''}
                                ${['velvetgold', 'royal'].includes(page.theme) ? 'premium-shimmer' : ''}
                            `}
                        >
                            {/* 1. Large Decorative Watermark Icon (Fills space) */}
                            <div className="
                                absolute -right-6 -bottom-6 
                                text-base-content/5 group-hover:text-primary/10 
                                transition-colors duration-500
                                rotate-12 group-hover:rotate-0
                            ">
                                {link.icon ? (
                                    <div className="text-[8rem] leading-none opacity-50">{link.icon}</div>
                                ) : (
                                    <RiLinkM className="text-[8rem] leading-none opacity-50" />
                                )}
                            </div>

                            {/* 2. Content Container */}
                            <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className={`
                                        rounded-2xl flex items-center justify-center bg-base-200/80 backdrop-blur-sm text-base-content shadow-sm border border-base-content/5
                                        group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300
                                        ${isHero ? "w-14 h-14 text-2xl" : "w-10 h-10 text-xl"}
                                    `}>
                                        {link.icon || <RiLinkM />}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-base-content/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                        <RiArrowRightUpLine className="opacity-50 group-hover:opacity-100 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className={`
                                        font-bold block leading-tight text-base-content
                                        ${isHero ? "text-3xl tracking-tight" : "text-sm"}
                                    `}>
                                        {link.title}
                                    </span>
                                    {isHero && (
                                        <span className="text-sm opacity-60 mt-2 block max-w-[90%] truncate bg-base-content/5 rounded-md px-2 py-1 w-fit">
                                            {(link.url || "").replace(/^https?:\/\//, '')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.a>
                    );
                })}
            </div>

            {safeLinks.length === 0 && (
                <div className="h-64 rounded-3xl bg-base-200/50 border-2 border-dashed border-base-content/10 flex items-center justify-center flex-col gap-2 text-base-content/40">
                    <span className="text-4xl opacity-50">🍱</span>
                    <span className="font-bold">Build your Bento</span>
                </div>
            )}
        </motion.section>
    );
}
