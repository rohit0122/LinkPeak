"use client";

import ProfileUpload from "./ProfileUpload";
import BrandingEditor from "./BrandingEditor";
import DangerZone from "./DangerZone";
import { toast } from "react-hot-toast";
import {
    RiUserLine,
    RiLinksLine,
    RiInstagramLine,
    RiTwitterLine,
    RiFacebookLine,
    RiLinkedinLine,
    RiGithubLine,
    RiYoutubeLine,
    RiTiktokLine,
    RiSparklingLine,
    RiMagicLine,
    RiLockLine
} from "react-icons/ri";

export default function SettingsTab({
    page,
    currentUser,
    setPage,
    setUnsavedChanges,
    onUpdate,
    onPreviewUpdate,
    onSeoAiMagic,
    isSeoAiLoading,
    CONFIG
}) {
    return (
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
                                    userId={currentUser?._id}
                                    onUploadSuccess={(url, hash) => {
                                        onUpdate({
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
                                        className="input input-bordered w-full"
                                        placeholder="e.g. your name or brand"
                                        value={page?.title || ""}
                                        onChange={(e) => {
                                            setPage({ ...page, title: e.target.value });
                                            setUnsavedChanges(true);
                                        }}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Custom URL <span className="text-error">*</span></span>
                                    </label>
                                    <label className="input w-full">
                                        {CONFIG.SITE_URL}/
                                        <input
                                            type="text"
                                            className="grow"
                                            placeholder="your-slug"
                                            value={page?.slug || ""}
                                            onChange={(e) => {
                                                setPage({ ...page, slug: e.target.value.toLowerCase().replace(/\\s+/g, '-') });
                                                setUnsavedChanges(true);
                                            }}
                                            required
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Bio / Description</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-24 resize-none w-full"
                            placeholder="Tell the world who you are..."
                            value={page?.bio || ""}
                            onChange={(e) => {
                                setPage({ ...page, bio: e.target.value });
                                setUnsavedChanges(true);
                            }}
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
                        <p className="text-xs opacity-50 mb-4">Add your social profiles. They&apos;ll appear at the bottom of your bio page.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                        {currentUser?.plan !== 'FREE' ? (
                            <button
                                onClick={onSeoAiMagic}
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
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-4 border border-white/5 backdrop-blur-sm relative ${currentUser?.plan === 'FREE' ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
                        <div className="space-y-6">
                            <div className="form-control">
                                <label className="label pl-1">
                                    <span className="label-text text-white/60">Meta Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe | Creative Director & Bio"
                                    className={`input bg-slate-900/50 border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:bg-slate-900/80 transition-all font-medium text-sm h-10 ${currentUser?.plan === 'FREE' ? 'pointer-events-none' : ''} w-full`}
                                    value={page?.seo?.title || ""}
                                    onChange={(e) => {
                                        if (currentUser?.plan === 'FREE') return;
                                        setPage({ ...page, seo: { ...page.seo, title: e.target.value } });
                                        setUnsavedChanges(true);
                                    }}
                                    readOnly={currentUser?.plan === 'FREE'}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label pl-1">
                                    <span className="label-text text-white/60">Keywords</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="design, photography, links, bio"
                                    className={`input bg-slate-900/50 border-white/10 text-white placeholder-white/20  focus:border-primary/50 focus:bg-slate-900/80 transition-all font-medium text-sm h-10 ${currentUser?.plan === 'FREE' ? 'pointer-events-none' : ''} w-full`}
                                    value={page?.seo?.keywords || ""}
                                    onChange={(e) => {
                                        if (currentUser?.plan === 'FREE') return;
                                        setPage({ ...page, seo: { ...page.seo, keywords: e.target.value } });
                                        setUnsavedChanges(true);
                                    }}
                                    readOnly={currentUser?.plan === 'FREE'}
                                />
                            </div>
                        </div>

                        <div className="form-control h-full relative group/seo">
                            <label className="label pl-1">
                                <span className="label-text text-white/60">Meta Description</span>
                            </label>
                            <textarea className="textarea h-24 bg-slate-900/50 border-white/10 text-white placeholder-white/20 focus:border-primary/50 focus:bg-slate-900/80 transition-all font-medium text-sm w-full"
                                value={page?.seo?.description || ""}
                                onChange={(e) => {
                                    if (currentUser?.plan === 'FREE') return;
                                    setPage({ ...page, seo: { ...page.seo, description: e.target.value } });
                                    setUnsavedChanges(true);
                                }}
                                readOnly={currentUser?.plan === 'FREE'}
                            />

                            {/* SEO Lock Badge (Theme Selector Style) */}
                            {currentUser?.plan === 'FREE' && (
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

            <div className="space-y-6">
                <BrandingEditor
                    key={page?._id}
                    page={page}
                    currentUser={currentUser}
                    onUpdate={onUpdate}
                    onPreviewUpdate={onPreviewUpdate}
                />
            </div>

            <DangerZone />
        </div>
    );
}
