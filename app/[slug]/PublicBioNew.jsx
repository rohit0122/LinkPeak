"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RiQrCodeLine } from "react-icons/ri";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";

// Shared Components
import LikeButton from "@/components/shared/LikeButton";
import QRModal from "@/components/shared/QRModal";
import SocialFooter from "@/components/shared/SocialFooter";
import BrandingFooter from "@/components/shared/BrandingFooter";

// Dynamic Template Imports (15 Templates)
const MinimalistTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/MinimalistTemplate"), { ssr: true });
const SleekTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/SleekTemplate"), { ssr: true }); // Renamed from Modern
const StackTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/StackTemplate"), { ssr: true }); // Renamed from ModernCards
const BentoTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/BentoTemplate"), { ssr: true }); // Renamed from Grid
const TilesTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/TilesTemplate"), { ssr: true }); // Renamed from GridTiles
const InfluencerTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/InfluencerTemplate"), { ssr: true }); // Renamed from Social
const BrutalistTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/BrutalistTemplate"), { ssr: true });
const NeoBrutalismTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/NeoBrutalismTemplate"), { ssr: true });
const DarkNeonTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/DarkNeonTemplate"), { ssr: true });
const ElegantSerifTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/ElegantSerifTemplate"), { ssr: true });
const GlassmorphismTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/GlassmorphismTemplate"), { ssr: true });
const SoftPastelTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/SoftPastelTemplate"), { ssr: true });
const GradientMeshTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/GradientMeshTemplate"), { ssr: true });
const ClassicTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/ClassicTemplate"), { ssr: true });
const HeroTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/HeroTemplate"), { ssr: true });

export default function PublicBioNew({ page, links, isDemo = false }) {
  const [totalViews, setTotalViews] = useState(page.total_views || 0);
  const [likes, setLikes] = useState(page.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme");

  // Theme Logic
  const activeTheme = isDemo && themeParam ? themeParam : page.theme || "light";

  // Template Selection Logic
  const renderTemplate = () => {
    // Determine the active template ID/Name
    // Note: Use lowercase comparison for robustness
    const templateKey = (page.template || "mnml").toLowerCase();

    // Props to pass to every template
    // Overriding views and likes with local state for real-time updates
    const commonProps = {
      page: { ...page, total_views: totalViews, likes: likes },
      links,
      handleLinkClick
    };

    // Map template keys to Components
    // Legacy keys might need mapping if they exist in DB
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

      // Default Fallback
      default: return <MinimalistTemplate {...commonProps} />;
    }
  };

  // Analytics & Like Logic (Copied from Original)
  useEffect(() => {
    if (isDemo || !page?.id) return;

    const checkUnique = (key) => {
      const lastTracked = localStorage.getItem(key);
      if (!lastTracked) return true;
      const hoursSince = (new Date().getTime() - parseInt(lastTracked)) / (1000 * 60 * 60);
      return hoursSince > 24;
    };

    const viewedKey = `viewed_${page.id}`;
    if (checkUnique(viewedKey)) {
      const timer = setTimeout(() => {
        axios.post(ENDPOINTS.TRACK.VIEW, { pageId: page.id }, { skipLoader: true })
          .then(() => {
            localStorage.setItem(viewedKey, new Date().getTime().toString());
            setTotalViews(prev => prev + 1);
          })
          .catch(console.error);
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (localStorage.getItem(`liked_${page.id}`)) {
      setIsLiked(true);
    }
  }, [page?.id, isDemo]);

  const handleLike = async () => {
    if (isLiked) return;
    setLikes((prev) => prev + 1);
    setIsLiked(true);
    if (isDemo) return;
    try {
      localStorage.setItem(`liked_${page.id}`, "true");
      axios.post(ENDPOINTS.TRACK.LIKE, { pageId: page.id }, { skipLoader: true });
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleLinkClick = async (linkId) => {
    if (isDemo) return;
    const clickKey = `clicked_${linkId}`;
    const lastClicked = localStorage.getItem(clickKey);
    const hoursSince = lastClicked
      ? (new Date().getTime() - parseInt(lastClicked)) / (1000 * 60 * 60)
      : 999;

    if (hoursSince > 24) {
      try {
        localStorage.setItem(clickKey, new Date().getTime().toString());
        axios.post(ENDPOINTS.TRACK.CLICK, { linkId, pageId: page.id }, { skipLoader: true });
      } catch (error) {
        console.error("Click tracking failed", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
      <div className="transform-gpu w-full h-full">
        {/* Note: Removed 'phone-1' artboard constraint here to allow full responsiveness based on template needs, 
             but kept container styles. Re-add specific constraints if strictly required. 
             Most updated templates handle their own constraints (max-w-3xl). 
         */}
        <div
          className="overflow-y-auto no-scrollbar pt-12 pb-8 flex flex-col items-center w-full min-h-screen relative bg-base-100"
          data-theme={activeTheme}
        >
          {/* Share / QR Button */}
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="absolute top-6 right-6 btn btn-circle btn-ghost btn-sm bg-base-100/50 backdrop-blur shadow-sm z-30"
            aria-label={`Share QR Code for ${page.title}`}
          >
            <RiQrCodeLine className="text-lg" />
          </button>

          {/* MAIN TEMPLATE RENDER */}
          <div className="w-full flex-1">
            {renderTemplate()}
          </div>

          {/* MODULAR FOOTERS */}
          <div className="w-full max-w-3xl px-6">
            <SocialFooter socialLinks={page.social_links} />
            <BrandingFooter branding={page.branding} />
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
