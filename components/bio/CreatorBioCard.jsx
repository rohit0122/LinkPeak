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

export default function CreatorBioCard({ id, title, url, icon, isPriority }) {
    const Icon = IconMap[icon?.toLowerCase()] || IconMap.default;

    const handleClick = async () => {
        fetch("/api/links/click", {
            method: "POST",
            body: JSON.stringify({ linkId: id }),
            headers: { "Content-Type": "application/json" }
        });
    };

    return (
        <motion.a
            href={url}
            target="_blank"
            onClick={handleClick}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            className={`
        relative flex items-center gap-4
        rounded-2xl px-5 py-4
        border transition-all
        ${isPriority
                    ? "border-indigo-300 bg-indigo-50 shadow-md"
                    : "border-slate-200 bg-white hover:shadow-lg"}
      `}
        >
            <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center
        ${isPriority ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}
      `}>
                <Icon />
            </div>

            <span className="flex-1 font-semibold text-slate-900">
                {title}
            </span>

            {isPriority && (
                <span className="text-xs font-bold text-indigo-600 uppercase">
                    Featured
                </span>
            )}
        </motion.a>
    );
}
