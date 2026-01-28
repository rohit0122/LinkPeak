"use client";

import { motion } from "framer-motion";
import Avatar from "@/components/shared/Avatar";
import { RiArrowRightLine, RiEyeLine } from "react-icons/ri";

export default function BrutalistTemplate({ page, links, handleLinkClick }) {
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
            className="w-full max-w-3xl mx-auto space-y-6 pb-12 px-4 font-mono"
        >
            {/* Profile Header */}
            <header className="border-4 border-base-content p-6 bg-base-100 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar
                        src={page.profile_image}
                        alt={page.title}
                        size={100}
                        shape="square"
                        className="border-4 border-base-content"
                    />
                    <div className="flex-1 text-center md:text-left w-full">
                        <h1 className="text-4xl font-extrabold uppercase tracking-tighter leading-none mb-3 break-words">{page.title}</h1>
                        <p className="text-sm font-bold uppercase border-t-4 border-base-content pt-3 mb-3 tracking-wide">{page.bio}</p>
                        <div className="inline-flex items-center gap-2 bg-primary text-primary-content px-3 py-1 text-xs font-bold uppercase border-2 border-base-content">
                            <RiEyeLine /> {page.total_views || 0} VIEWS
                        </div>
                    </div>
                </div>
            </header>

            {safeLinks.map((link, i) => (
                <motion.a
                    key={link.id || i}
                    variants={item}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick?.(link.id)}
                    className="
                        group flex items-center justify-between
                        w-full p-5 mb-4
                        bg-base-100 text-base-content
                        border-4 border-base-content
                        shadow-[4px_4px_0px_0px_currentColor]
                        hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]
                        hover:bg-secondary hover:text-secondary-content
                        transition-all duration-150
                    "
                    aria-label={link.title}
                >
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-lg font-extrabold uppercase tracking-widest break-all">
                            {link.title}
                        </span>
                        <span className="text-xs opacity-80 truncate font-sans font-medium">
                            {link.url}
                        </span>
                    </div>

                    <div className="flex items-center pl-4 border-l-4 border-current ml-4 h-full">
                        <RiArrowRightLine className="text-2xl group-hover:scale-125 transition-transform" />
                    </div>
                </motion.a>
            ))}

            {safeLinks.length === 0 && (
                <div className="text-center p-8 border-4 border-base-content uppercase font-extrabold text-xl tracking-widest bg-base-200">
                    NO DATA FOUND
                </div>
            )}
        </motion.section>
    );
}
