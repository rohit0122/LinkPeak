"use client";

import { CONFIG } from "@/constants/config";

import ClassicTemplate from "@/components/templates/ClassicTemplate";
import GridTemplate from "@/components/templates/GridTemplate";
import HeroTemplate from "@/components/templates/HeroTemplate";
import SocialTemplate from "@/components/templates/SocialTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";

export default function PreviewPhone({ pageData, links = [] }) {
    const { theme, title, bio, profileImage, template } = pageData || {};

    return (
        <div className="mockup-phone border-primary shadow-2xl sticky top-10 transform-gpu origin-top will-change-transform overflow-hidden min-w-[322px] min-h-[660px]">
            <div className="mockup-phone-camera"></div>
            <div className="mockup-phone-display">
                <div
                    className="artboard artboard-demo phone-1 overflow-y-auto no-scrollbar pt-15 pb-8 px-4 flex flex-col items-center w-full h-full"
                    data-theme={theme || "light"}
                >
                    {/* Profile Section */}
                    <div className="flex flex-col items-center mb-8 text-center w-full">
                        <div className="avatar mb-4">
                            <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                    src={profileImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=LinkPeak"}
                                    alt="Profile"
                                />
                            </div>
                        </div>
                        <h1 className="text-xl font-bold">{title || "Your Title"}</h1>
                        <p className="text-sm opacity-70 mt-1 max-w-[200px]">{bio || "Your bio here..."}</p>
                    </div>

                    {/* Templates Switcher */}
                    <div className="w-full">
                        {template === "classic" && <ClassicTemplate page={pageData} links={links} />}
                        {template === "grid" && <GridTemplate page={pageData} links={links} />}
                        {template === "hero" && <HeroTemplate page={pageData} links={links} />}
                        {template === "social" && <SocialTemplate page={pageData} links={links} />}
                        {template === "modern" && <ModernTemplate page={pageData} links={links} />}
                        {!template && <ClassicTemplate page={pageData} links={links} />}
                    </div>

                    {/* Social Links Placeholder */}
                    <div className="flex gap-4 mt-auto pt-8 opacity-60">
                        {/* Icons would go here */}
                    </div>

                    {/* Footer / Branding */}
                    {!pageData?.branding?.removeWatermark ? (
                        <div className="mt-6 flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">Powered by</span>
                            <span className="text-xs font-medium tracking-tighter opacity-70">{CONFIG.SITE_NAME}</span>
                        </div>
                    ) : pageData?.branding?.customText && (
                        <div className="mt-6 flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">Created by</span>
                            <span className="text-xs font-medium tracking-tighter opacity-70">
                                {pageData.branding.customText}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
