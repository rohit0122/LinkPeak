"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { RiQrCodeLine, RiInformationFill } from "react-icons/ri";
import Link from "next/link";
import toast from "react-hot-toast";

// Shared Components
import SocialFooter from "@/components/shared/SocialFooter";
import BrandingFooter from "@/components/shared/BrandingFooter";
import ClassicTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/ClassicTemplate";
import MobileMock from "@/components/shared/MobileMock";
import LikeButton from "./LikeButton";

export default function DemoTemplate({ demoData = {}, className = "", isPreviewDisable = false, isLCP = false }) {
    // Merge state for live preview - but only if NOT in demo mode
    const { theme, template, links, likes } = demoData;

    // Only show active links in preview
    const updatedLinks = (links || []).filter((link) => link.is_active === true);

    const renderTemplate = () => {
        const templateKey = (template || "minimalist").toLowerCase();
        const commonProps = { page: demoData, links: updatedLinks, handleLinkClick: () => { }, isLCP };
        return <ClassicTemplate {...commonProps} />;
    };

    return (
        <LazyMotion features={domAnimation}>
            <MobileMock className={className} theme={theme} isPreviewDisable={isPreviewDisable}>
                {/* Premium Demo Banner */}
                <m.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute top-0 left-0 right-0 z-[100] bg-secondary/95 backdrop-blur text-secondary-content py-1.5 px-4 flex items-center justify-between shadow-lg"
                >
                    <div className="flex items-center gap-2">
                        <RiInformationFill className="text-xs opacity-80" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Demo Mode</span>
                    </div>
                    <Link href="/register" className="text-[9px] font-bold bg-base-100 text-base-content px-2 py-0.5 rounded uppercase hover:bg-base-200 transition-colors">
                        Join Now
                    </Link>
                </m.div>

                {/* 1. FIXED UI LAYER */}
                <button className="absolute top-12 right-6 btn btn-circle btn-ghost btn-sm bg-base-100/50 backdrop-blur shadow-sm z-30 opacity-50 cursor-default"
                    onClick={() => toast("Preview Mode: On live profiles, this opens custom QR codes and share options for your audience.", { icon: "ℹ️" })}
                >
                    <RiQrCodeLine className="text-lg" />
                </button>

                {/* Floating Like Button */}
                <LikeButton
                    likes={likes}
                    isLiked={false}
                    onLike={() => toast("Live Engagement: In your actual bio profile, 'Liking' instantly updates your stats in real-time.", { icon: "ℹ️" })}
                    className="absolute bottom-6 right-6"
                />

                {/* 2. SCROLLABLE CONTENT LAYER */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 overflow-y-auto no-scrollbar pt-14 pb-8 flex flex-col items-center w-full h-full relative rounded-[inherit]"
                >
                    {/* MAIN TEMPLATE RENDER */}
                    <div className="w-full flex-1">
                        {renderTemplate()}
                    </div>

                    {/* MODULAR FOOTERS */}
                    <div className="w-full px-4">
                        <SocialFooter socialLinks={demoData.social_links} />
                        <BrandingFooter branding={demoData.branding} />
                    </div>
                </m.div>
            </MobileMock>
        </LazyMotion>
    );
}
