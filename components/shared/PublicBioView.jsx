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
                        className="artboard artboard-demo phone-1 overflow-y-auto no-scrollbar pt-8 pb-8 px-4 flex flex-col items-center w-full h-full relative"
                        data-theme={activeTheme}
                    >
                        <AnalyticsTracker pageId={page._id} />

                        {/* Interactions Wrapper (QR, Like Button) */}
                        <PublicBioInteractions page={page} />

                        {/* Profile Section */}
                        <div className="flex flex-col items-center mb-8 text-center w-full">
                            <div className="avatar mb-4">
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
                            <p className="text-sm opacity-70 mt-3 max-w-[200px] leading-relaxed">{page.bio || "Your bio here..."}</p>
                        </div>

                        {/* Templates Switcher */}
                        <div className="w-full">
                            {page.template === "classic" && <ClassicTemplate page={page} links={activeLinks} />}
                            {page.template === "grid" && <GridTemplate page={page} links={activeLinks} />}
                            {page.template === "hero" && <HeroTemplate page={page} links={activeLinks} />}
                            {page.template === "social" && <SocialTemplate page={page} links={activeLinks} />}
                            {page.template === "modern" && <ModernTemplate page={page} links={activeLinks} />}
                            {!page.template && <ClassicTemplate page={page} links={activeLinks} />}
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-wrap justify-center gap-4 mt-auto pt-8 opacity-60">
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
                            <div className="mt-6 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">Powered by</span>
                                <span className="text-xs font-medium tracking-tighter opacity-70">
                                    <a href={CONFIG.SITE_URL} target="_blank" rel="noopener noreferrer"> {CONFIG.SITE_NAME}</a>
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
        </div>
    );
}
