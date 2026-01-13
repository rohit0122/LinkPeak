"use client";

import { motion } from "framer-motion";
import { RiFlashlightLine, RiEyeLine } from "react-icons/ri";

export default function DarkNeonTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, scale: 1.05 },
        show: { opacity: 1, scale: 1 },
    };

    const safeLinks = Array.isArray(links) ? links : [];

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-3xl mx-auto space-y-5 pb-10 px-4"
        >
            {/* Profile Header */}
            <div className="text-center p-6 border border-primary rounded-xl bg-base-300/80 backdrop-blur-md relative overflow-hidden mb-6 group shadow-[0_0_15px_-5px_theme(colors.primary)]">
                {/* Background Grid Pattern or Glow */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--p),0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--p),0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>

                <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-50 animate-pulse"></div>
                    <img
                        src={page.profile_image || "https://via.placeholder.com/150"}
                        className="relative w-24 h-24 rounded-full border-2 border-primary object-cover bg-neutral"
                        alt={page.title}
                    />
                </div>

                <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-primary drop-shadow-[0_0_5px_rgba(var(--p),0.8)] mb-2 relative z-10">{page.title}</h1>
                <p className="text-sm font-mono text-base-content/70 mb-5 relative z-10">{page.bio}</p>

                <div className="inline-flex items-center gap-2 border border-primary text-primary px-4 py-1.5 rounded-none text-xs uppercase tracking-widest font-bold bg-primary/5 hover:bg-primary/20 transition-colors">
                    <RiEyeLine /> <span className="drop-shadow-[0_0_2px_currentColor]">{page.views}</span>
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
                        group relative flex items-center w-full p-[1px]
                        rounded-lg overflow-hidden my-4
                        transition-transform duration-300 hover:scale-[1.02]
                    "
                    aria-label={link.title}
                >
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 group-hover:via-accent transition-all duration-500 translate-x-[-100%] group-hover:translate-x-[100%]"></div>

                    <div className="
                        relative w-full p-4 flex items-center justify-between
                        bg-base-200/90 backdrop-blur-sm border border-primary/20
                        text-base-content
                        group-hover:border-primary/60 group-hover:bg-base-200
                        group-hover:shadow-[0_0_20px_-5px_theme(colors.primary)]
                        transition-all duration-300 rounded-lg
                    ">
                        <div className="flex items-center gap-4">
                            <div className="text-primary group-hover:text-accent transition-colors drop-shadow-[0_0_5px_currentColor]">
                                {link.icon ? <span className="text-xl">{link.icon}</span> : <RiFlashlightLine className="text-xl" />}
                            </div>
                            <span className="font-bold text-lg tracking-wider uppercase text-base-content group-hover:text-primary group-hover:drop-shadow-[0_0_3px_currentColor] transition-all">
                                {link.title}
                            </span>
                        </div>
                    </div>
                </motion.a>
            ))}

            {safeLinks.length === 0 && (
                <div className="text-center py-8 text-primary/40 uppercase tracking-[0.2em] text-xs font-mono border border-primary/10 rounded-lg">
                    System Outline: Empty
                </div>
            )}
        </motion.section>
    );
}
