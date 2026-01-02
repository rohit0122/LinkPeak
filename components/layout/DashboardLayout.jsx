"use client";

import Link from "next/link";
import { CONFIG } from "@/constants/config";
import NavbarClient from "./NavbarClient";
import { RiAddCircleLine, RiArrowDownSLine, RiCheckLine, RiLayoutMasonryLine } from "react-icons/ri";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default function DashboardLayout({ children, currentUser, page, pages = [], onSelectPage, onCreatePage }) {
    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-base-200 flex flex-col">
                {/* Unified Navbar */}
                <NavbarClient
                    currentUser={currentUser}
                    page={page}
                    pages={pages}
                    onSelectPage={onSelectPage}
                    onCreatePage={onCreatePage}
                />

                {/* Main Content Area */}
                <main className="flex-1 w-full max-w-7xl mx-auto p-4">
                    {children}
                </main>

                {/* Simple Footer */}
                <footer className="py-8 text-center opacity-20 hover:opacity-100 transition-opacity">
                    <p className="text-xs font-bold tracking-widest uppercase">
                        &copy; {new Date().getFullYear()} {CONFIG.SITE_NAME}
                    </p>
                </footer>
            </div>
        </ErrorBoundary>
    );
}
