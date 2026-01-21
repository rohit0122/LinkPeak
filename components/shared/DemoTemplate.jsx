"use client";

import { RiQrCodeLine } from "react-icons/ri";

// Shared Components
import SocialFooter from "@/components/shared/SocialFooter";
import BrandingFooter from "@/components/shared/BrandingFooter";
import ClassicTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/ClassicTemplate";
import MobileMock from "@/components/shared/MobileMock";
import toast from "react-hot-toast";
import LikeButton from "./LikeButton";

export default function DemoTemplate({ demoData = {}, className = "", isPreviewDisable = false }) {
    // Merge state for live preview - but only if NOT in demo mode
    const { theme, template, links, likes } = demoData;

    // Only show active links in preview
    const updatedLinks = (links || []).filter((link) => link.is_active === true);

    const renderTemplate = () => {
        const templateKey = (template || "minimalist").toLowerCase();
        const commonProps = { page: demoData, links: updatedLinks, handleLinkClick: () => { } };
        return <ClassicTemplate {...commonProps} />;
    };

    return (
        <MobileMock className={className} theme={theme} isPreviewDisable={isPreviewDisable}>
            {/* 1. FIXED UI LAYER */}
            <button className="absolute top-6 right-6 btn btn-circle btn-ghost btn-sm bg-base-100/50 backdrop-blur shadow-sm z-30 opacity-50 cursor-default"
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
            <div className="flex-1 overflow-y-auto no-scrollbar pt-12 pb-8 flex flex-col items-center w-full h-full relative rounded-[inherit]">
                {/* MAIN TEMPLATE RENDER */}
                <div className="w-full flex-1">
                    {renderTemplate()}
                </div>

                {/* MODULAR FOOTERS */}
                <div className="w-full px-4">
                    <SocialFooter socialLinks={demoData.social_links} />
                    <BrandingFooter branding={demoData.branding} />
                </div>
            </div>
        </MobileMock>
    );
}
