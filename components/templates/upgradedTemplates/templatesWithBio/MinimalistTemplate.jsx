"use client";

import { motion } from "framer-motion";
import { RiArrowRightUpLine, RiLinkM, RiEyeLine } from "react-icons/ri";

export default function MinimalistTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
    };

    const safeLinks = Array.isArray(links) ? links : [];

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-3xl mx-auto space-y-6 pb-12 px-4"
        >
            {/* Profile Header */}
            <div className="text-center space-y-4 mb-10 pt-4">
                <div className="relative inline-block group">
                    {/* Subtle rotating border ring */}
                    <div className="absolute -inset-1 rounded-full border border-base-content/5 group-hover:border-primary/30 transition-colors duration-500 scale-110"></div>
                    <div className="absolute -inset-2 rounded-full border border-dashed border-base-content/5 group-hover:border-primary/20 transition-all duration-700 animate-[spin_10s_linear_infinite] opacity-0 group-hover:opacity-100"></div>

                    <img
                        src={page.profile_image || "https://via.placeholder.com/150"}
                        alt={page.title}
                        className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-base-100 shadow-xl relative z-10"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-thin tracking-wider text-base-content mb-1 uppercase">{page.title}</h1>
                    <div className="w-10 h-[1px] bg-primary mx-auto mb-3"></div>
                    <p className="text-sm text-base-content/60 max-w-md mx-auto leading-relaxed font-light">{page.bio}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-base-content/40 uppercase tracking-[0.2em]">
                    <RiEyeLine /> <span>{page.views} Views</span>
                </div>
            </div>

            {safeLinks.map((link, i) => (
                <motion.a
                    key={link.id || i}
                    variants={item}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick?.(link.id)}
                    className="
                        group relative flex items-center justify-between 
                        w-full py-5 px-6
                        bg-base-100 border border-base-content/5 rounded-none
                        hover:border-primary/30 hover:shadow-[0_4px_20px_-10px_rgba(var(--p),0.2)]
                        transition-all duration-300
                        overflow-hidden
                    "
                    aria-label={link.title}
                >
                    {/* Hover Accent Bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>

                    <div className="flex items-center gap-6 z-10">
                        {link.icon ? (
                            <span className="text-2xl text-base-content/50 group-hover:text-primary transition-colors duration-300">{link.icon}</span>
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-base-content/20 group-hover:bg-primary transition-colors"></span>
                        )}
                        <span className="font-light text-xl text-base-content tracking-wide group-hover:tracking-wider transition-all duration-300">
                            {link.title}
                        </span>
                    </div>

                    <RiArrowRightUpLine className="text-2xl text-base-content/20 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 z-10" />
                </motion.a>
            ))}

            {safeLinks.length === 0 && (
                <div className="text-center opacity-20 py-12 font-thin text-3xl tracking-tighter">
                    ( empty )
                </div>
            )}
        </motion.section>
    );
}
