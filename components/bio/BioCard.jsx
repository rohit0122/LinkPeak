"use client";

import { motion } from "framer-motion";
import { SiInstagram, SiX, SiGithub, SiLinkedin, SiYoutube, SiTiktok } from "react-icons/si";
import { HiPaperClip } from "react-icons/hi2";

const IconMap = {
    instagram: SiInstagram,
    twitter: SiX,
    x: SiX,
    github: SiGithub,
    linkedin: SiLinkedin,
    youtube: SiYoutube,
    tiktok: SiTiktok,
    default: HiPaperClip
};

export default function BioCard({ id, title, url, icon, isPriority, themeColor }) {
    const IconComponent = IconMap[icon?.toLowerCase()] || IconMap.default;

    const handleClick = async () => {
        try {
            await fetch('/api/links/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linkId: id }),
            });
        } catch (error) {
            console.error("Click tracking failed:", error);
        }
    };

    return (
        <motion.a
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                scale: 1.02,
                y: -4,
                transition: { type: "spring", stiffness: 400, damping: 12 }
            }}
            whileTap={{ scale: 0.98 }}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            aria-label={`Visit ${title} (${new URL(url).hostname})`}
            className={`
                group relative flex items-center p-4 rounded-[2rem] transition-all
                bg-white/40 backdrop-blur-2xl border border-white/40 shadow-xl
                hover:bg-white/60 hover:border-white/60
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40
                ${isPriority ? 'ring-2 ring-primary ring-offset-4 ring-offset-white' : ''}
            `}
        >
            {/* Soft inner glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative z-10 flex items-center w-full">
                <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mr-4 shadow-sm relative overflow-hidden"
                    style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                >
                    <IconComponent />
                    {/* Animated Glow Dot */}
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex-1">
                    <h3 className="font-extrabold text-slate-800 text-lg tracking-tight group-hover:translate-x-1 transition-transform">{title}</h3>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-900/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-primary transition-colors" />
                </div>
            </div>
        </motion.a>
    );
}
