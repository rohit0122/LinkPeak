"use client";

import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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
                    <Link href="/dashboard/links" className="btn btn-ghost font-semibold">Dashboard</Link>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </div>
    );
}
