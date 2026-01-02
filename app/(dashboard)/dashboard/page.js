"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LinkEditor from "@/components/dashboard/LinkEditor";
import PreviewPhone from "@/components/shared/PreviewPhone";
import UnsavedChangesModal from "@/components/dashboard/UnsavedChangesModal";
import ThemeTab from "@/components/dashboard/ThemeTab";
import SettingsTab from "@/components/dashboard/SettingsTab";
import { SkeletonChart, SkeletonTable, SkeletonDashboard } from "@/components/shared/SkeletonLoaders";
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
    RiLayoutMasonryLine,
    RiUserLine,
    RiLockLine,
    RiSearchEyeLine,
    RiSparklingLine,
    RiMagicLine,
    RiShieldStarLine,
    RiAdminLine,
    RiLinksLine,
    RiInstagramLine,
    RiTwitterLine,
    RiFacebookLine,
    RiLinkedinLine,
    RiGithubLine,
    RiYoutubeLine,
    RiTiktokLine
} from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import { useRouter } from "next/navigation";
import SubscriptionStatusDiv from "@/components/dashboard/SubscriptionStatusDiv";
import { useLoader } from "@/context/LoaderContext";
import { useAuth } from "@/context/AuthContext";

// Lazy load heavy components
const AnalyticsView = dynamic(() => import("@/components/dashboard/AnalyticsView"), {
    loading: () => <SkeletonDashboard />,
    ssr: false
});

const QRGenerator = dynamic(() => import("@/components/dashboard/QRGenerator"), {
    loading: () => <SkeletonChart />,
    ssr: false
});

const SupportView = dynamic(() => import("@/components/dashboard/SupportView"), {
    loading: () => <SkeletonTable />,
    ssr: false
});

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);

    const [page, setPage] = useState(null);
    const [allPages, setAllPages] = useState([]);
    const [links, setLinks] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [lifetimeStats, setLifetimeStats] = useState({ totalViews: 0, totalClicks: 0, totalLikes: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("links");
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const router = useRouter();

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            showLoader();
            const { data } = await axios.get("/dashboard/init");
            console.log('datadatadatadata = ', data);
            if (data.success) {
                const { currentUser, pages, activePage, links: initLinks, analytics: initAnalytics, lifetime: initLifetime, subscriptionStatus: subStatus } = data.data;

                setAllPages(pages);
                setSubscriptionStatus(subStatus);
                setLifetimeStats(initLifetime || { totalViews: 0, totalClicks: 0, totalLikes: 0 });

                if (pages.length > 0) {
                    // Use the active page returned by API (logic is: first page) or keep existing if switching
                    const selectedPage = page ? pages.find(p => p._id === page._id) || activePage : activePage;
                    setPage(selectedPage);

                    // If the API returned links/analytics for the active page, use them
                    // Otherwise fetch them (e.g. if we switched page locally but API init is just default)
                    if (selectedPage._id === activePage._id) {
                        setLinks(initLinks);
                        setAnalytics(initAnalytics);
                    } else {
                        // Fallback if we somehow have a different page selected in state (unlikely on init)
                        await fetchPageData(selectedPage._id);
                    }
                }
                // No need to create default page here anymore - handled by verification API
            }
        } catch (error) {
            console.error("Fetch error", error);
            // Fallback to legacy flow if aggregated fails? 
            // "Backward Compatibility Guarantee ... Existing APIs remain available as fallback"
            // For now, let's trust the new API but log error.
            toast.error("Failed to load dashboard data");
        } finally {
            hideLoader();
        }
    };

    const fetchPageData = async (pageId) => {
        try {
            const [linksRes, analyticsRes] = await Promise.all([
                axios.get(`/links?pageId=${pageId}`),
                axios.get(`/analytics?pageId=${pageId}`)
            ]);
            if (linksRes.data.success) setLinks(linksRes.data.data);
            if (analyticsRes.data.success) {
                setAnalytics(analyticsRes.data.data);
                setLifetimeStats(analyticsRes.data.lifetime || { totalViews: 0, totalClicks: 0, totalLikes: 0 });
            }
        } catch (error) {
            toast.error("Failed to load page data");
        }
    };

    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingPageId, setPendingPageId] = useState(null);
    const [pendingTab, setPendingTab] = useState(null);

    const handleSwitchRequest = (pageId) => {
        if (pageId === page._id) return; // Same page

        if (unsavedChanges) {
            setPendingPageId(pageId);
            setShowUnsavedModal(true);
        } else {
            performPageSwitch(pageId);
        }
    };

    const performPageSwitch = async (pageId) => {
        try {
            showLoader();
            // Fetch fresh pages list to ensure local state is distinct and up-to-date
            const { data } = await axios.get("/pages");
            if (data.success) {
                const freshPages = data.data;
                setAllPages(freshPages);

                const selected = freshPages.find(p => p._id === pageId);
                if (selected) {
                    setPage(selected);
                    setUnsavedChanges(false);
                    setDirtySections(new Set());
                    // Fetch links & analytics for the new page
                    fetchPageData(pageId);
                }
            }
        } catch (error) {
            console.error("Failed to switch page:", error);
            toast.error("Failed to load page data");
        } finally {
            hideLoader();
            setShowUnsavedModal(false);
            setPendingPageId(null);
        }

    };

    const handleDiscardAndSwitch = () => {
        if (pendingPageId) {
            performPageSwitch(pendingPageId);
        } else if (pendingTab) {
            setActiveTab(pendingTab);
            setUnsavedChanges(false);
            setDirtySections(new Set());
            setShowUnsavedModal(false);
            setPendingTab(null);
        }
    };

    const handleSaveAndSwitch = async () => {
        const success = await handleGlobalSave();
        // After save, handleGlobalSave sets unsavedChanges to false
        // We can then switch
        if (success && pendingPageId) {
            performPageSwitch(pendingPageId);
        } else if (success && pendingTab) {
            setActiveTab(pendingTab);
            setShowUnsavedModal(false);
            setPendingTab(null);
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
            showLoader();
            const newSlug = `page-${Math.floor(Math.random() * 10000)}`;
            const { data } = await axios.post("/pages", {
                slug: newSlug,
                title: "My New Bio",
                bio: "Welcome to my new page!"
            });
            if (data.success) {
                toast.success("New bio page created successfully! 🚀");
                setAllPages([...allPages, data.data]);
                setPage(data.data);
                // Fetch fresh data for the new page (links, analytics, lifetime stats)
                fetchPageData(data.data._id);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Could not create page");
        } finally {
            hideLoader();
        }
    };

    const handleReorder = async (newLinks) => {
        showLoader();
        setLinks(newLinks);
        try {
            const reorderPayload = newLinks.map((l, index) => ({ id: l._id, order: index }));
            await axios.put("/links", { links: reorderPayload });
        } catch (error) {
            toast.error("Could not save link order. Please try again.");
            fetchData();
        } finally {
            hideLoader();
        }
    };

    const handleAddLink = async (newLinkData) => {
        try {
            showLoader();
            const { data } = await axios.post("/links", {
                ...newLinkData,
                pageId: page._id
            });
            if (data.success) {
                setLinks([...links, data.data]);
                toast.success("New link added to your bio! 🚀");
            }
        } catch (error) {
            toast.error("Could not add link. Please try again.");
        } finally {
            hideLoader();
        }
    };

    const handleUpdateLink = async (updatedLink) => {
        try {
            showLoader();
            const { id, ...updates } = updatedLink;
            const { data } = await axios.patch("/links", { id: updatedLink._id, ...updates });
            if (data.success) {
                console.log('data.data ', data.data)
                const updatedData = await data.data;
                const updatedLinks = links.map(l => l._id === updatedLink._id ? updatedData : l);
                setLinks(updatedLinks);
                toast.success("Link updated successfully!");
            }
        } catch (error) {
            toast.error("Could not update link. Please try again.");
        } finally {
            hideLoader();
        }
    };

    const handleDeleteLink = async (id) => {
        try {
            showLoader();
            const { data } = await axios.delete(`/links?id=${id}`);
            if (data.success) {
                setLinks(links.filter(l => l._id !== id));
                toast.success("Link removed from your bio");
            }
        } catch (error) {
            toast.error("Could not remove link. Please try again.");
        } finally {
            hideLoader();
        }
    };

    const [dirtySections, setDirtySections] = useState(new Set());

    // Global Save Logic
    const handleGlobalSave = async () => {
        if (!page) return false;
        showLoader();
        try {
            // Save all relevant fields
            const { data } = await axios.patch("/pages", {
                id: page._id,
                title: page.title,
                slug: page.slug,
                bio: page.bio,
                theme: page.theme,
                template: page.template,
                branding: page.branding,
                profileImage: page.profileImage,
                profileImageHash: page.profileImageHash,
                seo: page.seo,
                socialLinks: page.socialLinks
            });

            if (data.success) {
                setPage(data.data);
                setUnsavedChanges(false);

                // Smart Toast Message
                const sections = Array.from(dirtySections);
                let message = "Global changes saved!";
                if (sections.length > 0) {
                    const formattedSections = sections.length > 2
                        ? `${sections.slice(0, 2).join(", ")} & more`
                        : sections.join(" & ");
                    message = `${formattedSections} updated successfully!`;
                }

                toast.success(message);
                setDirtySections(new Set());
                return true;
            } else {
                toast.error(data.error || "Save failed but no error returned.");
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Could not save changes. Please try again.");
            return false;
        } finally {
            hideLoader();
        }
    };


    // Helper for purely local updates (that trigger unsaved state)
    const handleLocalUpdate = (updates) => {
        showLoader();
        try {
            setPage(prev => ({ ...prev, ...updates }));
            setUnsavedChanges(true);

            // Track dirty sections for smarter toast
            const keys = Object.keys(updates);
            setDirtySections(prev => {
                const newSet = new Set(prev);
                keys.forEach(key => {
                    if (['title', 'slug', 'bio', 'profileImage'].includes(key)) newSet.add('Identity');
                    if (['seo'].includes(key)) newSet.add('SEO');
                    if (['branding'].includes(key)) newSet.add('Branding');
                    if (['theme', 'template'].includes(key)) newSet.add('Style');
                });
                return newSet;
            });
        } catch (error) {
            toast.error("Could not update page. Please try again.");
        } finally {
            hideLoader();
        }
    };

    const [isSeoAiLoading, setIsSeoAiLoading] = useState(false);

    const handleSeoAiMagic = async () => {
        setIsSeoAiLoading(true);
        try {
            showLoader();
            const { data } = await axios.post("/ai/generate-seo", {
                title: page.title,
                bio: page.bio,
                slug: page.slug
            });
            if (data.success) {
                const seoUpdates = {
                    seo: {
                        ...page.seo,
                        ...data.data
                    }
                };
                // Use local update so currentUser can review before saving
                handleLocalUpdate(seoUpdates);
                toast.success("AI generated new SEO data! Review & Click Save.", { icon: "✨" });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "AI Optimization failed. Please try again.");
        } finally {
            setIsSeoAiLoading(false);
            hideLoader();
        }
    };


    const trialEndDate = new Date(currentUser?.createdAt);
    trialEndDate.setHours(trialEndDate.getHours() + 24);
    const expiryDate = new Date(currentUser?.createdAt);
    expiryDate.setDate(expiryDate.getDate() + 8);

    return (
        <DashboardLayout
            currentUser={currentUser}
            page={page}
            pages={allPages}
            onSelectPage={handleSwitchRequest}
            onCreatePage={handleCreatePage}
        >
            <UnsavedChangesModal
                isOpen={showUnsavedModal}
                onCancel={() => setShowUnsavedModal(false)}
                onDiscard={handleDiscardAndSwitch}
                onSave={handleSaveAndSwitch}
            />



            {/* Subscription Status - Handles Trial & Renewal Alerts */}
            <SubscriptionStatusDiv currentUser={currentUser} initialData={subscriptionStatus} redirectOnExpire={false} />

            <div className="flex flex-col lg:flex-row gap-8 min-h-full">
                <div className="flex-1 w-full max-w-5xl mx-auto">

                    {/* Admin Indicator */}
                    {currentUser?.role === 'admin' && (
                        <div className="alert bg-base-100 border-l-4 border-primary shadow-sm mb-6 rounded-l-none">
                            <RiAdminLine className="text-2xl text-primary" />
                            <div>
                                <h3 className="font-bold flex items-center gap-2">
                                    Admin Dashboard
                                    <span className="badge badge-xs badge-neutral">SU</span>
                                </h3>
                                <div className="text-xs opacity-60">You have full system access. Manage tickets in the Support tab.</div>
                            </div>
                        </div>
                    )}

                    {/* Responsive Tabs Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-base-100 p-2 mb-2 shadow-sm">
                        {[
                            { key: "links", label: "Links", icon: RiLayoutLine },
                            { key: "analytics", label: "Stats", icon: RiBarChartLine },
                            { key: "qr", label: "QR", icon: RiQrCodeLine },
                            { key: "theme", label: "Style", icon: RiPaletteLine },
                            { key: "support", label: "Help", icon: RiCustomerService2Line },
                            { key: "settings", label: "Settings", icon: RiSettingsLine },
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => handleTabSwitch(key)}
                                className={`
                btn btn-ghost
                h-14 md:h-10
                flex flex-col md:flex-row
                items-center justify-center
                gap-1 md:gap-2
                transition-all
                ${activeTab === key ? "btn-active !bg-primary !text-primary-content" : ""}
            `}
                            >
                                {/* Icon */}
                                <Icon
                                    className="
                    text-2xl md:text-lg
                    transition-transform
                    group-hover:scale-110
                "
                                />

                                {/* Label */}
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
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Total Views</p>
                                <p className="text-2xl font-medium">{page?.views || 0}</p>
                            </div>
                        </div>
                        <div className="hidden bg-base-100 p-6 shadow-sm border border-base-200 flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-500/10 flex items-center justify-center text-pink-500">
                                <RiHeartLine className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Fan Love</p>
                                <p className="text-2xl font-medium">{page?.likes || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === "links" && (
                            <LinkEditor
                                links={links}
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
                                links={links}
                                page={page}
                                lifetime={lifetimeStats}
                            />
                        )}

                        {activeTab === "qr" && (
                            <QRGenerator slug={page?.slug} plan={currentUser?.plan} />
                        )}

                        {activeTab === "support" && (
                            <SupportView currentUser={currentUser} />
                        )}

                        {activeTab === "theme" && (
                            <ThemeTab
                                page={page}
                                currentUser={currentUser}
                                onUpdate={handleLocalUpdate}
                            />
                        )}

                        {activeTab === "settings" && (
                            <SettingsTab
                                page={page}
                                currentUser={currentUser}
                                setPage={setPage}
                                setUnsavedChanges={setUnsavedChanges}
                                onUpdate={handleLocalUpdate}
                                onSeoAiMagic={handleSeoAiMagic}
                                isSeoAiLoading={isSeoAiLoading}
                                CONFIG={CONFIG}
                            />
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-[400px] mt-20 lg:mt-0">
                    <div className="lg:sticky top-8 transform-gpu scale-[0.8] sm:scale-95 lg:scale-90 lg:translate-x-4 origin-top flex justify-center lg:block">
                        <PreviewPhone
                            key={`${page?.id}-${links.map(l => l._id + l.isActive).join('|')}-${unsavedChanges}`}
                            pageData={page} links={links}
                            lifetime={lifetimeStats}
                        />
                    </div>
                </div>
            </div>

            {/* Global Save Button (Floating) */}
            <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 transform ${unsavedChanges ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <button
                    onClick={handleGlobalSave}
                    className="btn btn-primary btn-lg shadow-2xl gap-3 pl-6 pr-8 border-4 border-base-100 animate-bounce-subtle"
                >
                    <div className="w-3 h-3 rounded-full bg-error animate-pulse shadow-[0_0_10px_theme(colors.error)]"></div>
                    Save Changes
                </button>
            </div>
        </DashboardLayout >
    );
}
