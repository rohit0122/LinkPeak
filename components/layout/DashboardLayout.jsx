"use client";

import Link from "next/link";
import { CONFIG } from "@/constants/config";
import UnifiedNavbar from "./UnifiedNavbar";
import NavbarClient from "./NavbarClient";

export default function DashboardLayout({ children, user, page, pages = [], onSelectPage, onCreatePage }) {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            {/* Unified Navbar */}
            <NavbarClient />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="py-8 text-center opacity-20 hover:opacity-100 transition-opacity">
                <p className="text-xs font-bold tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} {CONFIG.SITE_NAME}
                </p>
            </footer>
        </div>
    );
}

