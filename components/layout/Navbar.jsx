"use client";

import Link from "next/link";
import { RiMenuLine, RiCloseLine, RiArrowRightLine, RiDashboardLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CONFIG } from "@/constants/config";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // Scroll handling
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auth check
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/me", { cache: "no-store" });
                const data = await res.json();
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const navLinks = [
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/#pricing" },
        { name: "FAQ", href: "/#faq" },
    ];

    return (
        <>
            {/* NAVBAR */}
            <nav
                className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300
          ${isScrolled || mobileMenuOpen
                        ? "bg-base-100/80 backdrop-blur-md border-b border-base-200"
                        : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary text-primary-content rounded-lg flex items-center justify-center font-black text-sm">
                            LP
                        </div>
                        <span className="text-lg font-extrabold tracking-tight">
                            {CONFIG.SITE_NAME}
                            <span className="text-primary">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold text-base-content/60 hover:text-base-content transition"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {!loading && user ? (
                            <Link
                                href="/dashboard"
                                className="btn btn-primary btn-sm rounded-lg px-5 font-bold"
                            >
                                Dashboard
                                <RiDashboardLine className="text-lg" />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold text-base-content/60 hover:text-base-content transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn btn-primary btn-sm rounded-lg px-5 font-bold"
                                >
                                    Get Started
                                    <RiArrowRightLine className="text-lg" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden btn btn-ghost btn-square text-xl"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
                    </button>
                </div>
            </nav>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="fixed top-16 inset-x-0 z-40 bg-base-100 border-b border-base-200 shadow-xl md:hidden">
                    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-base font-semibold text-base-content/80 hover:text-base-content"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-4 border-t border-base-200 flex flex-col gap-3">
                            {!loading && user ? (
                                <Link
                                    href="/dashboard"
                                    className="btn btn-primary font-bold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="btn btn-ghost justify-start font-semibold"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="btn btn-primary font-bold"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* PAGE OFFSET */}
            <div className="pt-16" />
        </>
    );
}
