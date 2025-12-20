

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

export default function ProfessionalBioCard({ id, title, url, icon, themeColor = "#4f46e5" }) {
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-2xl overflow-hidden"
        >
            <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundColor: themeColor }}
            />

            <div className="relative flex items-center gap-4 px-5 py-4 bg-white border border-slate-200">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: themeColor }}
                >
                    <Icon />
                </div>

                <span className="flex-1 font-semibold text-slate-900">
                    {title}
                </span>

                <span className="text-slate-400">↗</span>
            </div>
        </motion.a>
    );
}
