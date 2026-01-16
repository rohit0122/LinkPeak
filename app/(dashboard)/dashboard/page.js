"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "@/lib/httpClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LinkEditor from "@/components/dashboard/LinkEditor";
import PreviewPhoneNew from "@/components/shared/PreviewPhoneNew";
import UnsavedChangesModal from "@/components/dashboard/UnsavedChangesModal";
import ThemeTab from "@/components/dashboard/ThemeTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import {
  SkeletonChart,
  SkeletonTable,
  SkeletonDashboard,
} from "@/components/shared/SkeletonLoaders";
import { toast } from "react-hot-toast";
import {
  RiLayoutLine,
  RiPaletteLine,
  RiSettingsLine,
  RiBarChartLine,
  RiQrCodeLine,
  RiCustomerService2Line,
  RiEyeLine,
  RiHeartLine,
  RiAdminLine,
  RiUserLine,
} from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import { ENDPOINTS } from "@/constants/endpoints";
import { useRouter } from "next/navigation";
import SubscriptionStatusDiv from "@/components/dashboard/SubscriptionStatusDiv";
import { useAuthStore } from "@/stores/useAuthStore";
import SubscriptionDetails from "@/components/dashboard/Subscription/SubscriptionDetails";
import DangerZone from "@/components/dashboard/DangerZone";
import UsageMetrics from "@/components/dashboard/UsageMetrics";

// Lazy load heavy components
const AnalyticsView = dynamic(
  () => import("@/components/dashboard/AnalyticsView"),
  {
    loading: () => <SkeletonDashboard />,
    ssr: false,
  }
);

const QRGenerator = dynamic(
  () => import("@/components/dashboard/QRGenerator"),
  {
    loading: () => <SkeletonChart />,
    ssr: false,
  }
);

const SupportView = dynamic(
  () => import("@/components/dashboard/SupportView"),
  {
    loading: () => <SkeletonTable />,
    ssr: false,
  }
);

// No more useDashboardStore import

export default function DashboardPage() {
  const {
    currentUser,
    loading,
    allBioPages,
    currentBioPage,
    updateCurrentBioPageSession,
    updateTempBioPageConfigSession,
    dirtyFields,
    tempBioPageConfig,
    clearTempBioPage,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState("links");
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);
  const [pendingPageId, setPendingPageId] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [lifetimeStats, setLifetimeStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    totalLikes: 0,
  });
  const [isSeoAiLoading, setIsSeoAiLoading] = useState(false);

  const resetNavigation = () => {
    setPendingTab(null);
    setPendingPageId(null);
    setShowUnsavedModal(false);
  };

  const unsavedChanges = Object.keys(dirtyFields).length > 0;
  const router = useRouter();

  /* useEffect(() => {
     if (currentBioPage?.id) {
       fetchPageData(currentBioPage.id);
     }
   }, [currentBioPage?.id]);*/

  const fetchPageData = async (pageId) => {
    try {
      const [linksRes, analyticsRes] = await Promise.all([
        axios.get(`${ENDPOINTS.LINKS}?pageId=${pageId}`),
        axios.get(`${ENDPOINTS.ANALYTICS.GET}?pageId=${pageId}`),
      ]);
      if (linksRes.data.success) {
        updateCurrentBioPageSession({
          ...currentBioPage,
          links: linksRes.data.data,
        });
      }
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
        setLifetimeStats(
          analyticsRes.data.lifetime || {
            totalViews: 0,
            totalClicks: 0,
            totalLikes: 0,
          }
        );
      }
    } catch (error) {
      toast.error("Failed to load page data");
    }
  };

  const performPageSwitch = async (pageId) => {
    try {
      const response = await axios.get(`${ENDPOINTS.PAGES_BY_ID(pageId)}`);
      updateCurrentBioPageSession(response.data.data);
      resetNavigation();
    } catch (error) {
      toast.error(`Error fetching page data: ${error}`);
    }
  };

  const handleDiscardAndSwitch = () => {
    if (pendingPageId) {
      performPageSwitch(pendingPageId).then(() => resetNavigation());
    } else if (pendingTab) {
      setActiveTab(pendingTab);
      clearTempBioPage();
      resetNavigation();
    }
  };

  const handleSaveAndSwitch = async () => {
    const success = await handleGlobalSave();
    if (success) {
      if (pendingPageId) {
        performPageSwitch(pendingPageId);
      } else if (pendingTab) {
        setActiveTab(pendingTab);
        resetNavigation();
      }
    }
  };

  const handleReorder = async (newLinks) => {
    try {
      // Find only links that actually changed position
      const oldLinks = currentBioPage?.links || [];
      const reorderPayload = newLinks
        .map((l, index) => ({ id: l.id, order: index }))
        .filter((item, index) => {
          const original = oldLinks.find((ol) => ol.id === item.id);
          // Compare with its original index in the session links
          return original && oldLinks.indexOf(original) !== index;
        });

      // Optimistic update for UI smoothness
      updateCurrentBioPageSession({ ...currentBioPage, links: newLinks });

      if (reorderPayload.length === 0) return;

      await axios.put(ENDPOINTS.LINKS, { links: reorderPayload });
    } catch (error) {
      toast.error("Could not save link order. Please try again.");
      fetchPageData(currentBioPage.id);
    }
  };

  const handleAddLink = async (newLinkData) => {
    try {
      const { data } = await axios.post(ENDPOINTS.LINKS, {
        ...newLinkData,
        pageId: currentBioPage.id,
      });
      if (data.success) {
        updateCurrentBioPageSession({ ...currentBioPage, links: data.data });
        toast.success("New link added to your bio! 🚀");
      }
    } catch (error) {
      toast.error("Could not add link. Please try again.");
    }
  };

  const handleUpdateLink = async (updatedLink) => {
    try {
      const originalLink = currentBioPage.links?.find((l) => l.id === updatedLink.id);
      let payload = updatedLink;

      if (originalLink) {
        // Create minimized payload with only changed fields
        payload = { id: updatedLink.id };
        let hasChanges = false;

        Object.keys(updatedLink).forEach((key) => {
          // Normalize for comparison: treat null/undefined/"" as same blank state
          const val1 = updatedLink[key] ?? "";
          const val2 = originalLink[key] ?? "";

          if (
            updatedLink[key] !== undefined &&
            val1 !== val2
          ) {
            payload[key] = updatedLink[key];
            hasChanges = true;
          }
        });

        if (!hasChanges) return;
      }

      const { data } = await axios.patch(ENDPOINTS.LINKS, payload);

      if (data.success) {
        updateCurrentBioPageSession({ ...currentBioPage, links: data.data });
        toast.success("Link updated successfully!");
      }
    } catch (error) {
      toast.error("Could not update link. Please try again.");
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      const { data } = await axios.delete(`${ENDPOINTS.LINKS}?id=${id}`);
      if (data.success) {
        updateCurrentBioPageSession({
          ...currentBioPage,
          links: currentBioPage.links.filter((l) => l.id !== id),
        });
        toast.success("Link removed from your bio");
      }
    } catch (error) {
      toast.error("Could not remove link. Please try again.");
    }
  };

  const handleImageUpload = async (file) => {
    if (!currentBioPage || !file) return;
    const toastId = toast.loading("Uploading profile image...");
    try {
      const formData = new FormData();
      formData.append("id", currentBioPage.id);
      formData.append("profile_image_file", file);

      const { data } = await axios.patch(ENDPOINTS.PAGES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        updateCurrentBioPageSession({ ...currentBioPage, ...data.data });
        toast.success("Profile image updated!", { id: toastId });
      } else {
        toast.error(data.error || "Upload failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
    }
  };

  const handleGlobalSave = async () => {
    if (!currentBioPage) return false;
    try {
      const { data } = await axios.put(
        ENDPOINTS.PAGES_BY_ID(currentBioPage.id),
        tempBioPageConfig
      );
      if (data.success) {
        updateCurrentBioPageSession({
          ...currentBioPage,
          ...tempBioPageConfig,
        });
        toast.success("Changes saved!");
        clearTempBioPage();
        return true;
      } else {
        toast.error(data.error || "Save failed.");
        return false;
      }
    } catch (error) {
      toast.error("Save failed.");
      return false;
    }
  };

  const handleSeoAiMagic = async () => {
    setIsSeoAiLoading(true);
    try {
      const { data } = await axios.post(ENDPOINTS.AI.GENERATE_SEO, {
        title: currentBioPage.title,
        bio: currentBioPage.bio,
        slug: currentBioPage.slug,
      });
      if (data.success) {
        const seoUpdates = {
          seo: {
            ...currentBioPage.seo,
            ...data.data,
          },
        };
        updateTempBioPageConfigSession(seoUpdates);
        toast.success("AI generated new SEO data! Review & Click Save.", {
          icon: "✨",
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "AI Optimization failed. Please try again."
      );
    } finally {
      setIsSeoAiLoading(false);
    }
  };

  const handleTabSwitch = (tabKey) => {
    if (tabKey === activeTab) return; // Same tab

    if (unsavedChanges) {
      setPendingTab(tabKey);
      setShowUnsavedModal(true);
    } else {
      setActiveTab(tabKey);
    }
  };

  const handleCreatePage = async () => {
    try {
      const newSlug = `page-${Math.floor(Math.random() * 10000)}`;
      const { data } = await axios.post(ENDPOINTS.PAGES, {
        slug: newSlug,
        title: "My New Bio",
        bio: "Welcome to my new page!",
      });
      if (data.success) {
        toast.success("New bio page created successfully! 🚀");
        useAuthStore.setState({ allBioPages: [...allBioPages, data.data] });
        performPageSwitch(data.data.id);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Could not create page");
    }
  };


  return (
    <DashboardLayout
      currentUser={currentUser}
      page={currentBioPage}
      pages={allBioPages}
      onSelectPage={(pageId) => {
        if (pageId === currentBioPage.id) return;
        if (unsavedChanges) {
          setPendingPageId(pageId);
          setShowUnsavedModal(true);
        } else {
          performPageSwitch(pageId);
        }
      }}
      onCreatePage={handleCreatePage}
    >
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onCancel={() => setShowUnsavedModal(false)}
        onDiscard={handleDiscardAndSwitch}
        onSave={handleSaveAndSwitch}
      />

      <div className="flex flex-col lg:flex-row gap-6 min-h-full">
        <div className="flex-1 w-full max-w-5xl mx-auto">
          {/* Admin Indicator */}
          {currentUser?.role === "admin" && (
            <div className="alert bg-base-100 border-l-4 border-primary shadow-sm mb-6 rounded-l-none">
              <RiAdminLine className="text-2xl text-primary shrink-0" />
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  Admin Dashboard
                  <span className="badge badge-xs badge-neutral">SU</span>
                </h3>
                <p className="text-xs opacity-60 mt-0.5">
                  You have full system access. Manage tickets in the Support tab.
                </p>
              </div>
            </div>
          )}

          {/* Responsive Tabs */}
          <div role="tablist" className="tabs tabs-boxed bg-base-100 p-2 mb-6 shadow-sm gap-2">
            {[
              { key: "links", label: "My Links", icon: RiLayoutLine },
              { key: "theme", label: "Bio Design", icon: RiPaletteLine },
              { key: "settings", label: "Bio Profile", icon: RiSettingsLine },
              { key: "qr", label: "QR Share", icon: RiQrCodeLine },
              { key: "analytics", label: "Insights", icon: RiBarChartLine },
              { key: "account", label: "Account", icon: RiUserLine },
              { key: "support", label: "Help", icon: RiCustomerService2Line },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                role="tab"
                onClick={() => handleTabSwitch(key)}
                className={`tab h-14 md:h-10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 transition-all ${activeTab === key ? "tab-active bg-primary text-primary-content" : ""
                  }`}
              >
                <Icon className="text-2xl md:text-lg" />
                <span className="text-[10px] md:text-sm font-medium md:font-normal">
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="hidden bg-base-100 p-6 shadow-sm border border-base-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary">
                <RiEyeLine className="text-2xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                  Total Views
                </p>
                <p className="text-2xl font-medium">
                  {currentBioPage?.views || 0}
                </p>
              </div>
            </div>
            <div className="hidden bg-base-100 p-6 shadow-sm border border-base-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-500/10 flex items-center justify-center text-pink-500">
                <RiHeartLine className="text-2xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                  Fan Love
                </p>
                <p className="text-2xl font-medium">
                  {currentBioPage?.likes || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "links" && (
              <LinkEditor
                links={currentBioPage?.links}
                plan={currentUser?.plan}
                onReorder={handleReorder}
                onAdd={handleAddLink}
                onUpdate={handleUpdateLink}
                onDelete={handleDeleteLink}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsView
                data={analytics}
                plan={currentUser?.plan}
                links={currentBioPage?.links}
                currentBioPage={currentBioPage}
              />
            )}

            {activeTab === "qr" && (
              <QRGenerator
                slug={currentBioPage?.slug}
                plan={currentUser?.plan}
              />
            )}

            {activeTab === "support" && (
              <SupportView currentUser={currentUser} />
            )}

            {activeTab === "theme" && (
              <ThemeTab
                currentBioPage={currentBioPage}
                tempBioPageConfig={tempBioPageConfig}
                currentUser={currentUser}
                setTempPageData={updateTempBioPageConfigSession}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                currentBioPage={currentBioPage}
                tempBioPageConfig={tempBioPageConfig}
                currentUser={currentUser}
                setTempPageData={updateTempBioPageConfigSession}
                onSeoAiMagic={handleSeoAiMagic}
                isSeoAiLoading={isSeoAiLoading}
                CONFIG={CONFIG}
                onImageUpload={handleImageUpload}
              />
            )}

            {activeTab === "account" && (
              <div className="space-y-4">
                <UsageMetrics />
                <SubscriptionDetails />
                <DangerZone />
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[400px] mt-20 lg:mt-0">
          <div className="lg:sticky top-8 transform-gpu scale-[0.8] sm:scale-95 lg:scale-90 lg:translate-x-4 origin-top flex justify-center lg:block">
            <PreviewPhoneNew
              key={`${currentBioPage?.id}-${currentBioPage?.links
                .map((l) => l.id + l.is_active)
                .join("|")}`}
            />
          </div>
        </div>
      </div>

      {/* Global Save Button (Floating) */}
      <div
        className={`fixed bottom-8 right-8 z-50 transition-all duration-300 transform ${unsavedChanges
          ? "translate-y-0 opacity-100"
          : "translate-y-20 opacity-0 pointer-events-none"
          }`}
      >
        <button
          onClick={handleGlobalSave}
          className="btn btn-primary btn-lg shadow-2xl gap-3 pl-6 pr-8 border-4 border-base-100 animate-bounce-subtle"
        >
          <div className="w-3 h-3 rounded-full bg-error animate-pulse shadow-[0_0_10px_theme(colors.error)]"></div>
          Save Changes
        </button>
      </div>
    </DashboardLayout>
  );
}
