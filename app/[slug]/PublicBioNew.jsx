"use client";

import dynamic from "next/dynamic";
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
import axios from "@/lib/httpClient";

import { CONFIG } from "@/constants/config";
import { ENDPOINTS } from "@/constants/endpoints";
import Link from "next/link";
import Avatar from "@/components/shared/Avatar";
import MinimalistTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/MinimalistTemplate";

// Dynamically import templates to reduce initial bundle size
const ClassicTemplate = dynamic(
  () => import("@/components/templates/upgradedTemplates/ClassicTemplate"),
  { ssr: true }
);
const GridTemplate = dynamic(
  () => import("@/components/templates/upgradedTemplates/GridTemplate"),
  { ssr: true }
);
const HeroTemplate = dynamic(
  () => import("@/components/templates/upgradedTemplates/HeroTemplate"),
  { ssr: true }
);
const SocialTemplate = dynamic(
  () => import("@/components/templates/upgradedTemplates/SocialTemplate"),
  { ssr: true }
);
const ModernTemplate = dynamic(
  () => import("@/components/templates/upgradedTemplates/ModernTemplate"),
  { ssr: true }
);

const iconMap = {
  instagram: RiInstagramLine,
  twitter: RiTwitterLine,
  facebook: RiFacebookLine,
  linkedin: RiLinkedinLine,
  github: RiGithubLine,
  youtube: RiYoutubeLine,
  tiktok: RiTiktokLine,
};

export default function PublicBioNew({ page, links, isDemo = false }) {
  const [likes, setLikes] = useState(page.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme");

  console.log("Page ", page);

  // In demo mode, prioritize URL theme param. Otherwise use page theme or default to light.
  const activeTheme = isDemo && themeParam ? themeParam : page.theme || "light";

  useEffect(() => {
    // Skip tracking effects in demo mode or if no page ID
    if (isDemo || !page?.id) return;

    const checkUnique = (key) => {
      const lastTracked = localStorage.getItem(key);
      if (!lastTracked) return true;

      const hoursSince =
        (new Date().getTime() - parseInt(lastTracked)) / (1000 * 60 * 60);
      return hoursSince > 24; // Unique per 24 hours
    };

    const viewedKey = `viewed_${page.id}`;
    if (checkUnique(viewedKey)) {
      const timer = setTimeout(() => {
        axios
          .post(ENDPOINTS.TRACK.VIEW, { pageId: page.id }, { skipLoader: true })
          .then(() =>
            localStorage.setItem(viewedKey, new Date().getTime().toString())
          )
          .catch(console.error);
      }, 3000); // 3s genuine view

      return () => clearTimeout(timer);
    }

    if (localStorage.getItem(`liked_${page.id}`)) {
      setIsLiked(true);
    }
  }, [page?.id, isDemo]);

  const handleLike = async () => {
    if (isLiked) return;

    // Optimistic update
    setLikes((prev) => prev + 1);
    setIsLiked(true);

    // Skip API call in demo mode
    if (isDemo) return;

    try {
      localStorage.setItem(`liked_${page.id}`, "true");
      axios.post(
        ENDPOINTS.TRACK.LIKE,
        { pageId: page.id },
        { skipLoader: true }
      );
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleLinkClick = async (linkId) => {
    // Skip API call in demo mode
    if (isDemo) return;

    const clickKey = `clicked_${linkId}`;
    const lastClicked = localStorage.getItem(clickKey);
    const hoursSince = lastClicked
      ? (new Date().getTime() - parseInt(lastClicked)) / (1000 * 60 * 60)
      : 999;

    // Track only if unique in 24h
    if (hoursSince > 24) {
      try {
        localStorage.setItem(clickKey, new Date().getTime().toString());
        axios.post(
          ENDPOINTS.TRACK.CLICK,
          { linkId, pageId: page.id },
          { skipLoader: true }
        );
      } catch (error) {
        console.error("Click tracking failed", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
      <div className="transform-gpu">
        <div className="">
          <div
            className="artboard artboard-demo phone-1 overflow-y-auto no-scrollbar pt-15 pb-8 px-4 flex flex-col items-center w-full h-full relative"
            data-theme={activeTheme}
          >
            {/* Share Button with accesssible name */}
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="absolute top-6 right-6 btn btn-circle btn-ghost btn-sm bg-base-100/50 backdrop-blur shadow-sm z-10"
              aria-label={`Share QR Code for ${page.title}`}
            >
              <RiQrCodeLine className="text-lg" />
            </button>

            <MinimalistTemplate page={page} links={links} handleLinkClick={handleLinkClick} />
            {/* Social Links Placeholder */}
            <div className="flex flex-wrap justify-center gap-4 mt-auto pt-8 opacity-60">
              {Object.entries(page.social_links || {}).map(([key, value]) => {
                if (!value) return null;
                const Icon = iconMap[key];
                return (
                  <a
                    key={key}
                    href={value.startsWith("http") ? value : `https://${value}`}
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
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">
                  Powered by
                </span>
                <span className="text-xs font-medium tracking-tighter opacity-70">
                  <Link
                    href={CONFIG.SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    {CONFIG.SITE_NAME}
                  </Link>
                </span>
              </div>
            ) : (
              page.branding?.customText && (
                <div className="mt-6 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">
                    Created by
                  </span>
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
              )
            )}
          </div>
        </div>
      </div>

      {/* Floating Like Button */}
      <LikeButton likes={likes} isLiked={isLiked} onLike={handleLike} />

      {/* QR Modal */}
      <QRModal
        slug={page.slug}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        plan={page.user?.plan || "FREE"}
      />
    </div>
  );
}
