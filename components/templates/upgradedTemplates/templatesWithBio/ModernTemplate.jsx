"use client";

import { motion } from "framer-motion";
import { RiExternalLinkLine, RiEyeFill } from "react-icons/ri";

export default function ModernTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 },
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
            <header className="flex flex-col items-center mb-10">
                <div className="relative mb-6 group">
                    {/* Modern square-ish avatar with rounded corners */}
                    <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-secondary rounded-[2.2rem] opacity-70 blur-md group-hover:opacity-100 transition duration-500"></div>
                    <img
                        src={page.profile_image || "https://via.placeholder.com/150"}
                        alt={page.title}
                        className="relative w-28 h-28 rounded-[2rem] object-cover shadow-lg border-4 border-base-100 group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute -bottom-3 -right-3 bg-base-100 p-1.5 rounded-xl shadow-md">
                        <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                            <RiEyeFill /> {page.views}
                        </div>
                    </div>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-base-content mb-2">{page.title}</h1>
                <p className="text-base font-medium text-base-content/60 max-w-lg text-center leading-relaxed">{page.bio}</p>
            </header>

            <div className="space-y-4">
                {safeLinks.map((link, i) => (
                    <motion.a
                        key={link.id || i}
                        variants={item}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleLinkClick?.(link.id)}
                        className="
                            group relative block w-full
                            rounded-2xl
                            transition-transform duration-300
                            hover:-translate-y-1
                        "
                        aria-label={link.title}
                    >
                        {/* Bold Gradient Border Wrapper */}
                        <div className="
                            absolute -inset-[2px] 
                            bg-gradient-to-r from-primary via-secondary to-accent 
                            rounded-2xl 
                            opacity-70 group-hover:opacity-100 
                            blur-[2px] group-hover:blur-[3px]
                            transition-all duration-300
                        "></div>

                        {/* Content Container (Solid Background for Contrast) */}
                        <div className="
                            relative flex items-center justify-between
                            w-full px-5 py-4
                            bg-base-100 rounded-2xl
                            border border-base-100
                            transition-all duration-300
                            group-hover:bg-base-100/95
                        ">
                            <div className="flex items-center gap-5 min-w-0">
                                <div className="
                                    flex items-center justify-center
                                    w-12 h-12 rounded-xl
                                    bg-base-200/50 group-hover:bg-base-200
                                    text-2xl text-base-content/80 group-hover:text-primary
                                    transition-all duration-300
                                ">
                                    {link.icon || <span className="opacity-50">#</span>}
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-lg text-base-content tracking-tight group-hover:text-primary transition-colors">
                                        {link.title}
                                    </span>
                                    <span className="text-xs font-semibold text-base-content/40 tracking-wide uppercase">
                                        Open Link
                                    </span>
                                </div>
                            </div>

                            <div className="
                                w-8 h-8 rounded-full 
                                bg-base-200/50 group-hover:bg-primary/10 
                                flex items-center justify-center
                                text-base-content/40 group-hover:text-primary
                                transition-all duration-300
                            ">
                                <RiExternalLinkLine className="text-lg group-hover:rotate-45 transition-transform duration-300" />
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>

            {safeLinks.length === 0 && (
                <div className="text-center opacity-40 py-10 font-bold">
                    Start adding your links.
                </div>
            )}
        </motion.section>
    );
}
