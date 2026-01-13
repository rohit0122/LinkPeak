"use client";

import { motion } from "framer-motion";
import { RiExternalLinkLine, RiLinkM, RiEyeLine } from "react-icons/ri";

export default function GlassmorphismTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 },
    };

    const safeLinks = Array.isArray(links) ? links : [];

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-3xl mx-auto space-y-4 pb-12 px-4"
        >
            {/* Profile Header */}
            <div className="text-center p-6 rounded-3xl bg-base-100/30 backdrop-blur-xl border border-base-content/10 shadow-lg mb-6 text-base-content">
                <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                    <img
                        src={page.profile_image || "https://via.placeholder.com/150"}
                        alt={page.title}
                        className="relative w-full h-full rounded-full object-cover border-2 border-base-100 ring-2 ring-base-content/5"
                    />
                </div>
                <h1 className="text-2xl font-bold mb-2">{page.title}</h1>
                <p className="text-sm opacity-80 mb-4 font-medium max-w-[80%] mx-auto">{page.bio}</p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-base-100/50 backdrop-blur-md border border-base-content/5 text-xs font-bold uppercase tracking-wider text-primary">
                    <RiEyeLine /> {page.views}
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
                        group flex items-center justify-between w-full p-4
                        rounded-2xl
                        bg-base-100/40 backdrop-blur-md
                        border border-base-content/5
                        hover:bg-base-100/60 hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                        text-base-content
                        transition-all duration-300 ease-out
                    "
                    aria-label={link.title}
                >
                    <div className="flex items-center gap-4">
                        <div className="
                            w-12 h-12 rounded-full 
                            bg-base-content/5
                            border border-base-content/5
                            flex items-center justify-center
                            shadow-inner
                            group-hover:scale-105 transition-transform
                        ">
                            {link.icon ? (
                                <span className="text-xl text-primary">{link.icon}</span>
                            ) : (
                                <RiLinkM className="text-xl opacity-50" />
                            )}
                        </div>

                        <span className="font-semibold text-base tracking-wide flex-1">
                            {link.title}
                        </span>
                    </div>

                    <RiExternalLinkLine className="opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all duration-300" />
                </motion.a>
            ))}

            {safeLinks.length === 0 && (
                <div className="text-center py-10 opacity-50 backdrop-blur-sm rounded-xl border border-base-content/5 font-medium">
                    Empty list
                </div>
            )}
        </motion.section>
    );
}
