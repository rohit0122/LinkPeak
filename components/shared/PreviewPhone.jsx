"use client";

import { CONFIG } from "@/constants/config";
import {
  RiInstagramLine,
  RiTwitterLine,
  RiFacebookLine,
  RiLinkedinLine,
  RiGithubLine,
  RiYoutubeLine,
  RiTiktokLine,
  RiEyeLine,
} from "react-icons/ri";

import ClassicTemplate from "@/components/templates/upgradedTemplates/ClassicTemplate";
import GridTemplate from "@/components/templates/upgradedTemplates/GridTemplate";
import HeroTemplate from "@/components/templates/upgradedTemplates/HeroTemplate";
import SocialTemplate from "@/components/templates/upgradedTemplates/SocialTemplate";
import ModernTemplate from "@/components/templates/upgradedTemplates/ModernTemplate";
import { useAuthStore } from "@/stores/useAuthStore";

export default function PreviewPhone({ demoData = {} }) {
  const { currentBioPage, tempBioPageConfig } = useAuthStore();
  const mergedBioPage = {
    ...demoData,
    ...currentBioPage,
    ...tempBioPageConfig,
  };
  const { theme, template, title, bio, profile_image, links, total_views } =
    mergedBioPage;
  //console.log("linkslinkslinks ", links);
  const updatedLinks = (links || []).filter((link) => link.is_active === true);
  //console.log("updatedLinks ", updatedLinks);
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
                  src={profile_image || "/avatars/avatar-placeholder.svg"}
                  alt="Profile"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-xl font-bold">{title || "Your Title"}</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <RiEyeLine className="text-primary text-xs" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {total_views} Views
                </span>
              </div>
            </div>
            <p className="text-sm opacity-70 mt-1 max-w-[200px]">
              {bio || "Your bio here..."}
            </p>
          </div>

          {/* Templates Switcher */}
          <div className="w-full">
            {template === "classic" && (
              <ClassicTemplate page={mergedBioPage} links={updatedLinks} />
            )}
            {template === "grid" && (
              <GridTemplate page={mergedBioPage} links={updatedLinks} />
            )}
            {template === "hero" && (
              <HeroTemplate page={mergedBioPage} links={updatedLinks} />
            )}
            {template === "social" && (
              <SocialTemplate page={mergedBioPage} links={updatedLinks} />
            )}
            {template === "modern" && (
              <ModernTemplate page={mergedBioPage} links={updatedLinks} />
            )}
            {!template && (
              <ClassicTemplate page={mergedBioPage} links={updatedLinks} />
            )}
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-4 mt-auto pt-8 opacity-60">
            {mergedBioPage?.social_links?.instagram && (
              <a
                href={
                  mergedBioPage.social_links.instagram.startsWith("http")
                    ? mergedBioPage.social_links.instagram
                    : `https://${mergedBioPage.social_links.instagram}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-primary transition-colors"
              >
                <RiInstagramLine />
              </a>
            )}
            {mergedBioPage?.social_links?.twitter && (
              <a
                href={
                  mergedBioPage.social_links.twitter.startsWith("http")
                    ? mergedBioPage.social_links.twitter
                    : `https://${mergedBioPage.social_links.twitter}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-primary transition-colors"
              >
                <RiTwitterLine />
              </a>
            )}
            {mergedBioPage?.social_links?.facebook && (
              <a
                href={
                  mergedBioPage.social_links.facebook.startsWith("http")
                    ? mergedBioPage.social_links.facebook
                    : `https://${mergedBioPage.social_links.facebook}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-primary transition-colors"
              >
                <RiFacebookLine />
              </a>
            )}
            {mergedBioPage?.social_links?.linkedin && (
              <a
                href={
                  mergedBioPage.social_links.linkedin.startsWith("http")
                    ? mergedBioPage.social_links.linkedin
                    : `https://${mergedBioPage.social_links.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-primary transition-colors"
              >
                <RiLinkedinLine />
              </a>
            )}
            {mergedBioPage?.social_links?.github && (
              <a
                href={
                  mergedBioPage.social_links.github.startsWith("http")
                    ? mergedBioPage.social_links.github
                    : `https://${mergedBioPage.social_links.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-primary transition-colors"
              >
                <RiGithubLine />
              </a>
            )}
            {mergedBioPage?.social_links?.youtube && (
              <a
                href={
                  mergedBioPage.social_links.youtube.startsWith("http")
                    ? mergedBioPage.social_links.youtube
                    : `https://${mergedBioPage.social_links.youtube}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-primary transition-colors"
              >
                <RiYoutubeLine />
              </a>
            )}
            {mergedBioPage?.social_links?.tiktok && (
              <a
                href={
                  mergedBioPage.social_links.tiktok.startsWith("http")
                    ? mergedBioPage.social_links.tiktok
                    : `https://${mergedBioPage.social_links.tiktok}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:text-primary transition-colors"
              >
                <RiTiktokLine />
              </a>
            )}
          </div>

          {/* Footer / Branding */}
          {!mergedBioPage?.branding?.removeWatermark ? (
            <div className="mt-6 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">
                Powered by
              </span>
              <span className="text-xs font-medium tracking-tighter opacity-70">
                {CONFIG.SITE_NAME}
              </span>
            </div>
          ) : (
            mergedBioPage?.branding?.customText && (
              <div className="mt-6 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">
                  Created by
                </span>
                <span className="text-xs font-medium tracking-tighter opacity-70">
                  {mergedBioPage.branding.customText}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
