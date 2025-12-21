"use client";

import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { sidebarLinks } from "@/lib/global";

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 container mx-auto px-4 py-4 z-50">
            <div className="flex-1">
                <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-lg"><HiSparkles className="text-primary" /></span>
                    LinkPeak
                </Link>
            </div>
            <div className="flex gap-4">
                <SignedOut>
                    <Link href="/pricing" className="btn btn-ghost font-semibold">Pricing</Link>
                    <Link href="/sign-up" className="btn btn-primary shadow-lg shadow-primary/20">Get Started</Link>
                </SignedOut>
                <SignedIn>
                    <Link href="/dashboard" className="btn btn-ghost font-semibold">Dashboard</Link>
                    {/* Mobile Header */}
                    <div className="flex items-center gap-4 md:hidden">
                        <UserButton afterSignOutUrl="/" />
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-200">
                                {sidebarLinks.map((link) => (
                                    <li key={link.href}><Link href={link.href}>{link.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </SignedIn>
            </div>
        </div>
    );
}
