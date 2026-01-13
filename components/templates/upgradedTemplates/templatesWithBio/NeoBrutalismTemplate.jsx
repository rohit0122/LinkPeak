"use client";

import { motion } from "framer-motion";
import { RiEyeFill } from "react-icons/ri";

export default function NeoBrutalismTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.9, y: 10 },
        show: { opacity: 1, scale: 1, y: 0 },
    };

    const safeLinks = Array.isArray(links) ? links : [];

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-3xl mx-auto space-y-5 pb-12 px-4"
        >
            {/* Profile Header */}
            <div className="bg-secondary text-secondary-content p-6 border-2 border-base-content shadow-[8px_8px_0px_0px_currentColor] rounded-xl mb-8 text-center relative overflow-hidden group">
                <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-black border-2 border-base-content px-2 py-1 bg-base-100 text-base-content rotate-[-5deg] shadow-[2px_2px_0px_0px_currentColor] group-hover:rotate-0 transition-transform">
                    <RiEyeFill /> {page.views}
                </div>

                <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-base-content translate-x-1 translate-y-1 rounded-full"></div>
                    <img
                        src={page.profile_image || "https://via.placeholder.com/150"}
                        className="relative w-24 h-24 rounded-full border-2 border-base-content bg-base-100 object-cover"
                        alt={page.title}
                    />
                </div>

                <h1 className="text-3xl font-black uppercase tracking-tight mb-1">{page.title}</h1>
                <p className="font-bold text-sm opacity-90 max-w-xs mx-auto">{page.bio}</p>
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
                        relative block w-full p-4 mb-5
                        bg-primary text-primary-content
                        border-2 border-base-content
                        rounded-xl
                        shadow-[6px_6px_0px_0px_currentColor]
                        hover:shadow-[2px_2px_0px_0px_currentColor]
                        hover:translate-x-[4px] hover:translate-y-[4px]
                        hover:bg-accent hover:text-accent-content
                        transition-all duration-200
                        font-bold
                    "
                    aria-label={link.title}
                >
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-lg tracking-tight font-black">
                            {link.title}
                        </span>
                        {link.icon && (
                            <span className="text-xl bg-base-100 text-base-content p-2 rounded-lg border-2 border-base-content shadow-[2px_2px_0px_0px_currentColor]">
                                {link.icon}
                            </span>
                        )}
                    </div>
                </motion.a>
            ))}

            {safeLinks.length === 0 && (
                <div className="text-center font-black bg-base-200 text-base-content p-6 border-2 border-base-content shadow-[4px_4px_0px_0px_currentColor] rounded-xl">
                    NOTHING HERE YET!
                </div>
            )}
        </motion.section>
    );
}
