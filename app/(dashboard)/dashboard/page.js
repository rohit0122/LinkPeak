"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LinkEditor from "@/components/dashboard/LinkEditor";
import PreviewPhone from "@/components/shared/PreviewPhone";
import ThemeSelector from "@/components/dashboard/ThemeSelector";
import TemplateSelector from "@/components/dashboard/TemplateSelector";
import BrandingEditor from "@/components/dashboard/BrandingEditor";
import ProfileUpload from "@/components/dashboard/ProfileUpload";
import AnalyticsView from "@/components/dashboard/AnalyticsView";
import QRGenerator from "@/components/dashboard/QRGenerator";
import SupportView from "@/components/dashboard/SupportView";
import SubscriptionStatus from "@/components/dashboard/SubscriptionStatus";
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
import SmartPlanAlert from "@/components/dashboard/SmartPlanAlert";
import UnsavedChangesModal from "@/components/dashboard/UnsavedChangesModal";
import DangerZone from "@/components/dashboard/DangerZone"; // ADDED import
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);

    const [page, setPage] = useState(null);
    const [allPages, setAllPages] = useState([]);
    const [links, setLinks] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("links");
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const siteUser = localStorage.getItem("site_user") ? JSON.parse(localStorage.getItem("site_user")) : null;
        if (siteUser?.role === 'admin') {
            router.push('/admin')
            router.refresh();
            return;
        }
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/dashboard/init");

            if (data.success) {
                const { user, pages, activePage, links: initLinks, analytics: initAnalytics, subscriptionStatus: subStatus } = data.data;

                setUser(user);
                setAllPages(pages);
                setSubscriptionStatus(subStatus);

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
                } else if (user) {
                    // No pages found - Create default
                    // We keep this client-side creation logic for now to ensure robustness
                    const createRes = await axios.post("/pages", {
                        slug: user.name.toLowerCase().replace(/\s+/g, '-') + "-" + Math.floor(Math.random() * 1000),
                        title: `${user.name}'s Bio`,
                        bio: "Welcome to my link-in-bio page!"
                    });
                    if (createRes.data.success) {
                        setPage(createRes.data.data);
                        setLinks([]);
                        setAllPages([createRes.data.data]);
                    }
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
            // Fallback to legacy flow if aggregated fails? 
            // "Backward Compatibility Guarantee ... Existing APIs remain available as fallback"
            // For now, let's trust the new API but log error.
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const fetchPageData = async (pageId) => {
        try {
            const [linksRes, analyticsRes] = await Promise.all([
                axios.get(`/links?pageId=${pageId}`),
                axios.get(`/analytics?pageId=${pageId}`)
            ]);
            if (linksRes.data.success) setLinks(linksRes.data.data);
            if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
        } catch (error) {
            toast.error("Failed to load page data");
        }
    };

    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingPageId, setPendingPageId] = useState(null);

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
        }
        setShowUnsavedModal(false);
        setPendingPageId(null);
    };

    const handleDiscardAndSwitch = () => {
        if (pendingPageId) {
            performPageSwitch(pendingPageId);
        }
    };

    const handleSaveAndSwitch = async () => {
        await handleGlobalSave();
        // After save, handleGlobalSave sets unsavedChanges to false
        // We can then switch
        if (pendingPageId) {
            performPageSwitch(pendingPageId);
        }
    };

    const handleCreatePage = async () => {
        try {
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
                setLinks([]);
                setAnalytics([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Could not create page");
        }
    };

    const handleReorder = async (newLinks) => {
        setLinks(newLinks);
        try {
            const reorderPayload = newLinks.map((l, index) => ({ id: l._id, order: index }));
            await axios.put("/links", { links: reorderPayload });
        } catch (error) {
            toast.error("Could not save link order. Please try again.");
            fetchData();
        }
    };

    const handleAddLink = async (newLinkData) => {
        try {
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
        }
    };

    const handleUpdateLink = async (updatedLink) => {
        try {
            const { id, ...updates } = updatedLink;
            const { data } = await axios.patch("/links", { id: updatedLink._id, ...updates });
            if (data.success) {
                setLinks(links.map(l => l._id === updatedLink._id ? data.data : l));
                toast.success("Link updated successfully!");
            }
        } catch (error) {
            toast.error("Could not update link. Please try again.");
        }
    };

    const handleDeleteLink = async (id) => {
        try {
            const { data } = await axios.delete(`/links?id=${id}`);
            if (data.success) {
                setLinks(links.filter(l => l._id !== id));
                toast.success("Link removed from your bio");
            }
        } catch (error) {
            toast.error("Could not remove link. Please try again.");
        }
    };

    const [dirtySections, setDirtySections] = useState(new Set());

    // Global Save Logic
    const handleGlobalSave = async () => {
        if (!page) return;
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
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Could not save changes. Please try again.");
        }
    };

    // Helper for purely local updates (that trigger unsaved state)
    const handleLocalUpdate = (updates) => {
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
    };

    const [isSeoAiLoading, setIsSeoAiLoading] = useState(false);

    const handleSeoAiMagic = async () => {
        setIsSeoAiLoading(true);
        try {
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
                // Use local update so user can review before saving
                handleLocalUpdate(seoUpdates);
                toast.success("AI generated new SEO data! Review & Click Save.", { icon: "✨" });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "AI Optimization failed. Please try again.");
        } finally {
            setIsSeoAiLoading(false);
        }
    };

    if (loading) {
        return null;
    }
    const trialEndDate = new Date(user.createdAt);
    trialEndDate.setHours(trialEndDate.getHours() + 24);
    const expiryDate = new Date(user.createdAt);
    expiryDate.setDate(expiryDate.getDate() + 8);

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
            />


            {/* Subscription Status - Handles Trial & Renewal Alerts */}
            {user?.plan !== 'FREE' && <SubscriptionStatus user={user} initialData={subscriptionStatus} redirectOnExpire={true} />}

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
                                onClick={() => setActiveTab(key)}
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
                    <div className="grid grid-cols-2 gap-4 mb-8">
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
                                plan={user?.plan}
                                onReorder={handleReorder}
                                onAdd={handleAddLink}
                                onUpdate={handleUpdateLink}
                                onDelete={handleDeleteLink}
                            />
                        )}

                        {activeTab === "analytics" && (
                            <AnalyticsView data={analytics} plan={user?.plan} />
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
                                {/* Template Selection */}
                                <section>

                                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-primary/10 text-primary">
                                            <RiLayoutMasonryLine className="text-xl" />
                                        </div>
                                        1. Choose Template
                                    </h2>
                                    <TemplateSelector
                                        currentTemplate={page?.template}
                                        plan={user?.plan}
                                        onSelect={(t) => handleLocalUpdate({ template: t })}
                                    />
                                </section>

                                {/* Theme Selection */}
                                <section>
                                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-primary/10  text-primary">
                                            <RiPaletteLine className="text-xl" />
                                        </div>
                                        2. Choose Identity Theme
                                    </h2>
                                    <div className="bg-base-100 p-2 border border-base-300 shadow-sm overflow-hidden">
                                        <ThemeSelector
                                            currentTheme={page?.theme}
                                            plan={user?.plan}
                                            onSelect={(theme) => handleLocalUpdate({ theme })}
                                        />
                                    </div>
                                </section>


                                {/* Branding / White Labeling (Moved from Settings) */}
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
                                    // onPreviewUpdate removed as onUpdate now handles it via parent state
                                    />
                                </section>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="flex flex-col gap-8">
                                {/* Identity Section (Profile + Details) */}
                                <div className="card bg-base-100 shadow-sm border border-base-300 lg:col-span-2">
                                    <div className="card-body p-8 lg:p-10">
                                        <div className="flex flex-col md:flex-row gap-10">
                                            {/* Left: Profile Image */}
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

                                            {/* Right: Inputs */}
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
                                                        <label className="label">
                                                            <span className="label-text">Display Title <span className="text-error">*</span></span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="input input-bordered"
                                                            placeholder="e.g. your name or brand"
                                                            value={page?.title || ""}
                                                            onChange={(e) => {
                                                                setPage({ ...page, title: e.target.value });
                                                                setUnsavedChanges(true);
                                                            }}
                                                            // onBlur removed
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text">Custom URL <span className="text-error">*</span></span>
                                                        </label>
                                                        <label className="input">
                                                            {CONFIG.SITE_URL}/
                                                            <input
                                                                type="text"
                                                                className="grow"
                                                                placeholder="your-slug"
                                                                value={page?.slug || ""}
                                                                onChange={(e) => {
                                                                    setPage({ ...page, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') });
                                                                    setUnsavedChanges(true);
                                                                }}
                                                                // onBlur removed
                                                                required
                                                            />
                                                        </label>
                                                        {/*<label className="label">
                                                            <span className="label-text">Custom URL <span className="text-error">*</span></span>
                                                        </label>
                                                         <div className="flex items-center gap-2">
                                                            <span className="text-sm opacity-60">linkpeak.com/</span>
                                                            <input
                                                                type="text"
                                                                className="input input-bordered flex-1"
                                                                placeholder="your-slug"
                                                                value={page?.slug || ""}
                                                                onChange={(e) => {
                                                                    setPage({ ...page, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') });
                                                                    setUnsavedChanges(true);
                                                                }}
                                                                // onBlur removed
                                                                required
                                                            />
                                                        </div>*/}
                                                    </div>
                                                </div>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text">Bio / Description</span>
                                                    </label>
                                                    <textarea
                                                        className="textarea textarea-bordered h-24 resize-none"
                                                        placeholder="Tell the world who you are..."
                                                        value={page?.bio || ""}
                                                        onChange={(e) => {
                                                            setPage({ ...page, bio: e.target.value });
                                                            setUnsavedChanges(true);
                                                        }}
                                                    // onBlur removed
                                                    />
                                                </div>

                                                {/* Social Links Section */}
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
                                                            <label className="input input-bordered flex items-center gap-2">
                                                                <RiInstagramLine className="text-lg opacity-60" />
                                                                <input
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="instagram.com/username"
                                                                    value={page?.socialLinks?.instagram || ""}
                                                                    onChange={(e) => {
                                                                        setPage({
                                                                            ...page,
                                                                            socialLinks: {
                                                                                ...page.socialLinks,
                                                                                instagram: e.target.value
                                                                            }
                                                                        });
                                                                        setUnsavedChanges(true);
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* Twitter */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2">
                                                                <RiTwitterLine className="text-lg opacity-60" />
                                                                <input
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="twitter.com/username"
                                                                    value={page?.socialLinks?.twitter || ""}
                                                                    onChange={(e) => {
                                                                        setPage({
                                                                            ...page,
                                                                            socialLinks: {
                                                                                ...page.socialLinks,
                                                                                twitter: e.target.value
                                                                            }
                                                                        });
                                                                        setUnsavedChanges(true);
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* Facebook */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2">
                                                                <RiFacebookLine className="text-lg opacity-60" />
                                                                <input
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="facebook.com/username"
                                                                    value={page?.socialLinks?.facebook || ""}
                                                                    onChange={(e) => {
                                                                        setPage({
                                                                            ...page,
                                                                            socialLinks: {
                                                                                ...page.socialLinks,
                                                                                facebook: e.target.value
                                                                            }
                                                                        });
                                                                        setUnsavedChanges(true);
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* LinkedIn */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2">
                                                                <RiLinkedinLine className="text-lg opacity-60" />
                                                                <input
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="linkedin.com/in/username"
                                                                    value={page?.socialLinks?.linkedin || ""}
                                                                    onChange={(e) => {
                                                                        setPage({
                                                                            ...page,
                                                                            socialLinks: {
                                                                                ...page.socialLinks,
                                                                                linkedin: e.target.value
                                                                            }
                                                                        });
                                                                        setUnsavedChanges(true);
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* GitHub */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2">
                                                                <RiGithubLine className="text-lg opacity-60" />
                                                                <input
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="github.com/username"
                                                                    value={page?.socialLinks?.github || ""}
                                                                    onChange={(e) => {
                                                                        setPage({
                                                                            ...page,
                                                                            socialLinks: {
                                                                                ...page.socialLinks,
                                                                                github: e.target.value
                                                                            }
                                                                        });
                                                                        setUnsavedChanges(true);
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* YouTube */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2">
                                                                <RiYoutubeLine className="text-lg opacity-60" />
                                                                <input
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="youtube.com/@username"
                                                                    value={page?.socialLinks?.youtube || ""}
                                                                    onChange={(e) => {
                                                                        setPage({
                                                                            ...page,
                                                                            socialLinks: {
                                                                                ...page.socialLinks,
                                                                                youtube: e.target.value
                                                                            }
                                                                        });
                                                                        setUnsavedChanges(true);
                                                                    }}
                                                                />
                                                            </label>
                                                        </div>

                                                        {/* TikTok */}
                                                        <div className="form-control">
                                                            <label className="input input-bordered flex items-center gap-2">
                                                                <RiTiktokLine className="text-lg opacity-60" />
                                                                <input
                                                                    type="text"
                                                                    className="grow"
                                                                    placeholder="tiktok.com/@username"
                                                                    value={page?.socialLinks?.tiktok || ""}
                                                                    onChange={(e) => {
                                                                        setPage({
                                                                            ...page,
                                                                            socialLinks: {
                                                                                ...page.socialLinks,
                                                                                tiktok: e.target.value
                                                                            }
                                                                        });
                                                                        setUnsavedChanges(true);
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

                                {/* Bottom Row: AI SEO Engine (USP Feature) */}
                                <div key={page?._id} className="card relative overflow-hidden bg-slate-900 text-white shadow-xl shadow-slate-900/20 border border-slate-700/50 lg:col-span-2 group">
                                    {/* Ambient Background Glow */}
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                                    <div className="card-body p-6 relative z-10 space-y-6">

                                        {/* Header Section */}
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

                                        {/* Inputs Section */}
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
                                                        value={page?.seo?.title || ""}
                                                        onChange={(e) => {
                                                            if (user?.plan === 'FREE') return;
                                                            setPage({ ...page, seo: { ...page.seo, title: e.target.value } });
                                                            setUnsavedChanges(true);
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
                                                        value={page?.seo?.keywords || ""}
                                                        onChange={(e) => {
                                                            if (user?.plan === 'FREE') return;
                                                            setPage({ ...page, seo: { ...page.seo, keywords: e.target.value } });
                                                            setUnsavedChanges(true);
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
                                                    value={page?.seo?.description || ""}
                                                    onChange={(e) => {
                                                        if (user?.plan === 'FREE') return;
                                                        setPage({ ...page, seo: { ...page.seo, description: e.target.value } });
                                                        setUnsavedChanges(true);
                                                    }}
                                                    readOnly={user?.plan === 'FREE'}
                                                />

                                                {/* SEO Lock Badge (Theme Selector Style) */}
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

                                        {/* Footer / Validation */}
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

                <div className="hidden lg:block lg:w-[400px]">
                    <div className="sticky top-8 transform-gpu scale-90 translate-x-4 origin-top">
                        <PreviewPhone pageData={page} links={links} />
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
