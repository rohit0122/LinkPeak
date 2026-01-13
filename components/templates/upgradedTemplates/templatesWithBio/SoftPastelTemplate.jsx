"use client";

import { motion } from "framer-motion";
import { RiHeart3Line, RiEyeLine } from "react-icons/ri";

export default function SoftPastelTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.12 },
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
            className="w-full max-w-3xl mx-auto space-y-5 pb-10 px-4"
        >
            {/* Profile Header */}
            <div className="text-center bg-base-200/50 backdrop-blur-md p-8 rounded-[3rem] mb-6 border border-base-content/5 shadow-sm">
                <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 blur-md"></div>
                    <img
                        src={page.profile_image || "https://via.placeholder.com/150"}
                        className="relative w-24 h-24 rounded-full mx-auto border-4 border-base-100 shadow-sm object-cover"
                        alt={page.title}
                    />
                </div>
                <h1 className="text-2xl font-bold text-base-content mb-2">{page.title}</h1>
                <p className="text-sm text-base-content/60 mb-4 bg-base-100/50 inline-block px-4 py-2 rounded-2xl border border-base-content/5">{page.bio}</p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-base-content/50 bg-base-content/5 px-3 py-1 rounded-full">
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
                        group flex items-center gap-5 w-full p-3 pr-6
                        bg-base-100 rounded-[2rem]
                        border border-base-content/5
                        shadow-sm hover:shadow-lg hover:shadow-primary/5
                        hover:-translate-y-1 hover:scale-[1.01]
                        transition-all duration-300 ease-out
                        mb-3
                    "
                    aria-label={link.title}
                >
                    <div className="
                         w-14 h-14 rounded-full 
                         bg-primary/10 text-primary
                         flex items-center justify-center
                         group-hover:bg-primary group-hover:text-primary-content
                         transition-colors duration-300
                         shadow-inner
                      ">
                        {link.icon ? (
                            <span className="text-2xl">{link.icon}</span>
                        ) : (
                            <RiHeart3Line className="text-2xl" />
                        )}
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-lg text-base-content group-hover:text-primary transition-colors">
                            {link.title}
                        </span>
                        <span className="text-xs text-base-content/50 truncate group-hover:text-base-content/70 transition-colors">
                            {link.url}
                        </span>
                    </div>
                </motion.a>
            ))}

            {safeLinks.length === 0 && (
                <div className="text-center font-medium text-base-content/40 py-10">
                    Soft and empty.
                </div>
            )}
        </motion.section>
    );
}
