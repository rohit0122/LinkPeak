"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { ENDPOINTS } from "@/constants/endpoints";

import ClassicTemplate from "@/components/templates/upgradedTemplates/ClassicTemplate";
import GridTemplate from "@/components/templates/upgradedTemplates/GridTemplate";
import HeroTemplate from "@/components/templates/upgradedTemplates/HeroTemplate";
import SocialTemplate from "@/components/templates/upgradedTemplates/SocialTemplate";
import ModernTemplate from "@/components/templates/upgradedTemplates/ModernTemplate";
import Link from "next/link";

const iconMap = {
    instagram: RiInstagramLine,
    twitter: RiTwitterLine,
    facebook: RiFacebookLine,
    linkedin: RiLinkedinLine,
    github: RiGithubLine,
    youtube: RiYoutubeLine,
    tiktok: RiTiktokLine,
};

export default function PublicBio({ page, links, isDemo = false }) {
    const [likes, setLikes] = useState(page.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const searchParams = useSearchParams();
    const themeParam = searchParams.get("theme");

    // In demo mode, prioritize URL theme param. Otherwise use page theme or default to light.
    const activeTheme = (isDemo && themeParam) ? themeParam : (page.theme || "light");

    useEffect(() => {
        // Skip tracking effects in demo mode or if no page ID
        if (isDemo || !page?._id) return;

        const checkUnique = (key) => {
            const lastTracked = localStorage.getItem(key);
            if (!lastTracked) return true;

            const hoursSince = (new Date().getTime() - parseInt(lastTracked)) / (1000 * 60 * 60);
            return hoursSince > 24; // Unique per 24 hours
        };

        const viewedKey = `viewed_${page._id}`;
        if (checkUnique(viewedKey)) {
            const timer = setTimeout(() => {
                axios.post(ENDPOINTS.TRACK.VIEW, { pageId: page._id }, { skipLoader: true })
                    .then(() => localStorage.setItem(viewedKey, new Date().getTime().toString()))
                    .catch(console.error);
            }, 3000); // 3s genuine view

            return () => clearTimeout(timer);
        }

        if (localStorage.getItem(`liked_${page._id}`)) {
            setIsLiked(true);
        }
    }, [page?._id, isDemo]);


    const handleLike = async () => {
        if (isLiked) return;

        // Optimistic update
        setLikes(prev => prev + 1);
        setIsLiked(true);

        // Skip API call in demo mode
        if (isDemo) return;

        try {
            localStorage.setItem(`liked_${page._id}`, "true");
            axios.post(ENDPOINTS.TRACK.LIKE, { pageId: page._id }, { skipLoader: true });
        } catch (error) {
            console.error("Like failed", error);
        }
    };

    const handleLinkClick = async (linkId) => {
        // Skip API call in demo mode
        if (isDemo) return;

        const clickKey = `clicked_${linkId}`;
        const lastClicked = localStorage.getItem(clickKey);
        const hoursSince = lastClicked ? (new Date().getTime() - parseInt(lastClicked)) / (1000 * 60 * 60) : 999;

        // Track only if unique in 24h
        if (hoursSince > 24) {
            try {
                localStorage.setItem(clickKey, new Date().getTime().toString());
                axios.post(ENDPOINTS.TRACK.CLICK, { linkId, pageId: page._id }, { skipLoader: true });
            } catch (error) {
                console.error("Click tracking failed", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
            <div className="mockup-phone border-primary shadow-2xl transform-gpu">
                <div className="mockup-phone-camera"></div>
                <div className="mockup-phone-display">
                    <div
                        className="artboard artboard-demo phone-1 overflow-y-auto no-scrollbar pt-15 pb-8 px-4 flex flex-col items-center w-full h-full relative"
                        data-theme={activeTheme}
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
                                        src={page.profileImage || "/avatars/avatar-placeholder.svg"}
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
                                <span className="text-xs font-medium tracking-tighter opacity-70">
                                    <Link href={CONFIG.SITE_URL} target="_blank" rel="noopener noreferrer"> {CONFIG.SITE_NAME}</Link>
                                </span>
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
                plan={page.userId?.plan || "FREE"}
            />
        </div>
    );
}
