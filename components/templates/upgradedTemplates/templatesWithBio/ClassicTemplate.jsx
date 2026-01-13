"use client";

import { motion } from "framer-motion";
import { RiArrowRightLine, RiLinkM, RiEyeFill } from "react-icons/ri";

export default function ClassicTemplate({ page, links, handleLinkClick }) {
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
            <div className="text-center mb-10">
                <div className="relative inline-block mb-4">
                    <img
                        src={page.profile_image || "https://via.placeholder.com/150"}
                        alt={page.title}
                        className="w-24 h-24 rounded-full object-cover border-2 border-base-content/10 shadow-sm mx-auto p-1 bg-base-100"
                    />
                </div>
                <h1 className="text-2xl font-bold text-base-content tracking-tight mb-2">{page.title}</h1>
                {page.bio && (
                    <p className="text-base text-base-content/70 max-w-md mx-auto leading-relaxed">{page.bio}</p>
                )}
                <div className="mt-3 flex justify-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-200 text-xs font-semibold text-base-content/60">
                        <RiEyeFill /> {page.views}
                    </div>
                </div>
            </div>

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
                            group block w-full
                            p-4
                            bg-base-100 hover:bg-base-content/5
                            border-2 border-base-content/10 hover:border-base-content/30
                            text-center relative
                            rounded-lg
                            transition-all duration-200
                        "
                        aria-label={link.title}
                    >
                        {/* Icon Positioned Absolute Left for Classic Balance */}
                        {link.icon || <RiLinkM className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-base-content/40 group-hover:text-base-content/80 transition-colors" />}
                        {link.icon && (
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-base-content/40 group-hover:text-base-content/80 transition-colors">
                                {link.icon}
                            </span>
                        )}

                        <span className="font-semibold text-base-content group-hover:text-base-content/90">
                            {link.title}
                        </span>
                    </motion.a>
                ))}
            </div>

            {safeLinks.length === 0 && (
                <div className="text-center opacity-40 py-10 font-bold">
                    Classically empty. Add some links.
                </div>
            )}
        </motion.section>
    );
}
