"use client";

import dynamic from "next/dynamic";
import { RiQrCodeLine } from "react-icons/ri";
import { useAuthStore } from "@/stores/useAuthStore";

// Shared Components
import SocialFooter from "@/components/shared/SocialFooter";
import BrandingFooter from "@/components/shared/BrandingFooter";

// Dynamic Template Imports (15 Templates)
const MinimalistTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/MinimalistTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const SleekTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/SleekTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const StackTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/StackTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const BentoTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/BentoTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const TilesTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/TilesTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const InfluencerTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/InfluencerTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const BrutalistTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/BrutalistTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const NeoBrutalismTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/NeoBrutalismTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const DarkNeonTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/DarkNeonTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const ElegantSerifTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/ElegantSerifTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const GlassmorphismTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/GlassmorphismTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const SoftPastelTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/SoftPastelTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const GradientMeshTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/GradientMeshTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const ClassicTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/ClassicTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });
const HeroTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/HeroTemplate"), { ssr: false, loading: () => <TemplatePlaceholder /> });

function TemplatePlaceholder() {
    return (
        <div className="w-full px-6 py-8 space-y-6 animate-pulse">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-base-300 rounded-full"></div>
                <div className="h-4 w-32 bg-base-300 rounded"></div>
                <div className="h-3 w-48 bg-base-300 rounded"></div>
            </div>
            <div className="space-y-3">
                <div className="h-12 w-full bg-base-300 rounded-lg"></div>
                <div className="h-12 w-full bg-base-300 rounded-lg"></div>
                <div className="h-12 w-full bg-base-300 rounded-lg"></div>
            </div>
        </div>
    );
}

export default function PhonePreviewMock({ demoData = {}, isDemo = false, className = "" }) {
    const { currentBioPage, tempBioPageConfig } = useAuthStore();

    // Merge state for live preview - but only if NOT in demo mode
    const mergedBioPage = isDemo
        ? demoData
        : {
            ...demoData,
            ...currentBioPage,
            ...tempBioPageConfig,
        };

    const { theme, template, links } = mergedBioPage;

    // Only show active links in preview
    const updatedLinks = (links || []).filter((link) => link.is_active === true);

    const renderTemplate = () => {
        const templateKey = (template || "minimalist").toLowerCase();
        const commonProps = { page: mergedBioPage, links: updatedLinks, handleLinkClick: () => { } };

        switch (templateKey) {
            case "minimalist":
            case "mnml": return <MinimalistTemplate {...commonProps} />;
            case "sleek":
            case "modern": return <SleekTemplate {...commonProps} />;
            case "stack":
            case "moderncards": return <StackTemplate {...commonProps} />;
            case "bento":
            case "grid": return <BentoTemplate {...commonProps} />;
            case "tiles":
            case "gridtiles": return <TilesTemplate {...commonProps} />;
            case "influencer":
            case "social": return <InfluencerTemplate {...commonProps} />;
            case "brutalist": return <BrutalistTemplate {...commonProps} />;
            case "neobrutalism": return <NeoBrutalismTemplate {...commonProps} />;
            case "darkneon": return <DarkNeonTemplate {...commonProps} />;
            case "elegantserif": return <ElegantSerifTemplate {...commonProps} />;
            case "glassmorphism": return <GlassmorphismTemplate {...commonProps} />;
            case "softpastel": return <SoftPastelTemplate {...commonProps} />;
            case "gradientmesh": return <GradientMeshTemplate {...commonProps} />;
            case "classic": return <ClassicTemplate {...commonProps} />;
            case "hero": return <HeroTemplate {...commonProps} />;
            default: return <MinimalistTemplate {...commonProps} />;
        }
    };

    return (
        <div className={`flex justify-center ${className}`}>
            <div
                className="
          relative
          w-full h-full
          rounded-[2.75rem]
          border-6 border-primary
          shadow-2xl
          flex
        "
            >
                {/* Screen */}
                <div
                    className="
            relative
            flex-1
            bg-base-100
            rounded-[2.75rem]
            overflow-hidden
            border-6 border-black
            flex
          " data-theme={theme || "light"}
                >
                    {/* Camera (inside screen like DaisyUI v5) */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                        <div className="w-[130px] h-[28px] bg-black rounded-full relative">
                            <div className="absolute right-4 top-[9px] w-[10px] h-[10px] bg-neutral-700 rounded-full" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto pt-10 px-3 pb-3">

                        {/* Share Button Placeholder */}
                        <button className="absolute top-6 right-6 btn btn-circle btn-ghost btn-sm bg-base-100/50 backdrop-blur shadow-sm z-30 opacity-50 cursor-default">
                            <RiQrCodeLine className="text-lg" />
                        </button>

                        {/* MAIN TEMPLATE RENDER */}
                        <div className="w-full flex-1">
                            {renderTemplate()}
                        </div>

                        {/* MODULAR FOOTERS */}
                        <div className="w-full px-4">
                            <SocialFooter socialLinks={mergedBioPage.social_links} />
                            <BrandingFooter branding={mergedBioPage.branding} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
