"use client";

import { motion } from "framer-motion";
import { RiLinkM, RiEyeFill } from "react-icons/ri";

export default function GridTilesTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.8 },
        show: { opacity: 1, scale: 1 },
    };

    const safeLinks = Array.isArray(links) ? links : [];

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-3xl mx-auto pb-12 px-4"
        >
            {/* Profile Header */}
            <div className="flex items-center gap-4 bg-base-200/50 p-4 rounded-2xl border border-base-content/5 shadow-sm mb-6 backdrop-blur-sm">
                <img
                    src={page.profile_image || "https://via.placeholder.com/150"}
                    className="w-16 h-16 rounded-xl object-cover bg-base-300 shadow-sm"
                    alt={page.title}
                />
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold truncate leading-tight text-base-content">{page.title}</h1>
                    <p className="text-xs text-base-content/60 line-clamp-2 mt-1">{page.bio}</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-base-100 w-12 h-12 rounded-lg text-xs font-bold text-primary shadow-sm border border-base-content/5">
                    <RiEyeFill className="text-sm mb-0.5" />
                    {page.views}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                            text-center p-6 gap-3
                            bg-base-100 rounded-2xl
                            border border-base-200 hover:border-primary/30
                            shadow-sm hover:shadow-xl hover:shadow-primary/5
                            hover:-translate-y-1
                            transition-all duration-300
                            aspect-square
                        "
                        aria-label={link.title}
                    >
                        <div className="
                            text-3xl text-primary 
                            bg-primary/10 p-4 rounded-2xl
                            group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content
                            transition-all duration-300"
                        >
                            {link.icon ? link.icon : <RiLinkM />}
                        </div>

                        <span className="font-bold text-sm line-clamp-2 leading-tight text-base-content group-hover:text-primary transition-colors">
                            {link.title}
                        </span>
                    </motion.a>
                ))}
            </div>

            {safeLinks.length === 0 && (
                <div className="text-center opacity-50 py-10 font-bold border-2 border-dashed border-base-300 rounded-xl">
                    No items in grid.
                </div>
            )}
        </motion.section>
    );
}
