"use client";

import { motion } from "framer-motion";
import { RiLinkM, RiEyeFill } from "react-icons/ri";

export default function StackTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 },
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
            <div className="relative bg-base-100/50 backdrop-blur-xl p-8 rounded-[2.5rem] text-center shadow-xl shadow-base-content/5 border border-white/20 mb-8 overflow-hidden group">
                {/* Background decorative gradients */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-50"></div>
                <div className="absolute -top-[100px] -right-[100px] w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
                <div className="absolute -bottom-[100px] -left-[100px] w-64 h-64 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-700"></div>

                <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                    <img
                        src={page?.profile_image || "https://via.placeholder.com/150"}
                        alt={page?.title || "Profile"}
                        className="relative w-28 h-28 rounded-2xl object-cover shadow-lg border-2 border-base-100 mx-auto transform group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <h1 className="text-2xl font-black text-base-content mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-base-content to-base-content/60">{page?.title || "Untitled"}</h1>
                <p className="text-sm font-medium text-base-content/70 mb-5 max-w-lg mx-auto leading-relaxed">{page?.bio || ""}</p>
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-base-100 rounded-full text-xs font-bold text-primary shadow-sm border border-primary/10 hover:shadow-md hover:shadow-primary/10 transition-all cursor-default">
                    <RiEyeFill className="text-lg" /> {page?.total_views || 0}
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
                        group relative w-full p-[2px] rounded-2xl
                        bg-gradient-to-r from-base-content/5 to-base-content/10
                        hover:from-primary hover:via-secondary hover:to-accent
                        transition-all duration-500
                        shadow-sm hover:shadow-2xl hover:shadow-primary/20
                    "
                >
                    <div className="
                        relative flex items-center gap-5 p-4
                        bg-base-100 rounded-[14px]
                        h-full w-full
                        transition-all duration-500
                        group-hover:bg-base-100/95
                    ">
                        <div className="
                            flex-shrink-0 w-14 h-14 rounded-2xl
                            bg-base-200 text-base-content
                            flex items-center justify-center
                            group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:text-primary-content
                            group-hover:scale-110 group-hover:rotate-3
                            transition-all duration-300 shadow-inner
                        ">
                            {link.icon ? (
                                <span className="text-2xl">{link.icon}</span>
                            ) : (
                                <RiLinkM className="text-2xl" />
                            )}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="font-bold text-lg text-base-content truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
                                {link.title}
                            </span>
                            <span className="text-xs font-medium text-base-content/40 truncate group-hover:text-base-content/70 transition-colors">
                                {link.url}
                            </span>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-primary">
                            <RiLinkM className="text-xl" />
                        </div>
                    </div>
                </motion.a>
            ))}

            {safeLinks.length === 0 && (
                <div className="text-center opacity-40 py-10 font-bold text-base-content animate-pulse">
                    Waiting for links...
                </div>
            )}
        </motion.section>
    );
}
