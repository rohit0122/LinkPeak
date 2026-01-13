"use client";

import { motion } from "framer-motion";
import { RiArrowRightSLine, RiEyeLine } from "react-icons/ri";

export default function GradientMeshTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const item = {
        hidden: { opacity: 0, x: 20 },
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
            <div className="relative p-[3px] rounded-3xl overflow-hidden mb-8 text-center group">
                {/* Animated Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-70 w-full h-full animate-[spin_4s_linear_infinite]"></div>

                <div className="relative bg-base-100 rounded-[21px] p-8 z-10 w-full h-full backdrop-blur-3xl bg-opacity-90">
                    <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-primary to-secondary mx-auto mb-4 shadow-lg shadow-primary/20">
                        <img
                            src={page.profile_image || "https://via.placeholder.com/150"}
                            className="w-full h-full rounded-full object-cover border-4 border-base-100"
                            alt={page.title}
                        />
                    </div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2 inline-block tracking-tight">{page.title}</h1>
                    <p className="text-sm font-medium text-base-content/80 mb-6 max-w-xs mx-auto leading-relaxed">{page.bio}</p>

                    <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 px-4 py-1.5 rounded-full bg-primary/5">
                        <RiEyeLine /> {page.total_views || 0} Views
                    </div>
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
                        group relative flex items-center justify-between
                        w-full p-[2px] rounded-2xl overflow-hidden
                        bg-transparent
                        hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1
                        transition-all duration-300
                        mb-4
                    "
                    aria-label={link.title}
                >
                    {/* Gradient Border Background */}
                    <div className="absolute inset-0 bg-base-content/10 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-secondary group-hover:to-accent transition-all duration-500"></div>

                    {/* Content Container */}
                    <div className="relative z-10 flex items-center justify-between w-full h-full p-4 bg-base-100 rounded-[14px] group-hover:bg-base-100/95 transition-colors">
                        <div className="flex items-center gap-4">
                            {link.icon && <span className="text-xl text-primary/80 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-tr group-hover:from-primary group-hover:to-secondary transition-all">{link.icon}</span>}
                            <span className="font-bold text-lg text-base-content group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
                                {link.title}
                            </span>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-base-content/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <RiArrowRightSLine className="text-xl" />
                        </div>
                    </div>
                </motion.a>
            ))}

            {safeLinks.length === 0 && (
                <div className="text-center opacity-30 py-10 font-black text-3xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-base-content to-transparent">
                    NULL
                </div>
            )}
        </motion.section>
    );
}
