"use client";

import { motion } from "framer-motion";
import {
  SiInstagram, SiX, SiGithub, SiLinkedin, SiYoutube, SiTiktok
} from "react-icons/si";
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

export default function MinimalBioCard({ id, title, url, icon }) {
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
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="
        flex items-center gap-4
        rounded-2xl border border-slate-200
        bg-white px-5 py-4
        transition-all
        hover:shadow-lg
      "
    >
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
        <Icon />
      </div>

      <span className="flex-1 font-medium text-slate-900">
        {title}
      </span>

      <span className="text-slate-400">→</span>
    </motion.a>
  );
}
