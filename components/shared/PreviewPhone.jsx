"use client";

import { CONFIG } from "@/constants/config";
import {
    RiInstagramLine,
    RiTwitterLine,
    RiFacebookLine,
    RiLinkedinLine,
    RiGithubLine,
    RiYoutubeLine,
    RiTiktokLine
} from "react-icons/ri";

import ClassicTemplate from "@/components/templates/upgradedTemplates/ClassicTemplate";
import GridTemplate from "@/components/templates/upgradedTemplates/GridTemplate";
import HeroTemplate from "@/components/templates/upgradedTemplates/HeroTemplate";
import SocialTemplate from "@/components/templates/upgradedTemplates/SocialTemplate";
import ModernTemplate from "@/components/templates/upgradedTemplates/ModernTemplate";

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

                    {/* Social Links */}
                    <div className="flex flex-wrap justify-center gap-4 mt-auto pt-8 opacity-60">
                        {pageData?.socialLinks?.instagram && (
                            <a href={pageData.socialLinks.instagram.startsWith('http') ? pageData.socialLinks.instagram : `https://${pageData.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                                <RiInstagramLine />
                            </a>
                        )}
                        {pageData?.socialLinks?.twitter && (
                            <a href={pageData.socialLinks.twitter.startsWith('http') ? pageData.socialLinks.twitter : `https://${pageData.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                                <RiTwitterLine />
                            </a>
                        )}
                        {pageData?.socialLinks?.facebook && (
                            <a href={pageData.socialLinks.facebook.startsWith('http') ? pageData.socialLinks.facebook : `https://${pageData.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                                <RiFacebookLine />
                            </a>
                        )}
                        {pageData?.socialLinks?.linkedin && (
                            <a href={pageData.socialLinks.linkedin.startsWith('http') ? pageData.socialLinks.linkedin : `https://${pageData.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                                <RiLinkedinLine />
                            </a>
                        )}
                        {pageData?.socialLinks?.github && (
                            <a href={pageData.socialLinks.github.startsWith('http') ? pageData.socialLinks.github : `https://${pageData.socialLinks.github}`} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                                <RiGithubLine />
                            </a>
                        )}
                        {pageData?.socialLinks?.youtube && (
                            <a href={pageData.socialLinks.youtube.startsWith('http') ? pageData.socialLinks.youtube : `https://${pageData.socialLinks.youtube}`} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                                <RiYoutubeLine />
                            </a>
                        )}
                        {pageData?.socialLinks?.tiktok && (
                            <a href={pageData.socialLinks.tiktok.startsWith('http') ? pageData.socialLinks.tiktok : `https://${pageData.socialLinks.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary transition-colors">
                                <RiTiktokLine />
                            </a>
                        )}
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
