"use client";

import { motion } from "framer-motion";
import { RiStarFill, RiArrowRightLine, RiEyeLine } from "react-icons/ri";

export default function HeroTemplate({ page, links, handleLinkClick }) {
    const safeLinks = Array.isArray(links) ? links : [];
    const heroLink = safeLinks.length > 0 ? safeLinks[0] : null;
    const otherLinks = safeLinks.slice(1);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl mx-auto space-y-6 pb-12 px-4"
        >
            {/* Profile Header - Minimal */}
            <header className="flex flex-col gap-4 mb-4 px-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={page.profile_image || "https://via.placeholder.com/150"}
                            alt={page.title}
                            className="w-12 h-12 rounded-full object-cover border-2 border-base-content/10"
                        />
                        <h1 className="font-bold text-lg leading-none">{page.title}</h1>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-100 border border-base-content/10 text-xs font-bold text-base-content/60">
                        <RiEyeLine /> {page.total_views || 0}
                    </div>
                </div>
                {page.bio && (
                    <p className="text-sm text-base-content/80 leading-relaxed max-w-lg">
                        {page.bio}
                    </p>
                )}
            </header>

            {/* Hero Card */}
            {heroLink && (
                <motion.a
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    href={heroLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick?.(heroLink.id)}
                    className="
                        block w-full
                        relative overflow-hidden
                        bg-primary text-primary-content
                        rounded-[2rem]
                        shadow-2xl shadow-primary/30
                        transition-all duration-300
                        hover:scale-[1.01] hover:shadow-primary/50
                        group
                        min-h-[220px]
                    "
                >
                    {/* Decorative Star */}
                    <div className="absolute -top-10 -right-10 text-[12rem] text-white opacity-10 rotate-12 group-hover:rotate-[20deg] transition-transform duration-500">
                        <RiStarFill />
                    </div>

                    <div className="relative p-10 flex flex-col items-start justify-end h-full min-h-[220px] z-10">
                        <div className="mb-auto bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-primary-content border border-white/20">
                            Featured
                        </div>

                        <div className="space-y-2 mt-4">
                            <div className="text-4xl mb-2">{heroLink.icon || "⭐"}</div>
                            <h2 className="text-3xl font-black leading-tight max-w-lg">
                                {heroLink.title}
                            </h2>
                            <div className="inline-flex items-center gap-2 text-sm font-medium opacity-80 group-hover:gap-4 transition-all">
                                Open Link <RiArrowRightLine />
                            </div>
                        </div>
                    </div>
                </motion.a>
            )}

            {/* Other Links */}
            <div className="space-y-3">
                {otherLinks.map((link, idx) => (
                    <motion.a
                        key={link.id || idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleLinkClick?.(link.id)}
                        className="
                            group
                            flex items-center gap-5
                            w-full p-4
                            bg-base-100 hover:bg-base-200
                            border border-base-content/5 hover:border-base-content/10
                            rounded-2xl
                            transition-all duration-200
                        "
                    >
                        <span className="text-2xl opacity-60 group-hover:scale-110 group-hover:text-primary transition-all">
                            {link.icon || "📄"}
                        </span>
                        <span className="font-bold text-base-content flex-1 text-left">
                            {link.title}
                        </span>
                        <RiArrowRightLine className="text-base-content/30 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                    </motion.a>
                ))}
            </div>

            {safeLinks.length === 0 && (
                <div className="p-10 text-center border-2 border-dashed border-base-300 rounded-3xl opacity-50">
                    <RiStarFill className="mx-auto text-4xl mb-2" />
                    No links yet
                </div>
            )}
        </motion.section>
    );
}
