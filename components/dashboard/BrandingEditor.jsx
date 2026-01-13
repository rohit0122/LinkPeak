"use client";

import { CONFIG } from "@/constants/config";
import { useState, useEffect } from "react";

import { RiShieldStarLine, RiGlobeLine, RiText, RiLinkM } from "react-icons/ri";
import { useAuthStore } from "@/stores/useAuthStore";
import UpgradeBadge from "./UpgradeBadge";

export default function BrandingEditor() {
  const {
    currentUser,
    currentBioPage,
    tempBioPageConfig,
    updateTempBioPageConfigSession,
  } = useAuthStore();

  const mergedBioPage = {
    ...currentBioPage,
    ...tempBioPageConfig,
  };

  const isAgency = currentUser?.plan === "AGENCY";
  const isPro = currentUser?.plan === "PRO" || isAgency;

  const [localBranding, setLocalBranding] = useState(
    mergedBioPage?.branding || {
      removeWatermark: false,
      customText: "",
      customUrl: "",
    }
  );

  // Sync with store when branding data changes (e.g. on page switch or save)
  useEffect(() => {
    if (mergedBioPage?.branding) {
      setLocalBranding(mergedBioPage.branding);
    }
  }, [mergedBioPage?.branding]);

  const handleChange = (field, value) => {
    const newBranding = { ...localBranding, [field]: value };
    setLocalBranding(newBranding);
    updateTempBioPageConfigSession({ branding: newBranding });
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
                onChange={(e) =>
                  handleChange("removeWatermark", e.target.checked)
                }
              />
              <div>
                <span className="label-text font-bold text-sm md:text-lg">
                  Remove &quot;Powered by {CONFIG.SITE_NAME}&quot;
                </span>
                {!isPro && <UpgradeBadge type="PRO" inline={true} />}
              </div>
            </label>
          </div>

          {/* Agency Custom Branding */}
          <div
            className={`p-4 bg-base-200/50  border ${isAgency ? "border-base-300" : "border-base-200 opacity-60"
              }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-medium text-sm md:text-lg">Agency Footer</h3>
              {!isAgency && <UpgradeBadge type="AGENCY" inline={true} />}
            </div>

            <div className="grid gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Footer Text</span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    disabled={!isAgency}
                    placeholder="e.g. Crafted by Creative Agency"
                    className="input input-bordered w-full disabled:cursor-not-allowed"
                    value={localBranding.customText || ""}
                    onChange={(e) => handleChange("customText", e.target.value)}
                  />
                  {!isAgency && <UpgradeBadge type="AGENCY" />}
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Footer Link URL</span>
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    disabled={!isAgency}
                    placeholder="https://myagency.com"
                    className="input input-bordered w-full disabled:cursor-not-allowed"
                    value={localBranding.customUrl || ""}
                    onChange={(e) => handleChange("customUrl", e.target.value)}
                  />
                  {!isAgency && <UpgradeBadge type="AGENCY" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
