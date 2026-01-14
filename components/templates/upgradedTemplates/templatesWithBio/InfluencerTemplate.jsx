"use client";

import { motion } from "framer-motion";
import Avatar from "@/components/shared/Avatar";
import { RiArrowRightLine, RiShareForwardFill, RiVerifiedBadgeFill, RiMoreFill } from "react-icons/ri";

export default function InfluencerTemplate({ page, links, handleLinkClick }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    const safeLinks = Array.isArray(links) ? links : [];

    return (
        <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-3xl mx-auto pb-12 px-4"
        >
            {/* Dynamic Background Elements */}
            <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10 rounded-b-[3rem] opacity-50 pointer-events-none"></div>

            {/* Social Profile Header */}
            <div className="relative mb-8 pt-8">
                {/* Top Nav (Simulated) */}
                <div className="flex justify-between items-center mb-6 px-2 opacity-50 text-xs font-bold tracking-widest uppercase">
                    <span>Profile</span>
                    <RiMoreFill className="text-xl" />
                </div>

                <div className="flex flex-col items-center">
                    {/* Story Ring Avatar */}
                    <div className="relative mb-4 cursor-pointer group">
                        {/* Animated Gradient Ring */}
                        <div className="absolute -inset-1.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute -inset-1 bg-base-100 rounded-full"></div>

                        <Avatar
                            src={page.profile_image}
                            alt={page.title}
                            size={112}
                            className="relative border-4 border-base-100 shadow-sm"
                        />
                        {/* Live/Story Badge */}
                        <div className="absolute bottom-1 right-1 bg-primary text-primary-content text-[10px] font-bold px-1.5 py-0.5 rounded-md border-2 border-base-100 shadow-sm flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            BIO
                        </div>
                    </div>

                    {/* Name & Verified Badge */}
                    <div className="flex items-center gap-1.5 mb-1">
                        <h1 className="text-2xl font-black text-base-content tracking-tight">{page.title}</h1>
                        <RiVerifiedBadgeFill className="text-primary text-xl" />
                    </div>

                    {/* Bio */}
                    <p className="text-center text-base-content/70 max-w-sm mb-6 leading-relaxed text-sm">
                        {page.bio}
                    </p>

                    {/* Real Stats Row (Links & Views) */}
                    <div className="flex items-center justify-center gap-12 mb-8 w-full border-y border-base-content/5 py-4 bg-base-100/30 backdrop-blur-sm">
                        <div className="text-center">
                            <span className="block font-bold text-xl text-base-content">{safeLinks.length}</span>
                            <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">Links</span>
                        </div>
                        <div className="w-px h-8 bg-base-content/10"></div>
                        <div className="text-center">
                            <span className="block font-bold text-xl text-base-content">
                                {page.total_views > 999 ? (page.total_views / 1000).toFixed(1) + 'k' : page.total_views || 0}
                            </span>
                            <span className="text-[10px] text-base-content/40 font-bold uppercase tracking-wider">Views</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Feed (Links) */}
            <div className="space-y-4">
                {safeLinks.map((link, i) => {
                    // Extract domain for "Source" feel
                    let domain = "";
                    try {
                        domain = new URL(link.url).hostname.replace('www.', '');
                    } catch (e) {
                        domain = "Web Link";
                    }

                    return (
                        <motion.a
                            key={link.id || i}
                            variants={item}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleLinkClick?.(link.id)}
                            className="
                                group relative
                                block overflow-hidden
                                bg-base-100 hover:bg-base-50
                                rounded-3xl
                                shadow-sm hover:shadow-xl hover:shadow-primary/5
                                border border-base-content/5
                                transition-all duration-300 hover:-translate-y-1
                            "
                        >
                            {/* Header: Icon + Domain Source */}
                            <div className="flex items-center gap-3 p-4 border-b border-base-content/5">
                                <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-lg shrink-0">
                                    {link.icon || "🔗"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="block font-bold text-sm text-base-content truncate opacity-70">{domain}</span>
                                </div>
                            </div>

                            {/* Main Content: Title */}
                            <div className="px-6 py-5 bg-base-200/30 group-hover:bg-primary/5 transition-colors">
                                <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                                    {link.title}
                                </h3>
                                <p className="text-xs text-base-content/50 truncate opacity-60">
                                    {link.url}
                                </p>
                            </div>

                            {/* Action Footer */}
                            <div className="px-4 py-3 flex items-center justify-between text-sm font-bold text-base-content/60 bg-base-100">
                                <span className="text-xs flex items-center gap-1 group-hover:text-primary transition-colors">
                                    Visit Website <RiArrowRightLine />
                                </span>
                                <RiShareForwardFill className="text-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.a>
                    );
                })}
            </div>

            {safeLinks.length === 0 && (
                <div className="py-20 text-center text-base-content/30 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-base-200 mb-4 animate-pulse"></div>
                    <div>No links yet</div>
                </div>
            )}
        </motion.section>
    );
}
