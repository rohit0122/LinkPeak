"use client";

import { CONFIG } from "@/constants/config";
import NavbarClient from "./NavbarClient";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import TrialExpiryBanner from "@/components/dashboard/Subscription/TrialExpiryBanner";

export default function DashboardLayout({
  children,
  currentUser,
  page,
  pages = [],
  onSelectPage,
  onCreatePage,
}) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-base-200 flex flex-col">
        <TrialExpiryBanner />
        {/* Unified Navbar */}
        <NavbarClient
          currentUser={currentUser}
          currentPage={{ id: page?.id, slug: page?.slug }}
          pages={pages}
          onSelectPage={onSelectPage}
          onCreatePage={onCreatePage}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4">{children}</main>

        {/* Footer */}
        <footer className="mt-auto border-t border-neutral bg-neutral text-neutral-content">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs opacity-70">
                &copy; {new Date().getFullYear()} {CONFIG.SITE_NAME}. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs opacity-60">
                <span className="hidden md:inline">Made with ❤️ for creators</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
