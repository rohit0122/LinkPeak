"use client";

import ThemeSelector from "./ThemeSelector";
import TemplateSelector from "./TemplateSelector";
import BrandingEditor from "./BrandingEditor";
import {
  RiPaletteLine,
  RiLayoutMasonryLine,
  RiShieldStarLine,
} from "react-icons/ri";
// useAuthStore import removed

export default function ThemeTab({
  currentBioPage,
  tempBioPageConfig,
  currentUser,
  setTempPageData,
}) {
  const mergedBioPage = {
    ...currentBioPage,
    ...tempBioPageConfig,
  };
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="alert bg-primary/5 border-primary/20 p-6">
        <div className="flex gap-4">
          <div className="p-2 bg-primary/10 text-primary h-fit">
            <RiPaletteLine className="text-xl" />
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1 uppercase tracking-wider">
              Style Preview
            </h4>
            <p className="text-xs opacity-60 leading-relaxed font-medium">
              All changes are saved automatically reflected in the live preview
              on the right. Try different combinations to find your perfect
              look. Don&apos;t forgot to save your changes!
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
          currentTemplate={mergedBioPage?.template}
          plan={currentUser?.plan}
          onSelect={(t) => setTempPageData({ template: t })}
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
            currentTheme={mergedBioPage?.theme}
            plan={currentUser?.plan}
            onSelect={(theme) => setTempPageData({ theme })}
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
        <BrandingEditor />
      </section>
    </div>
  );
}
