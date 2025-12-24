"use client";

import Link from "next/link";
import { CONFIG } from "@/constants/config";
import UnifiedNavbar from "./UnifiedNavbar";
import NavbarClient from "./NavbarClient";
import { RiAddCircleLine, RiArrowDownSLine, RiCheckLine, RiLayoutMasonryLine } from "react-icons/ri";

export default function DashboardLayout({ children, user, page, pages = [], onSelectPage, onCreatePage }) {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            {/* Unified Navbar */}
            <NavbarClient />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
                {/* Page Switcher (Authenticated + Non-FREE only) */}
                {user && user?.plan === 'AGENCY' && (
                    <div className="max-w-2xl ml-14">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-primary btn-soft btn-lg gap-2 font-bold normal-case mb-2">
                                <RiLayoutMasonryLine className="text-primary" />
                                <span className="max-w-[120px] truncate">{page?.slug ? `/${page.slug}` : "Select Page"}</span>
                                <RiArrowDownSLine className="opacity-40" />
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[60] menu p-2 shadow-2xl bg-base-100 w-64 mt-2 border border-base-200">
                                <li className="menu-title px-4 py-2 my-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">My Bio Pages</span>
                                </li>
                                {pages.map((p) => (
                                    <li key={p._id}>
                                        <button
                                            onClick={() => onSelectPage && onSelectPage(p._id)}
                                            className={`flex items-center justify-between py-3 px-4 ${page?._id === p._id ? 'bg-primary/10 text-primary font-bold my-1' : ''}`}
                                        >
                                            <span className="truncate">/{p.slug}</span>
                                            {page?._id === p._id && <RiCheckLine />}
                                        </button>
                                    </li>
                                ))}
                                {pages.length < (CONFIG.PLAN_LIMITS[user?.plan] || CONFIG.PLAN_LIMITS.FREE).pages && (
                                    <>
                                        <div className="divider my-1 opacity-10"></div>
                                        <li>
                                            <button
                                                onClick={onCreatePage}
                                                className="flex items-center gap-3 py-3 px-4 text-primary font-bold hover:bg-primary/5"
                                            >
                                                <RiAddCircleLine className="text-lg" />
                                                Add New Page
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                )}
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

