"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
    RiMenuLine,
    RiCloseLine,
    RiUserLine,
    RiLogoutBoxRLine,
    RiLinksLine,
    RiExternalLinkLine,
} from "react-icons/ri";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CONFIG } from "@/constants/config";
import axios from "@/lib/axios";

import {
    RiSparklingLine,      // Features
    RiPlayCircleLine,     // Demo
    RiPriceTag3Line,      // Pricing
    RiQuestionLine,       // FAQ
} from "react-icons/ri";
import Logo from "./Logo";

// Fetch current user session
async function getCurrentUser() {
    try {
        const res = await axios.get("/auth/me");
        return res.data?.data || null;
    } catch (error) {
        // User not logged in (401) is expected on public pages
        if (error.response?.status === 401) {
            return null;
        }
        console.error("Failed to fetch user:", error);
        return null;
    }
}

// Public links
const publicLinks = [
    { name: "Features", href: "/#features", icon: <RiSparklingLine size={24} />, color: "text-primary" },
    { name: "Demo", href: "/#demo", icon: <RiPlayCircleLine size={24} />, color: "text-info" },
    { name: "Pricing", href: "/#pricing", icon: <RiPriceTag3Line size={24} />, color: "text-warning" },
    { name: "FAQ", href: "/#faq", icon: <RiQuestionLine size={24} />, color: "text-success" },
];

export default function NavbarClient({ user: propUser, page: propPage }) {
    const router = useRouter();
    const [user, setUser] = useState(propUser || null);
    const [page, setPage] = useState(propPage || null);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Only set loading to true if props are UNDEFINED (not passed).
    // If null/object is passed, we know the state immediately.
    const [loading, setLoading] = useState(propUser === undefined);

    // Sync state with props when they change (e.g. navigation)
    useEffect(() => {
        if (propUser !== undefined) setUser(propUser);
        if (propPage !== undefined) setPage(propPage);
    }, [propUser, propPage]);

    // Fetch user session only if props are NOT provided (undefined)
    useEffect(() => {
        if (propUser !== undefined) return;

        async function fetchUser() {
            setLoading(true);
            const response = await getCurrentUser();

            if (response) {
                setUser(response);

                // Fetch user's biopage if page prop is also missing
                if (propPage === undefined) {
                    try {
                        const bioPageRes = await axios.get("/pages");
                        if (bioPageRes.data?.data?.length > 0) {
                            const firstPage = bioPageRes.data.data[0];
                            setPage({
                                profileImage: firstPage.profileImage || null,
                                slug: firstPage.slug || null,
                            });
                        }
                    } catch (error) {
                        console.error("Failed to fetch biopage:", error);
                        setPage({ profileImage: null, slug: null });
                    }
                }
            }
            setLoading(false);
        }
        fetchUser();
    }, [propUser, propPage]);

    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout");
            setUser(null);
            setPage(null);
            router.push("/login");
            toast.success("Logged out");
        } catch {
            toast.error("Logout failed");
        }
    };

    const isLoggedIn = Boolean(user);

    //if (loading) return null; // Optionally add a spinner here
    //console.log('page ====== ', page)
    return (
        <nav className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b">

            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Logo />


                <div className="flex items-center gap-3">

                    {/* View Bio Button (Non-Admin) */}
                    {isLoggedIn && user?.role !== 'admin' && <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => {
                                if (page?.slug) {
                                    window.open(`/${page.slug}`, '_blank');
                                } else {
                                    toast.error("Please set a slug in Settings first!", {
                                        icon: "🔗",
                                        style: {
                                            background: '#1e293b',
                                            color: '#fff',
                                            padding: '16px 24px',
                                        }
                                    });
                                }
                            }}
                            className="group flex items-center gap-3 px-5 py-2.5 bg-info/5 hover:bg-info text-info-content hover:text-info-content transition-all duration-300 border border-info/20 hover:border-info shadow-sm hover:shadow-info/20"
                        >
                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-[9px] uppercase font-bold group-hover:opacity-100 transition-opacity">Public Profile</span>
                                <span className="text-xs tracking-tight font-medium">
                                    {page?.slug ? `/${page.slug}` : "not-set"}
                                </span>
                            </div>
                            <div className="p-1.5 bg-info/10 group-hover:bg-white/20 transition-colors">
                                <RiExternalLinkLine className="text-lg" />
                            </div>
                        </button>
                    </div>}
                    {/* Logged-in → profile dropdown */}
                    {isLoggedIn && <ProfileDropdown user={user} page={page} onLogout={handleLogout} />}

                    {/* Logged-out → links + mobile hamburger */}
                    {!isLoggedIn && (
                        <>
                            {/* Desktop */}
                            <div className="hidden md:flex items-center gap-6">
                                {publicLinks.map((l) => (
                                    <Link key={l.name} href={l.href} className="font-medium">
                                        {l.name}
                                    </Link>
                                ))}
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="btn btn-neutral btn-sm btn-outline font-medium">
                                        Login
                                    </Link>
                                    <Link href="/register" className="btn btn-primary btn-sm font-medium">
                                        Get Started
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile hamburger */}
                            <button
                                className="md:hidden btn btn-ghost btn-square"
                                onClick={() => setMobileOpen(!mobileOpen)}
                            >
                                {mobileOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile menu for guests */}
            {!isLoggedIn && mobileOpen && (
                <div className="md:hidden bg-base-100 border-t p-4 space-y-3 animate-slideDown">
                    {publicLinks.map((l) => (
                        <div className="flex items-center gap-2">
                            <span
                                className={`text-lg ${l.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                            >
                                {l.icon}
                            </span>
                            <Link
                                key={l.name}
                                href={l.href}
                                className="block font-medium"
                                onClick={() => setMobileOpen(false)}
                            >
                                {l.name}
                            </Link>
                        </div>
                    ))}
                    <Link href="/login" className="btn btn-neutral btn-outline font-medium w-full">
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="btn btn-primary btn-outline font-medium w-full"
                        onClick={() => setMobileOpen(false)}
                    >
                        Get Started
                    </Link>
                </div>
            )
            }
        </nav >
    );
}


/*
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  RiLinksLine,
  RiExternalLinkLine,
  RiLogoutBoxRLine,
  RiUserLine,
} from "react-icons/ri";

const publicLinks = [
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
];*/

function ProfileDropdown({ user, page, onLogout }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="transition-transform hover:scale-105 focus:outline-none p-0 bg-transparent border-0 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div className="w-8 h-8 min-w-[25px] min-h-[25px] rounded-full ring-2 ring-primary overflow-hidden shadow-sm">
                    {page?.profileImage ? (
                        <img
                            src={page.profileImage}
                            alt={user?.name || "Avatar"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-base-200">
                            <RiUserLine className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                </div>
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-72 bg-base-100 border border-gray-200 rounded-xl shadow-lg animate-fadeIn z-50 overflow-hidden">
                    {/* User Info Card */}
                    <div className="flex items-center gap-3 p-4 bg-primary/5 border-b border-gray-200">
                        <div className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full overflow-hidden shadow-inner flex-shrink-0">
                            {page?.profileImage ? (
                                <img
                                    src={page.profileImage}
                                    alt={user?.name || "Avatar"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-base-200">
                                    <RiUserLine className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            {/* Plan badge */}
                            <span className="mt-1 inline-block px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                                {user?.plan || 'FREE'}
                            </span>
                        </div>
                    </div>

                    {/* Dropdown Links */}
                    <ul className="flex flex-col py-2">
                        <li className="flex items-center gap-2">

                            <span
                                className={`ml-4 text-lg text-primary opacity-70 group-hover:opacity-100 transition-opacity`}
                            >
                                <RiLinksLine size={20} />
                            </span>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 hover:bg-primary/10 transition-colors"
                            >  Dashboard
                            </Link>
                        </li>

                        {user?.role !== 'admin' && (
                            <li className="flex items-center gap-2 md:hidden">
                                <span
                                    className={`ml-4 text-lg text-secondary opacity-70 group-hover:opacity-100 transition-opacity`}
                                >
                                    <RiExternalLinkLine size={20} />
                                </span>
                                <button
                                    onClick={() =>
                                        page?.slug
                                            ? window.open(`/${page.slug}`, "_blank")
                                            : toast.error("Slug not set")
                                    }
                                    className="px-4 py-2 hover:bg-primary/10 transition-colors"
                                >Public Profile ({`/${page?.slug ? page.slug : "Not Set"}`})</button>

                            </li>
                        )}
                        {/* Public links */}
                        {publicLinks.map((l) => (
                            <li key={l.name} className="flex items-center gap-2">
                                <span
                                    className={`ml-4 text-lg ${l.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                                >
                                    {l.icon}
                                </span>
                                <Link
                                    href={l.href}
                                    className="px-4 py-2 hover:bg-primary/10 transition-colors"
                                >
                                    {l.name}
                                </Link>
                            </li>
                        ))}

                        <li className="mt-2 border-t border-gray-200">
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 text-error"
                            >
                                <span
                                    className={`m-4 text-lg opacity-70 transition-opacity`}
                                >
                                    <RiLogoutBoxRLine size={20} />
                                </span> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
