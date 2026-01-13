"use client";

import { motion } from "framer-motion";
import { RiEyeLine } from "react-icons/ri";

export default function ElegantSerifTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 },
    };

    const safeLinks = Array.isArray(links) ? links : [];

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-3xl mx-auto space-y-6 pb-12 px-8 font-serif"
        >
            {/* Profile Header */}
            <div className="text-center mb-10 pt-4 border-b border-base-content/10 pb-8">
                <div className="relative inline-block mb-6">
                    <img
                        src={page.profile_image || "https://via.placeholder.com/150"}
                        className="w-28 h-28 rounded-full object-cover shadow-xl sepia-[.2] border border-base-content/10"
                        alt={page.title}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-base-100 p-2 rounded-full border border-base-content/5 shadow-sm">
                        <RiEyeLine className="w-4 h-4 text-base-content/50" />
                    </div>
                </div>

                <h1 className="text-4xl italic font-medium text-base-content mb-3">{page.title}</h1>
                <p className="text-base text-base-content/70 leading-relaxed font-sans max-w-sm mx-auto mb-4">{page.bio}</p>

                <div className="text-xs uppercase tracking-[0.3em] opacity-40 font-sans font-bold">
                    {page.views} Views
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
                        group flex flex-col items-center justify-center
                        w-full py-6
                        border-b border-base-content/20
                        hover:border-primary/50 hover:bg-base-content/[0.02]
                        transition-all duration-500
                        text-center relative overflow-hidden
                    "
                    aria-label={link.title}
                >
                    <span className="text-2xl italic font-serif text-base-content group-hover:text-primary transition-colors duration-300 z-10 relative">
                        {link.title}
                    </span>

                    {/* Subtle line reveal */}
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 group-hover:scale-x-50 transition-transform duration-700 ease-out"></span>
                </motion.a>
            ))}

            {safeLinks.length === 0 && (
                <div className="text-center italic opacity-40 py-10 border-t border-b border-base-content/10 font-serif">
                    Empty Collection.
                </div>
            )}
        </motion.section>
    );
}
