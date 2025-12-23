"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    RiMenuLine,
    RiCloseLine,
    RiArrowRightLine,
    RiLayoutMasonryLine,
    RiAddCircleLine,
    RiCheckLine,
    RiArrowDownSLine,
    RiExternalLinkLine,
    RiLogoutBoxRLine,
    RiUserLine,
    RiLinksLine
} from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

export default function UnifiedNavbar({
    isAuthenticated = false,
    user = null,
    page = null,
    pages = [],
    onSelectPage,
    onCreatePage
}) {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/auth/logout");
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const marketingLinks = [
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/#pricing" },
        { name: "FAQ", href: "/#faq" },
    ];

    return (
        <nav
            className={`${isAuthenticated
                ? "sticky top-0 z-50 w-full bg-base-100/80 backdrop-blur-xl border-b border-base-300"
                : `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen
                    ? "bg-base-100/90 backdrop-blur-lg border-b border-base-200 py-4"
                    : "bg-transparent py-6"
                }`
                }`}
        >
            <div className={`max-w-7xl mx-auto ${isAuthenticated ? "navbar px-4 md:px-8 h-20" : "px-6 flex items-center justify-between"}`}>
                {/* Logo */}
                <div className={isAuthenticated ? "flex-1 gap-4 items-center flex" : "flex items-center gap-2"}>
                    <Link href="/" className={isAuthenticated
                        ? "text-2xl font-black tracking-tighter flex items-center gap-1 hover:text-primary transition-colors pr-4 border-r border-base-300"
                        : "flex items-center gap-2 group"
                    }>
                        {!isAuthenticated && (
                            <div className="w-10 h-10 bg-primary text-primary-content flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                                LP
                            </div>
                        )}
                        <span className={isAuthenticated ? "" : "text-xl font-black tracking-tighter"}>
                            {CONFIG.SITE_NAME}
                            <span className="text-primary italic">{isAuthenticated ? "." : "."}</span>
                        </span>
                    </Link>

                    {/* Page Switcher (Authenticated + Non-FREE only) */}
                    {isAuthenticated && user?.plan !== 'FREE' && (
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2 font-black border-base-300 normal-case ml-2">
                                <RiLayoutMasonryLine className="text-primary" />
                                <span className="max-w-[120px] truncate">{page?.slug ? `/${page.slug}` : "Select Page"}</span>
                                <RiArrowDownSLine className="opacity-40" />
                            </div>
                            <ul tabIndex={0} className="dropdown-content z-[60] menu p-2 shadow-2xl bg-base-100 w-64 mt-2 border border-base-200">
                                <li className="menu-title px-4 py-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">My Bio Pages</span>
                                </li>
                                {pages.map((p) => (
                                    <li key={p._id}>
                                        <button
                                            onClick={() => onSelectPage && onSelectPage(p._id)}
                                            className={`flex items-center justify-between py-3 px-4 ${page?._id === p._id ? 'bg-primary/10 text-primary font-bold' : ''}`}
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
                                                className="flex items-center gap-3 py-3 px-4 text-primary font-black hover:bg-primary/5"
                                            >
                                                <RiAddCircleLine className="text-lg" />
                                                Add New Page
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Desktop Navigation */}
                {!isAuthenticated && (
                    <div className="hidden md:flex items-center gap-8">
                        {marketingLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="font-bold opacity-60 hover:opacity-100 hover:text-primary transition-all text-sm uppercase tracking-wider"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Desktop Actions */}
                <div className={`${isAuthenticated ? "flex-none" : "hidden md:flex"} flex items-center gap-3`}>
                    {isAuthenticated ? (
                        <>
                            {/* View Bio Button */}
                            <div className="hidden md:flex items-center gap-2">
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
                                    className="group flex items-center gap-3 px-5 py-2.5 bg-primary/5 hover:bg-primary text-primary hover:text-primary-content transition-all duration-300 border border-primary/20 hover:border-primary shadow-sm hover:shadow-primary/20"
                                >
                                    <div className="flex flex-col items-start leading-tight">
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-black opacity-40 group-hover:opacity-100 transition-opacity">Public Profile</span>
                                        <span className="text-sm font-black tracking-tight">
                                            {page?.slug ? `/${page.slug}` : "not-set"}
                                        </span>
                                    </div>
                                    <div className="p-1.5 bg-primary/10 group-hover:bg-white/20 transition-colors">
                                        <RiExternalLinkLine className="text-lg" />
                                    </div>
                                </button>
                            </div>

                            {/* Profile Dropdown */}
                            <div className="dropdown dropdown-end flex items-center">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-300 flex items-center justify-center">
                                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full ring ring-primary overflow-hidden">
                                        {page?.profileImage ? (
                                            <img src={page.profileImage} alt={user?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <RiUserLine className="text-xl" />
                                        )}
                                    </div>
                                </div>
                                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 w-64 border border-base-200">
                                    <li className="px-4 py-3 border-b border-base-100 mb-2">
                                        <div className="flex flex-col p-0 bg-transparent hover:bg-transparent cursor-default">
                                            <span className="font-black text-lg">{user?.name || "User"}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 font-bold uppercase">
                                                    {user?.plan || "FREE"}
                                                </span>
                                                <span className="text-xs opacity-50">{user?.email}</span>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href="/dashboard" className="py-3 px-4 flex items-center gap-3 active:bg-primary font-bold">
                                            <RiLinksLine className="text-lg" /> Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="py-3 px-4 flex items-center gap-3 text-error active:bg-error active:text-error-content transition-colors font-bold"
                                        >
                                            <RiLogoutBoxRLine className="text-lg" /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="font-bold opacity-60 hover:opacity-100 transition-opacity"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="btn btn-primary px-6 font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Get Started <RiArrowRightLine />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden btn btn-square btn-ghost text-2xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-base-100 border-b border-base-200 p-6 flex flex-col gap-4 md:hidden shadow-2xl animate-in slide-in-from-top-4">
                    {isAuthenticated ? (
                        <>
                            {/* Mobile View Bio */}
                            <button
                                onClick={() => {
                                    if (page?.slug) {
                                        window.open(`/${page.slug}`, '_blank');
                                        setMobileMenuOpen(false);
                                    } else {
                                        toast.error("Please set a slug in Settings first!", { icon: "🔗" });
                                    }
                                }}
                                className="btn btn-ghost w-full justify-start text-lg font-bold"
                            >
                                <RiExternalLinkLine />
                                View Bio
                            </button>
                            <div className="h-px bg-base-300 my-2"></div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="btn btn-ghost w-full justify-start text-lg font-bold text-error"
                            >
                                <RiLogoutBoxRLine />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {marketingLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="font-bold text-lg p-2 hover:bg-base-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-base-300 my-2"></div>
                            <Link
                                href="/login"
                                className="btn btn-ghost w-full justify-start text-lg font-bold"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="btn btn-primary w-full text-lg font-black"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
