import {
    RiInstagramLine,
    RiTwitterLine,
    RiFacebookLine,
    RiLinkedinLine,
    RiGithubLine,
    RiYoutubeLine,
    RiTiktokLine,
    RiQrCodeLine,
    RiEyeLine
} from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import AnalyticsTracker from "@/components/shared/AnalyticsTracker";
import ClassicTemplate from "@/components/templates/upgradedTemplates/ClassicTemplate";
import GridTemplate from "@/components/templates/upgradedTemplates/GridTemplate";
import HeroTemplate from "@/components/templates/upgradedTemplates/HeroTemplate";
import SocialTemplate from "@/components/templates/upgradedTemplates/SocialTemplate";
import ModernTemplate from "@/components/templates/upgradedTemplates/ModernTemplate";
import BioNotFound from "@/components/bio-templates/BioNotFound";

// We use these helpers in our "Lite" client wrapper for likes/QR
import PublicBioInteractions from "./PublicBioInteractions";

const iconMap = {
    instagram: RiInstagramLine,
    twitter: RiTwitterLine,
    facebook: RiFacebookLine,
    linkedin: RiLinkedinLine,
    github: RiGithubLine,
    youtube: RiYoutubeLine,
    tiktok: RiTiktokLine,
};

export default function PublicBioView({ page, links }) {
    if (!page) return <BioNotFound />;

    const activeTheme = page.theme || "light";
    const activeLinks = links || [];

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
            <div className="mockup-phone border-primary shadow-2xl transform-gpu">
                <div className="mockup-phone-camera"></div>
                <div className="mockup-phone-display">
                    <div
                        className="artboard artboard-demo phone-1 flex flex-col items-center w-full h-full relative overflow-hidden"
                        data-theme={activeTheme}
                    >
                        {/* Interactions Wrapper (QR, Like Button) - Sits on top independent of scroll */}
                        <PublicBioInteractions page={page} />

                        {/* Static Header Section - Stays visible */}
                        <div className="flex-none w-full pt-20 pb-2 px-4 z-10">
                            <AnalyticsTracker pageId={page._id} />

                            {/* Profile Section */}
                            <div className="flex flex-col items-center text-center w-full">
                                <div className="avatar mb-3">
                                    <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img
                                            src={page.profileImage || "/avatars/avatar-placeholder.svg"}
                                            alt={page.title}
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
                                <p className="text-sm opacity-70 mt-3 max-w-[200px] leading-relaxed line-clamp-2">{page.bio || "Your bio here..."}</p>
                            </div>
                        </div>

                        {/* Scrollable Content Section */}
                        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar px-4 pb-8 space-y-6 mask-gradient-top flex flex-col">
                            {/* Templates Switcher */}
                            <div className="w-full pt-2">
                                {page.template === "classic" && <ClassicTemplate page={page} links={activeLinks} />}
                                {page.template === "grid" && <GridTemplate page={page} links={activeLinks} />}
                                {page.template === "hero" && <HeroTemplate page={page} links={activeLinks} />}
                                {page.template === "social" && <SocialTemplate page={page} links={activeLinks} />}
                                {page.template === "modern" && <ModernTemplate page={page} links={activeLinks} />}
                                {!page.template && <ClassicTemplate page={page} links={activeLinks} />}
                            </div>

                            {/* Bottom Section: Socials + Footer */}
                            <div className="w-full mt-auto flex flex-col gap-1 pb-4">
                                {/* Social Links */}
                                <div className="flex flex-wrap justify-center gap-4 opacity-60">
                                    {Object.entries(page.socialLinks || {}).map(([key, value]) => {
                                        if (!value) return null;
                                        const Icon = iconMap[key];
                                        if (!Icon) return null;
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
                                    <div className="flex flex-col items-center gap-1 mt-2">
                                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">Powered by</span>
                                        <span className="text-xs font-medium tracking-tighter opacity-70">
                                            <a href={CONFIG.SITE_URL} target="_blank" rel="noopener noreferrer"> {CONFIG.SITE_NAME}</a>
                                        </span>
                                    </div>
                                ) : page.branding?.customText && (
                                    <div className="flex flex-col items-center gap-1 mt-2">
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
                </div>
            </div>
        </div>
    );
}
