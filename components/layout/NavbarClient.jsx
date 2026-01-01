"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
    RiMenuLine,
    RiCloseLine,
    RiUserLine,
    RiLogoutBoxRLine,
    RiLinksLine,
    RiExternalLinkLine,
    RiSparklingLine,
    RiPlayCircleLine,
    RiPriceTag3Line,
    RiQuestionLine,
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";

const publicLinks = [
    { name: "Features", href: "/#features", icon: <RiSparklingLine size={24} />, color: "text-primary" },
    { name: "Demo", href: "/#demo", icon: <RiPlayCircleLine size={24} />, color: "text-info" },
    { name: "Pricing", href: "/#pricing", icon: <RiPriceTag3Line size={24} />, color: "text-warning" },
    { name: "FAQ", href: "/#faq", icon: <RiQuestionLine size={24} />, color: "text-success" },
];

export default function NavbarClient({ page: propPage }) {
    const { currentUser, logout, loading } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    const isLoggedIn = Boolean(currentUser);
    //console.log(' isLoggedIn ', isLoggedIn);
    return (
        <nav className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Logo />

                <div className="flex items-center gap-3">
                    {/* View Bio Button (Non-Admin) */}
                    {isLoggedIn && currentUser?.role !== 'admin' && (
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={() => {
                                    if (propPage?.slug) {
                                        window.open(`/${propPage.slug}`, '_blank');
                                    } else {
                                        toast.error("Please set a slug in Settings first!", {
                                            icon: "🔗",
                                        });
                                    }
                                }}
                                className="group flex items-center gap-3 px-5 py-2.5 bg-info/5 hover:bg-info text-info-content hover:text-info-content transition-all duration-300 border border-info/20 hover:border-info shadow-sm hover:shadow-info/20"
                            >
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="text-[9px] uppercase font-bold">Public Profile</span>
                                    <span className="text-xs tracking-tight font-medium">
                                        {propPage?.slug ? `/${propPage.slug}` : "not-set"}
                                    </span>
                                </div>
                                <div className="p-1.5 bg-info/10 group-hover:bg-white/20 transition-colors">
                                    <RiExternalLinkLine className="text-lg" />
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Profile Dropdown */}
                    {isLoggedIn && <ProfileDropdown currentUser={currentUser} page={propPage} onLogout={handleLogout} />}

                    {/* Guest Navigation */}
                    {!isLoggedIn && !loading && (
                        <>
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

            {/* Mobile Menu */}
            {!isLoggedIn && mobileOpen && (
                <div className="md:hidden bg-base-100 border-t p-4 space-y-3 animate-slideDown">
                    {publicLinks.map((l) => (
                        <div key={l.name} className="flex items-center gap-2">
                            <span className={`text-lg ${l.color}`}>{l.icon}</span>
                            <Link href={l.href} className="block font-medium" onClick={() => setMobileOpen(false)}>
                                {l.name}
                            </Link>
                        </div>
                    ))}
                    <Link href="/login" className="btn btn-neutral btn-outline font-medium w-full">
                        Login
                    </Link>
                    <Link href="/register" className="btn btn-primary btn-outline font-medium w-full">
                        Get Started
                    </Link>
                </div>
            )}
        </nav>
    );
}

function ProfileDropdown({ currentUser, page, onLogout }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const closeDropdown = () => setOpen(false);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="transition-transform hover:scale-105 focus:outline-none"
                onClick={() => setOpen(!open)}
            >
                <div className="w-8 h-8 rounded-full ring-2 ring-primary overflow-hidden shadow-sm">
                    {page?.profileImage ? (
                        <img src={page.profileImage} alt={currentUser?.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-base-200">
                            <RiUserLine className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                </div>
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-72 bg-base-100 border rounded-xl shadow-lg z-50">
                    <div className="flex items-center gap-3 p-4 bg-primary/5 border-b">
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary">
                            {page?.profileImage ? (
                                <img src={page.profileImage} alt={currentUser?.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-base-200">
                                    <RiUserLine className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{currentUser?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                            <span className="mt-1 inline-block px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                                {currentUser?.plan || 'FREE'}
                            </span>
                        </div>
                    </div>

                    <ul className="py-2">
                        <li>
                            <Link
                                href={currentUser?.role === 'admin' ? "/admin" : "/dashboard"}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10"
                                onClick={closeDropdown}
                            >
                                <RiLinksLine size={20} className="text-primary" />
                                Dashboard
                            </Link>
                        </li>

                        {currentUser?.role !== 'admin' && (
                            <li className="md:hidden">
                                <button
                                    onClick={() => {
                                        if (page?.slug) {
                                            window.open(`/${page.slug}`, "_blank");
                                        } else {
                                            toast.error("Slug not set");
                                        }
                                        closeDropdown();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10 w-full text-left"
                                >
                                    <RiExternalLinkLine size={20} className="text-secondary" />
                                    <div>
                                        Public Profile <span className="text-sm">({page?.slug ? `/${page.slug}` : "not-set"})</span>
                                    </div>
                                </button>
                            </li>
                        )}

                        {publicLinks.map((l) => (
                            <li key={l.name}>
                                <Link
                                    href={l.href}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-primary/10"
                                    onClick={closeDropdown}
                                >
                                    <span className={l.color}>{l.icon}</span>
                                    {l.name}
                                </Link>
                            </li>
                        ))}

                        <li className="mt-2 border-t">
                            <button
                                onClick={() => {
                                    onLogout();
                                    closeDropdown();
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-error hover:bg-error/10 w-full text-left cursor-pointer"
                            >
                                <RiLogoutBoxRLine size={20} />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
