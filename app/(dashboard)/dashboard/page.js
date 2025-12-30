"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LinkEditor from "@/components/dashboard/LinkEditor";
import PreviewPhone from "@/components/shared/PreviewPhone";
import ThemeSelector from "@/components/dashboard/ThemeSelector";
import TemplateSelector from "@/components/dashboard/TemplateSelector";
import BrandingEditor from "@/components/dashboard/BrandingEditor";
import ProfileUpload from "@/components/dashboard/ProfileUpload";
import SmartPlanAlert from "@/components/dashboard/SmartPlanAlert";
import UnsavedChangesModal from "@/components/dashboard/UnsavedChangesModal";
import DangerZone from "@/components/dashboard/DangerZone";
import { SkeletonChart, SkeletonTable, SkeletonDashboard } from "@/components/shared/SkeletonLoaders";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { useGetDashboardInitQuery } from "@/store/services/dashboardApi";
import {
    useUpdatePageMutation,
    useCreatePageMutation
} from "@/store/services/pageApi";
import {
    useGetLinksQuery,
    useCreateLinkMutation,
    useUpdateLinkMutation,
    useDeleteLinkMutation,
    useReorderLinksMutation
} from "@/store/services/linkApi";
import { useGetAnalyticsQuery } from "@/store/services/analyticsApi";
import axios from "@/lib/axios"; // Kept for AI calls for now
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
    const { user: authUser } = useAuth();
    const { setLoading } = useLoading();
    const router = useRouter();

    // Utility wrapper to show global loading indicator during async operations
    const withLoading = useCallback((asyncFn) => {
        return async (...args) => {
            setLoading(true);
            try {
                return await asyncFn(...args);
            } finally {
                setLoading(false);
            }
        };
    }, [setLoading]);

    // Redux State & Hooks
    const {
        data: initData,
        isLoading: isInitLoading,
        isError: isInitError,
    } = useGetDashboardInitQuery();

    const [updatePage] = useUpdatePageMutation();
    const [createPage] = useCreatePageMutation();
    const [reorderLinks] = useReorderLinksMutation();
    const [createLink] = useCreateLinkMutation();
    const [updateLink] = useUpdateLinkMutation();
    const [deleteLink] = useDeleteLinkMutation();

    // Local UI State
    const [activeTab, setActiveTab] = useState("links");
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [dirtySections, setDirtySections] = useState(new Set());
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingPageId, setPendingPageId] = useState(null);
    const [pendingTabId, setPendingTabId] = useState(null);
    const [selectedPageId, setSelectedPageId] = useState(null);
    const [localPageData, setLocalPageData] = useState(null);
    const [isSwitching, setIsSwitching] = useState(false);
    const lastSaveTimeRef = useRef(0);

    // Derived State
    const user = initData?.user || authUser;
    const allPages = initData?.pages || [];
    const subscriptionStatus = initData?.subscriptionStatus || null;

    useEffect(() => {
        if (initData?.activePageId && !selectedPageId) {
            setSelectedPageId(initData.activePageId);
        }
    }, [initData, selectedPageId]);

    // Sync global loader with initial data fetching
    useEffect(() => {
        setLoading(isInitLoading);
    }, [isInitLoading, setLoading]);

    const page = allPages.find(p => p._id === selectedPageId)
        || allPages.find(p => p._id === initData?.activePageId)
        || allPages[0];

    // Sync localPageData when page changes
    // Sync localPageData when page changes, but ignore if we just saved < 2 seconds ago
    useEffect(() => {
        const timeSinceSave = Date.now() - lastSaveTimeRef.current;
        if (page && !unsavedChanges && timeSinceSave > 2000) {
            setLocalPageData(page);
        }
    }, [page?._id, page, unsavedChanges]);

    // Secondary Hooks for dynamic updates
    const { data: linksData } = useGetLinksQuery(selectedPageId, { skip: !selectedPageId });
    const {
        data: analyticsData,
        refetch: refetchAnalytics,
        isFetching: isAnalyticsFetching
    } = useGetAnalyticsQuery({ pageId: selectedPageId }, { skip: !selectedPageId || activeTab !== 'analytics' });

    const links = linksData || (selectedPageId === initData?.activePageId ? initData?.links : []) || [];
    const analytics = analyticsData?.data || (selectedPageId === initData?.activePageId ? initData?.analytics : []) || [];
    const lifetimeStats = analyticsData?.lifetime || (selectedPageId === initData?.activePageId ? initData?.lifetime : { totalViews: 0, totalClicks: 0, totalLikes: 0 });

    const handleSwitchRequest = (pageId = null, tabId = null) => {
        if (pageId && pageId === selectedPageId) return;
        if (tabId && tabId === activeTab) return;

        if (unsavedChanges) {
            setPendingPageId(pageId);
            setPendingTabId(tabId);
            setShowUnsavedModal(true);
        } else {
            if (pageId) setSelectedPageId(pageId);
            if (tabId) setActiveTab(tabId);
        }
    };

    const handleDiscardAndSwitch = () => {
        if (pendingPageId) setSelectedPageId(pendingPageId);
        if (pendingTabId) setActiveTab(pendingTabId);

        setUnsavedChanges(false);
        setDirtySections(new Set());
        setShowUnsavedModal(false);
        setPendingPageId(null);
        setPendingTabId(null);
    };

    const handleSaveAndSwitch = async () => {
        setIsSwitching(true);
        try {
            await handleGlobalSave();
            if (pendingPageId) setSelectedPageId(pendingPageId);
            if (pendingTabId) setActiveTab(pendingTabId);

            setShowUnsavedModal(false);
            setPendingPageId(null);
            setPendingTabId(null);
        } finally {
            setIsSwitching(false);
        }
    };

    const handleCreatePage = withLoading(async () => {
        try {
            const newSlug = `page-${Math.floor(Math.random() * 10000)}`;
            const res = await createPage({
                slug: newSlug,
                title: "My New Bio",
                bio: "Welcome to my new page!"
            }).unwrap();

            if (res) {
                toast.success("New bio page created successfully! 🚀");
                setSelectedPageId(res._id);
            }
        } catch (error) {
            toast.error(error.data?.error || "Could not create page");
        }
    });

    const handleReorder = useCallback(withLoading(async (newLinks) => {
        try {
            const reorderPayload = newLinks.map((l, index) => ({ id: l._id, order: index }));
            await reorderLinks(reorderPayload).unwrap();
        } catch (error) {
            toast.error("Could not save link order. Please try again.");
        }
    }), [reorderLinks]);

    const handleAddLink = useCallback(withLoading(async (newLinkData) => {
        try {
            await createLink({
                ...newLinkData,
                pageId: selectedPageId
            }).unwrap();
            toast.success("New link added to your bio! 🚀");
        } catch (error) {
            toast.error("Could not add link. Please try again.");
        }
    }), [createLink, selectedPageId]);

    const handleUpdateLink = useCallback(withLoading(async (updatedLink) => {
        try {
            const { _id, ...updates } = updatedLink;
            await updateLink({ id: _id, ...updates }).unwrap();
            toast.success("Link updated successfully!");
        } catch (error) {
            toast.error("Could not update link. Please try again.");
        }
    }), [updateLink]);

    const handleDeleteLink = useCallback(withLoading(async (id) => {
        try {
            await deleteLink(id).unwrap();
            toast.success("Link removed from your bio");
        } catch (error) {
            toast.error("Could not remove link. Please try again.");
        }
    }), [deleteLink]);



    const handleGlobalSave = withLoading(async () => {
        if (!localPageData) return;
        try {
            const res = await updatePage({
                id: localPageData._id,
                title: localPageData.title,
                slug: localPageData.slug,
                bio: localPageData.bio,
                theme: localPageData.theme,
                template: localPageData.template,
                branding: localPageData.branding,
                profileImage: localPageData.profileImage,
                profileImageHash: localPageData.profileImageHash,
                seo: localPageData.seo,
                socialLinks: localPageData.socialLinks
            }).unwrap();

            if (res) {
                // Update local state with the server response (which is the truth)
                setLocalPageData(res);
                lastSaveTimeRef.current = Date.now();
                setUnsavedChanges(false);

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
            }
        } catch (error) {
            toast.error(error.data?.error || "Could not save changes. Please try again.");
        }
    });

    const handleLocalUpdate = (updates) => {
        setLocalPageData(prev => ({ ...prev, ...updates }));
        setUnsavedChanges(true);

        const keys = Object.keys(updates);
        setDirtySections(prev => {
            const newSet = new Set(prev);
            keys.forEach(key => {
                if (['title', 'slug', 'bio', 'socialLinks'].includes(key)) newSet.add('Identity');
                if (['seo'].includes(key)) newSet.add('SEO');
                if (['branding'].includes(key)) newSet.add('Branding');
                if (['theme', 'template'].includes(key)) newSet.add('Style');
                if (['profileImage'].includes(key)) newSet.add('Profile Image');
            });
            return newSet;
        });
    };

    const isRefetching = isInitLoading || isAnalyticsFetching;
    const timeSinceSave = Date.now() - lastSaveTimeRef.current;

    // Derived state: Use local data if we have unsaved changes OR if we just saved 
    // and are likely waiting for the background refetch to complete.
    const activePageData = (unsavedChanges || (localPageData && timeSinceSave < 3000))
        ? localPageData
        : page;

    const [isSeoAiLoading, setIsSeoAiLoading] = useState(false);
    const handleSeoAiMagic = withLoading(async () => {
        setIsSeoAiLoading(true);
        try {
            const { data } = await axios.post("/ai/generate-seo", {
                title: activePageData.title,
                bio: activePageData.bio,
                slug: activePageData.slug
            });
            if (data.success) {
                handleLocalUpdate({
                    seo: { ...activePageData.seo, ...data.data }
                });
                toast.success("AI generated new SEO data! Review & Click Save.", { icon: "✨" });
            }
        } catch (error) {
            toast.error("AI Optimization failed. Please try again.");
        } finally {
            setIsSeoAiLoading(false);
        }
    });

    if (isInitLoading) return <SkeletonDashboard />;
    if (isInitError) return <div>Error loading dashboard. Please refresh.</div>;

    if (!user) return null;

    const trialEndDate = new Date(user.createdAt);
    trialEndDate.setHours(trialEndDate.getHours() + 24);

    return (
        <DashboardLayout
            user={user}
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
                isLoading={isSwitching}
            />

            {/* Subscription Status - Handles Trial & Renewal Alerts */}
            <SubscriptionStatusDiv user={user} initialData={subscriptionStatus} redirectOnExpire={true} />

            <div className="flex flex-col lg:flex-row gap-8 min-h-full">
                <div className="flex-1 w-full max-w-2xl mx-auto">

                    {/* Admin Indicator */}
                    {user?.role === 'admin' && (
                        <div className="alert bg-base-100 border-l-4 border-primary shadow-sm mb-6 rounded-r-xl rounded-l-none">
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
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 bg-base-100 p-2 mb-8 shadow-sm">
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
                                onClick={() => handleSwitchRequest(null, key)}
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
                                <Icon
                                    className="
                    text-2xl md:text-lg
                    transition-transform
                    group-hover:scale-110
                "
                                />
                                <span className="text-[10px] md:text-sm font-medium md:font-normal">
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === "links" && (
                            <LinkEditor
                                links={links}
                                plan={user?.plan}
                                onReorder={handleReorder}
                                onAdd={handleAddLink}
                                onUpdate={handleUpdateLink}
                                onDelete={handleDeleteLink}
                            />
                        )}

                        {activeTab === "analytics" && (
                            <AnalyticsView
                                data={analytics}
                                plan={user?.plan}
                                links={links}
                                page={page}
                                lifetime={lifetimeStats}
                                onRefresh={refetchAnalytics}
                                isRefreshing={isAnalyticsFetching}
                            />
                        )}

                        {activeTab === "qr" && (
                            <QRGenerator slug={page?.slug} plan={user?.plan} />
                        )}

                        {activeTab === "support" && (
                            <SupportView user={user} />
                        )}

                        {activeTab === "theme" && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="alert bg-primary/5 border-primary/20 p-6">
                                    <div className="flex gap-4">
                                        <div className="p-2 bg-primary/10 text-primary h-fit">
                                            <RiPaletteLine className="text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm mb-1 uppercase tracking-wider">Style Preview</h4>
                                            <p className="text-xs opacity-60 leading-relaxed font-medium">
                                                All changes are saved automatically reflected in the live preview on the right.
                                                Try different combinations to find your perfect look. Don't forgot to save your changes!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <section>
                                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-primary/10 text-primary">
                                            <RiLayoutMasonryLine className="text-xl" />
                                        </div>
                                        1. Choose Template
                                    </h2>
                                    <TemplateSelector
                                        currentTemplate={localPageData?.template}
                                        plan={user?.plan}
                                        onSelect={(t) => handleLocalUpdate({ template: t })}
                                    />
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-primary/10  text-primary">
                                            <RiPaletteLine className="text-xl" />
                                        </div>
                                        2. Choose Identity Theme
                                    </h2>
                                    <div className="bg-base-100 p-2 border border-base-300 shadow-sm overflow-hidden">
                                        <ThemeSelector
                                            currentTheme={localPageData?.theme}
                                            plan={user?.plan}
                                            onSelect={(theme) => handleLocalUpdate({ theme })}
                                        />
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-primary/10 text-primary">
                                            <RiShieldStarLine className="text-xl" />
                                        </div>
                                        3. Branding & White Labeling
                                    </h2>
                                    <BrandingEditor
                                        page={page}
                                        user={user}
                                        onUpdate={handleLocalUpdate}
                                    />
                                </section>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="flex flex-col gap-8">
                                <div className="card bg-base-100 shadow-sm border border-base-300 lg:col-span-2">
                                    <div className="card-body p-8 lg:p-10">
                                        <div className="flex flex-col md:flex-row gap-10">
                                            <div className="flex-none flex flex-col items-center gap-4">
                                                <div className="relative group">
                                                    <ProfileUpload
                                                        currentImage={page?.profileImage}
                                                        userId={user?._id}
                                                        onUploadSuccess={(url, hash) => {
                                                            handleLocalUpdate({
                                                                profileImage: url,
                                                                profileImageHash: hash
                                                            });
                                                            toast.success("Image set! Click 'Save Changes' to persist.", { icon: "💾" });
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-6">
                                                <div>
                                                    <h2 className="text-xl font-medium tracking-tight flex items-center gap-2 mb-1">
                                                        <RiUserLine className="text-primary" />
                                                        Identity & Details
                                                    </h2>
                                                    <p className="text-xs font-medium opacity-50">Manage your public profile information.</p>
                                                </div>

                                                <div className="flex flex-col gap-4">
                                                    <div className="form-control">
                                                        <label className="label" htmlFor="page-title">
                                                            <span className="label-text">Display Title <span className="text-error">*</span></span>
                                                        </label>
                                                        <input
                                                            id="page-title"
                                                            type="text"
                                                            className="input input-bordered"
                                                            placeholder="e.g. your name or brand"
                                                            value={activePageData?.title || ""}
                                                            onChange={(e) => handleLocalUpdate({ title: e.target.value })}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="label" htmlFor="page-slug">
                                                            <span className="label-text">Custom URL <span className="text-error">*</span></span>
                                                        </label>
                                                        <label className="input">
                                                            {CONFIG.SITE_URL}/
                                                            <input
                                                                id="page-slug"
                                                                type="text"
                                                                className="grow"
                                                                placeholder="your-slug"
                                                                value={page?.slug || ""}
                                                                onChange={(e) => {
                                                                    handleLocalUpdate({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') });
                                                                }}
                                                                required
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="form-control">
                                                    <label className="label" htmlFor="page-bio">
                                                        <span className="label-text">Bio / Description</span>
                                                    </label>
                                                    <textarea
                                                        id="page-bio"
                                                        className="textarea textarea-bordered h-24 resize-none"
                                                        placeholder="Tell the world who you are..."
                                                        value={activePageData?.bio || ""}
                                                        onChange={(e) => {
                                                            handleLocalUpdate({ bio: e.target.value });
                                                        }}
                                                    />
                                                </div>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium flex items-center gap-2">
                                                            <RiLinksLine className="text-primary" />
                                                            Social Media Links
                                                        </span>
                                                    </label>
                                                    <p className="text-xs opacity-50 mb-4">Add your social profiles. They'll appear at the bottom of your bio page.</p>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Instagram */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2" htmlFor="social-instagram">
                                                                <RiInstagramLine className="text-lg opacity-60" />
                                                                <input
                                                                    id="social-instagram"
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="instagram.com/username"
                                                                    value={activePageData?.socialLinks?.instagram || ""}
                                                                    onChange={(e) => {
                                                                        handleLocalUpdate({
                                                                            socialLinks: {
                                                                                ...activePageData.socialLinks,
                                                                                instagram: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* Twitter */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2" htmlFor="social-twitter">
                                                                <RiTwitterLine className="text-lg opacity-60" />
                                                                <input
                                                                    id="social-twitter"
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="twitter.com/username"
                                                                    value={activePageData?.socialLinks?.twitter || ""}
                                                                    onChange={(e) => {
                                                                        handleLocalUpdate({
                                                                            socialLinks: {
                                                                                ...activePageData.socialLinks,
                                                                                twitter: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* Facebook */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2" htmlFor="social-facebook">
                                                                <RiFacebookLine className="text-lg opacity-60" />
                                                                <input
                                                                    id="social-facebook"
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="facebook.com/username"
                                                                    value={activePageData?.socialLinks?.facebook || ""}
                                                                    onChange={(e) => {
                                                                        handleLocalUpdate({
                                                                            socialLinks: {
                                                                                ...activePageData.socialLinks,
                                                                                facebook: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* LinkedIn */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2" htmlFor="social-linkedin">
                                                                <RiLinkedinLine className="text-lg opacity-60" />
                                                                <input
                                                                    id="social-linkedin"
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="linkedin.com/in/username"
                                                                    value={activePageData?.socialLinks?.linkedin || ""}
                                                                    onChange={(e) => {
                                                                        handleLocalUpdate({
                                                                            socialLinks: {
                                                                                ...activePageData.socialLinks,
                                                                                linkedin: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* GitHub */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2" htmlFor="social-github">
                                                                <RiGithubLine className="text-lg opacity-60" />
                                                                <input
                                                                    id="social-github"
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="github.com/username"
                                                                    value={activePageData?.socialLinks?.github || ""}
                                                                    onChange={(e) => {
                                                                        handleLocalUpdate({
                                                                            socialLinks: {
                                                                                ...activePageData.socialLinks,
                                                                                github: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* YouTube */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2" htmlFor="social-youtube">
                                                                <RiYoutubeLine className="text-lg opacity-60" />
                                                                <input
                                                                    id="social-youtube"
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="youtube.com/@username"
                                                                    value={activePageData?.socialLinks?.youtube || ""}
                                                                    onChange={(e) => {
                                                                        handleLocalUpdate({
                                                                            socialLinks: {
                                                                                ...activePageData.socialLinks,
                                                                                youtube: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* TikTok */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2" htmlFor="social-tiktok">
                                                                <RiTiktokLine className="text-lg opacity-60" />
                                                                <input
                                                                    id="social-tiktok"
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="tiktok.com/@username"
                                                                    value={activePageData?.socialLinks?.tiktok || ""}
                                                                    onChange={(e) => {
                                                                        handleLocalUpdate({
                                                                            socialLinks: {
                                                                                ...activePageData.socialLinks,
                                                                                tiktok: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div key={page?._id} className="card relative overflow-hidden bg-slate-900 text-white shadow-xl shadow-slate-900/20 border border-slate-700/50 lg:col-span-2 group">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                                    <div className="card-body p-6 relative z-10 space-y-6">
                                        <div className="badge badge-info badge-sm uppercase font-medium">
                                            Optimizing: {page?.title}
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary blur-lg opacity-50 animate-pulse"></div>
                                                    <div className="relative p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
                                                        <RiSparklingLine className="text-3xl" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h2 className="text-lg font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                                            AI Optimization Engine
                                                        </h2>
                                                    </div>
                                                    <p className="text-sm font-medium text-white/50 mt-1 max-w-sm">
                                                        Supercharge your discoverability with GPT-4 powered metadata.
                                                    </p>
                                                </div>
                                            </div>

                                            {user?.plan !== 'FREE' ? (
                                                <button
                                                    onClick={handleSeoAiMagic}
                                                    disabled={isSeoAiLoading}
                                                    className={`btn btn-sm md:btn-md border-0 shadow-2xl relative overflow-hidden group/btn ${isSeoAiLoading ? 'bg-white/10 text-white cursor-wait' : 'bg-white text-slate-900 hover:scale-105 active:scale-95'}`}
                                                >
                                                    {isSeoAiLoading && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer"></div>
                                                    )}
                                                    <span className="relative z-10 font-bold flex items-center gap-2">
                                                        {isSeoAiLoading ? (
                                                            <>
                                                                <span className="loading loading-spinner loading-md"></span>
                                                                Optimizing...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <RiMagicLine className="text-2xl text-primary transition 
 group-hover:scale-110 
 group-hover:text-secondary" />
                                                                Run AI Magic
                                                            </>
                                                        )}
                                                    </span>
                                                </button>
                                            ) : (
                                                <button className="btn btn-sm md:btn-md bg-white/5 border border-white/10 text-white/40 cursor-not-allowed uppercase tracking-widest text-[10px] font-medium">
                                                    <RiLockLine className="text-lg" />
                                                    Pro Feature
                                                </button>
                                            )}
                                        </div>

                                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-4 border border-white/5 backdrop-blur-sm relative ${user?.plan === 'FREE' ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
                                            <div className="space-y-6">
                                                <div className="form-control">
                                                    <label className="label pl-1">
                                                        <span className="label-text text-white/60">Meta Title</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. John Doe | Creative Director & Bio"
                                                        className={`input bg-slate-900/50 border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:bg-slate-900/80 transition-all font-medium text-sm h-10 ${user?.plan === 'FREE' ? 'pointer-events-none' : ''}`}
                                                        value={activePageData?.seo?.title || ""}
                                                        onChange={(e) => {
                                                            if (user?.plan === 'FREE') return;
                                                            handleLocalUpdate({ seo: { ...activePageData.seo, title: e.target.value } });
                                                        }}
                                                        readOnly={user?.plan === 'FREE'}
                                                    />
                                                </div>

                                                <div className="form-control">
                                                    <label className="label pl-1">
                                                        <span className="label-text text-white/60">Keywords</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="design, photography, links, bio"
                                                        className={`input bg-slate-900/50 border-white/10 text-white placeholder-white/20  focus:border-primary/50 focus:bg-slate-900/80 transition-all font-medium text-sm h-10 ${user?.plan === 'FREE' ? 'pointer-events-none' : ''}`}
                                                        value={activePageData?.seo?.keywords || ""}
                                                        onChange={(e) => {
                                                            if (user?.plan === 'FREE') return;
                                                            handleLocalUpdate({ seo: { ...activePageData.seo, keywords: e.target.value } });
                                                        }}
                                                        readOnly={user?.plan === 'FREE'}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-control h-full relative group/seo">
                                                <label className="label pl-1">
                                                    <span className="label-text text-white/60">Meta Description</span>
                                                </label>
                                                <textarea className="textarea h-24 bg-slate-900/50 border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:bg-slate-900/80 transition-all font-medium text-sm"
                                                    value={activePageData?.seo?.description || ""}
                                                    onChange={(e) => {
                                                        if (user?.plan === 'FREE') return;
                                                        handleLocalUpdate({ seo: { ...activePageData.seo, description: e.target.value } });
                                                    }}
                                                    readOnly={user?.plan === 'FREE'}
                                                />

                                                {user?.plan === 'FREE' && (
                                                    <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-1 pointer-events-none">
                                                        <div className="p-1 bg-base-100 shadow-sm text-primary">
                                                            <RiLockLine className="text-xs" />
                                                        </div>
                                                        <span className="text-[8px] font-medium text-primary uppercase bg-base-100 px-1">
                                                            PRO Plan
                                                        </span>
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-2 text-xs font-bold text-white/30 uppercase tracking-wider">
                                                {page?.seo?.title && page?.seo?.description ? (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_theme(colors.green.400)]"></div>
                                                        SEO Optimized
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                                        Waiting for data...
                                                    </>
                                                )}
                                            </div>

                                            <div className="text-[10px] font-mono text-white/20">
                                                LinkPeak AI v2.0
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DangerZone />
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-[400px] mt-20 lg:mt-0">
                    <div className="lg:sticky top-8 transform-gpu scale-[0.8] sm:scale-95 lg:scale-90 lg:translate-x-4 origin-top flex justify-center lg:block">
                        <PreviewPhone
                            key={`${selectedPageId}-${links.map(l => l._id + l.isActive).join('|')}-${unsavedChanges}`}
                            pageData={activePageData}
                            links={links}
                            lifetime={lifetimeStats}
                        />
                    </div>
                </div>
            </div>

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
