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
const MinimalistTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/MinimalistTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const SleekTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/SleekTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const StackTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/StackTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const BentoTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/BentoTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const TilesTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/TilesTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const InfluencerTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/InfluencerTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const BrutalistTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/BrutalistTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const NeoBrutalismTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/NeoBrutalismTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const DarkNeonTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/DarkNeonTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const ElegantSerifTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/ElegantSerifTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const GlassmorphismTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/GlassmorphismTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const SoftPastelTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/SoftPastelTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const GradientMeshTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/GradientMeshTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const ClassicTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/ClassicTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });
const HeroTemplate = dynamic(() => import("@/components/templates/upgradedTemplates/templatesWithBio/HeroTemplate"), { ssr: true, loading: () => <TemplatePlaceholder /> });

function TemplatePlaceholder() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12 space-y-8 animate-pulse">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-base-300 rounded-full"></div>
        <div className="h-6 w-48 bg-base-300 rounded"></div>
        <div className="h-4 w-64 bg-base-300 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-16 w-full bg-base-300 rounded-xl"></div>
        <div className="h-16 w-full bg-base-300 rounded-xl"></div>
        <div className="h-16 w-full bg-base-300 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function PublicBioNew({ page, isDemo = false }) {
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
      links: page.links,
      handleLinkClick,
      isLCP: !isDemo
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

  // Analytics & Interaction Logic (No polling for normal bio page)
  useEffect(() => {
    if (isDemo || !page?.id) return;

    // 1. Initial Local State Logic
    const isCurrentlyLiked = !!localStorage.getItem(`liked_${page.id}`);
    // Defer to next tick to avoid synchronous setState warning in effect
    setTimeout(() => setIsLiked(isCurrentlyLiked), 0);

    // 2. Views Tracking (Delayed)
    const timer = setTimeout(async () => {
      await axios.post(ENDPOINTS.TRACK.VIEW, { pageId: page.id }, { skipLoader: true })
        .then(() => {
          // Update local view count once for the visitor
          setTotalViews(prev => prev + 1);
        })
        .catch(console.error);
    }, 3000);
    return () => clearTimeout(timer);

  }, [page?.id, isDemo, setIsLiked]);

  const handleLike = async () => {
    if (isLiked) return;
    setLikes((prev) => prev + 1);
    setIsLiked(true);
    if (isDemo) return;
    try {
      localStorage.setItem(`liked_${page.id}`, "true");
      await axios.post(ENDPOINTS.TRACK.LIKE, { pageId: page.id }, { skipLoader: true });
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  const handleLinkClick = async (linkId) => {
    if (isDemo) return;
    try {
      await axios.post(ENDPOINTS.TRACK.CLICK, { linkId, pageId: page.id }, { skipLoader: true });
    } catch (error) {
      console.error("Click tracking failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center" data-theme={activeTheme}>
      <div className="transform-gpu w-full h-full">
        {/* Note: Removed 'phone-1' artboard constraint here to allow full responsiveness based on template needs, 
             but kept container styles. Re-add specific constraints if strictly required. 
             Most updated templates handle their own constraints (max-w-3xl). 
         */}
        <div
          className="overflow-y-auto no-scrollbar pt-12 pb-8 flex flex-col items-center w-full min-h-screen relative bg-base-100"
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
