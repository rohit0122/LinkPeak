"use client";

import { useEffect, useState } from "react";
import {
    RiInstagramLine,
    RiTwitterLine,
    RiFacebookLine,
    RiLinkedinLine,
    RiGithubLine,
    RiYoutubeLine,
    RiTiktokLine,
    RiQrCodeLine,
    RiEyeLine,
} from "react-icons/ri";
import LikeButton from "@/components/shared/LikeButton";
import QRModal from "@/components/shared/QRModal";
import axios from "@/lib/axios";
import { CONFIG } from "@/constants/config";

import ClassicTemplate from "@/components/templates/ClassicTemplate";
import GridTemplate from "@/components/templates/GridTemplate";
import HeroTemplate from "@/components/templates/HeroTemplate";
import SocialTemplate from "@/components/templates/SocialTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";

const iconMap = {
    instagram: RiInstagramLine,
    twitter: RiTwitterLine,
    facebook: RiFacebookLine,
    linkedin: RiLinkedinLine,
    github: RiGithubLine,
    youtube: RiYoutubeLine,
    tiktok: RiTiktokLine,
};

export default function PublicBio({ page, links }) {
    const [likes, setLikes] = useState(page.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    useEffect(() => {
        // Track View
        axios.post("/track/view", { pageId: page._id }).catch(e => console.error(e));

        const liked = localStorage.getItem(`liked_${page._id}`);
        if (liked) setIsLiked(true);
    }, [page._id]);

    const handleLike = async () => {
        if (isLiked) return;
        try {
            setLikes(prev => prev + 1);
            setIsLiked(true);
            localStorage.setItem(`liked_${page._id}`, "true");
            await axios.post("/track/like", { pageId: page._id });
        } catch (error) {
            console.error("Like failed", error);
        }
    };

    const handleLinkClick = async (linkId) => {
        try {
            await axios.post("/track/click", { linkId, pageId: page._id });
        } catch (error) {
            console.error("Click tracking failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
            <div className="mockup-phone border-primary shadow-2xl transform-gpu">
                <div className="mockup-phone-camera"></div>
                <div className="mockup-phone-display">
                    <div
                        className="artboard artboard-demo phone-1 overflow-y-auto no-scrollbar pt-15 pb-8 px-4 flex flex-col items-center w-full h-full relative"
                        data-theme={page.theme || "light"}
                    >
                        {/* Share Button with accesssible name */}
                        <button
                            onClick={() => setIsQRModalOpen(true)}
                            className="absolute top-6 right-6 btn btn-circle btn-ghost btn-sm bg-base-100/50 backdrop-blur shadow-sm"
                            aria-label={`Share QR Code for ${page.title}`}
                        >
                            <RiQrCodeLine className="text-lg" />
                        </button>

                        {/* Profile Section */}
                        <div className="flex flex-col items-center mb-8 text-center w-full">
                            <div className="avatar mb-4">
                                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img
                                        src={page.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${page.slug}`}
                                        alt="Profile"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <h1 className="text-xl font-medium tracking-tight">{page.title || "Your Title"}</h1>
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                                    <RiEyeLine className="text-primary text-xs" />
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{page.views || 0} Views</span>
                                </div>
                            </div>
                            <p className="text-sm opacity-70 mt-3 max-w-[200px] leading-relaxed">{page.bio || "Your bio here..."}</p>
                        </div>

                        {/* Templates Switcher */}
                        <div className="w-full">
                            {page.template === "classic" && <ClassicTemplate page={page} links={links} handleLinkClick={handleLinkClick} />}
                            {page.template === "grid" && <GridTemplate page={page} links={links} handleLinkClick={handleLinkClick} />}
                            {page.template === "hero" && <HeroTemplate page={page} links={links} handleLinkClick={handleLinkClick} />}
                            {page.template === "social" && <SocialTemplate page={page} links={links} handleLinkClick={handleLinkClick} />}
                            {page.template === "modern" && <ModernTemplate page={page} links={links} handleLinkClick={handleLinkClick} />}
                        </div>

                        {/* Social Links Placeholder */}
                        <div className="flex flex-wrap justify-center gap-4 mt-auto pt-8 opacity-60">
                            {Object.entries(page.socialLinks || {}).map(([key, value]) => {
                                if (!value) return null;
                                const Icon = iconMap[key];
                                return (
                                    <a
                                        key={key}
                                        href={value.startsWith('http') ? value : `https://${value}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-2xl hover:text-primary transition-colors"
                                    >
                                        <Icon />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Footer / Branding */}
                        {!page.branding?.removeWatermark ? (
                            <div className="mt-6 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">Powered by</span>
                                <span className="text-xs font-medium tracking-tighter opacity-70">{CONFIG.SITE_NAME}</span>
                            </div>
                        ) : page.branding?.customText && (
                            <div className="mt-6 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">Created by</span>
                                {page.branding?.customUrl ? (
                                    <a
                                        href={page.branding.customUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-medium tracking-tighter opacity-70 hover:text-primary hover:opacity-100 transition-all"
                                    >
                                        {page.branding.customText}
                                    </a>
                                ) : (
                                    <span className="text-xs font-medium tracking-tighter opacity-70">
                                        {page.branding.customText}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Like Button */}
            <LikeButton
                likes={likes}
                isLiked={isLiked}
                onLike={handleLike}
            />

            {/* QR Modal */}
            <QRModal
                slug={page.slug}
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
            />
        </div>
    );
}
