"use client";

import dynamic from "next/dynamic";
import { RiQrCodeLine } from "react-icons/ri";
import { useAuthStore } from "@/stores/useAuthStore";

// Shared Components
import SocialFooter from "@/components/shared/SocialFooter";
import BrandingFooter from "@/components/shared/BrandingFooter";

// Dynamic Template Imports (15 Templates)
const MinimalistTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/MinimalistTemplate"), { ssr: false });
const SleekTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/SleekTemplate"), { ssr: false });
const StackTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/StackTemplate"), { ssr: false });
const BentoTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/BentoTemplate"), { ssr: false });
const TilesTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/TilesTemplate"), { ssr: false });
const InfluencerTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/InfluencerTemplate"), { ssr: false });
const BrutalistTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/BrutalistTemplate"), { ssr: false });
const NeoBrutalismTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/NeoBrutalismTemplate"), { ssr: false });
const DarkNeonTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/DarkNeonTemplate"), { ssr: false });
const ElegantSerifTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/ElegantSerifTemplate"), { ssr: false });
const GlassmorphismTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/GlassmorphismTemplate"), { ssr: false });
const SoftPastelTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/SoftPastelTemplate"), { ssr: false });
const GradientMeshTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/GradientMeshTemplate"), { ssr: false });
const ClassicTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/ClassicTemplate"), { ssr: false });
const HeroTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/HeroTemplate"), { ssr: false });

export default function PreviewPhoneNew({ demoData = {} }) {
    const { currentBioPage, tempBioPageConfig } = useAuthStore();

    // Merge state for live preview
    const mergedBioPage = {
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
        <div className="mockup-phone border-primary shadow-2xl transform-gpu origin-top will-change-transform overflow-hidden min-w-[322px] min-h-[660px]">
            <div className="mockup-phone-camera"></div>
            <div className="mockup-phone-display">
                <div
                    className="artboard artboard-demo phone-1 overflow-y-auto no-scrollbar pt-12 pb-8 flex flex-col items-center w-full h-full relative bg-base-100"
                    data-theme={theme || "light"}
                >
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
    );
}
