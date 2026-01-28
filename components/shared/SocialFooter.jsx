"use client";

import {
    RiInstagramLine,
    RiTwitterLine,
    RiFacebookLine,
    RiLinkedinLine,
    RiGithubLine,
    RiYoutubeLine,
    RiTiktokLine,
} from "react-icons/ri";

const iconMap = {
    instagram: RiInstagramLine,
    twitter: RiTwitterLine,
    facebook: RiFacebookLine,
    linkedin: RiLinkedinLine,
    github: RiGithubLine,
    youtube: RiYoutubeLine,
    tiktok: RiTiktokLine,
};

export default function SocialFooter({ socialLinks }) {
    if (!socialLinks) return null;

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-auto pt-8 opacity-60">
            {Object.entries(socialLinks).map(([key, value]) => {
                if (!value) return null;
                const Icon = iconMap[key];
                if (!Icon) return null;

                return (
                    <a
                        key={key}
                        href={value.startsWith("http") ? value : `https://${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl hover:text-primary transition-colors"
                        aria-label={`Follow on ${key}`}
                    >
                        <Icon />
                    </a>
                );
            })}
        </div>
    );
}
