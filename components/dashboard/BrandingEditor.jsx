"use client";

import { CONFIG } from "@/constants/config";
import { useState, useEffect } from "react";

import { RiShieldStarLine, RiGlobeLine, RiText, RiLinkM } from "react-icons/ri";

export default function BrandingEditor({ page, user, onUpdate, onPreviewUpdate }) {
    const isAgency = user?.plan === "AGENCY";
    const isPro = user?.plan === "PRO" || isAgency;
    const [localBranding, setLocalBranding] = useState(page?.branding || { removeWatermark: false, customText: "", customUrl: "" });
    const [isDirty, setIsDirty] = useState(false);

    // Sync on page change
    useEffect(() => {
        setLocalBranding(page?.branding || { removeWatermark: false, customText: "", customUrl: "" });
        setIsDirty(false);
    }, [page?._id]);

    const handleChange = (field, value) => {
        const newBranding = { ...localBranding, [field]: value };
        setLocalBranding(newBranding);
        // Propagate immediately to parent for Global Save tracking
        onUpdate({ branding: newBranding });
    };

    // handleSave removed


    return (
        <div className="card bg-base-100 shadow-sm border border-base-300 ">
            <div className="card-body">
                <div className="flex justify-between items-center mb-2">
                    {/* Save button removed - Global Save used instead */}
                </div>

                <div className="space-y-4">
                    {/* Toggle Watermark (Pro + Agency) */}
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                            <input
                                type="checkbox"
                                className="toggle toggle-primary toggle-sm md:toggle-md"
                                checked={localBranding.removeWatermark}
                                disabled={!isPro}
                                onChange={(e) => handleChange("removeWatermark", e.target.checked)}
                            />
                            <div>
                                <span className="label-text font-bold text-sm md:text-lg">Remove "Powered by {CONFIG.SITE_NAME}"</span>
                                {!isPro && (
                                    <span className="badge badge-xs badge-neutral ml-2 font-semibold uppercase tracking-wider">
                                        PRO Feature
                                    </span>
                                )}
                            </div>
                        </label>
                    </div>

                    {/* Agency Custom Branding */}
                    <div className={`p-4 bg-base-200/50  border ${isAgency ? 'border-base-300' : 'border-base-200 opacity-60'}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="font-medium text-sm md:text-lg">Agency Footer</h3>
                            {!isAgency && (
                                <span className="badge badge-primary badge-xs md:badge-sm badge-outline font-medium uppercase tracking-widest">
                                    AGENCY ONLY
                                </span>
                            )}
                        </div>

                        <div className="grid gap-4">
                            <div className="form-control w-full">
                                <label className="label" htmlFor="agency-footer-text">
                                    <span className="label-text">Footer Text</span>
                                </label>
                                <input
                                    id="agency-footer-text"
                                    type="text"
                                    disabled={!isAgency}
                                    placeholder="e.g. Crafted by Creative Agency"
                                    className="input input-bordered w-full"
                                    value={localBranding.customText || ""}
                                    onChange={(e) => handleChange("customText", e.target.value)}
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label" htmlFor="agency-footer-url">
                                    <span className="label-text">Footer Link URL</span>
                                </label>
                                <input
                                    id="agency-footer-url"
                                    type="text"
                                    disabled={!isAgency}
                                    placeholder="https://myagency.com"
                                    className="input input-bordered w-full"
                                    value={localBranding.customUrl || ""}
                                    onChange={(e) => handleChange("customUrl", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
