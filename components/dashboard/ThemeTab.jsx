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

      <div className="join join-vertical bg-base-100 w-full border border-base-300">
        {/* Template Selection */}
        <section className="collapse collapse-arrow join-item border-b border-base-300">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-base sm:text-lg md:text-xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 hover:bg-base-200/50 transition-colors cursor-pointer py-3 md:py-4">
            <div className="p-1.5 md:p-2 bg-primary/10 text-primary shrink-0">
              <RiLayoutMasonryLine className="text-lg md:text-xl" />
            </div>
            1. Choose Template
          </div>
          <div className="collapse-content px-4 md:px-6">
            <div className="pt-4 md:pt-6">
              <TemplateSelector
                currentTemplate={mergedBioPage?.template}
                plan={currentUser?.plan}
                onSelect={(t) => setTempPageData({ template: t })}
              />
            </div>
          </div>
        </section>

        {/* Theme Selection */}
        <section className="collapse collapse-arrow join-item border-b border-base-300">
          <input type="checkbox" className="peer" defaultChecked />
          <div className="collapse-title text-base sm:text-lg md:text-xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 hover:bg-base-200/50 transition-colors cursor-pointer py-3 md:py-4">
            <div className="p-1.5 md:p-2 bg-primary/10 text-primary shrink-0">
              <RiPaletteLine className="text-lg md:text-xl" />
            </div>
            2. Choose Identity Theme
          </div>
          <div className="collapse-content px-4 md:px-6">
            <div className="pt-4 md:pt-6">
              <ThemeSelector
                currentTheme={mergedBioPage?.theme}
                plan={currentUser?.plan}
                onSelect={(theme) => setTempPageData({ theme })}
              />
            </div>
          </div>
        </section>

        {/* Branding / White Labeling (Moved from Settings) */}
        <section className="collapse collapse-arrow join-item">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-base sm:text-lg md:text-xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 hover:bg-base-200/50 transition-colors cursor-pointer py-3 md:py-4">
            <div className="p-1.5 md:p-2 bg-primary/10 text-primary shrink-0">
              <RiShieldStarLine className="text-lg md:text-xl" />
            </div>
            3. Branding & White Labeling
          </div>
          <div className="collapse-content px-4 md:px-6">
            <div className="pt-4 md:pt-6">
              <BrandingEditor />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
