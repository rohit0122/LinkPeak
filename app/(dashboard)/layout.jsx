"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
    HiHome,
    HiLink,
    HiPresentationChartBar,
    HiCog8Tooth,
    HiChevronRight
} from "react-icons/hi2";
import { Toaster } from 'sonner';

const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: HiHome },
    { name: "Links", href: "/dashboard/links", icon: HiLink },
    { name: "Analytics", href: "/dashboard/analytics", icon: HiPresentationChartBar },
    { name: "Settings", href: "/dashboard/settings", icon: HiCog8Tooth },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-base-200/50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 bg-base-100 border-r border-base-300 hidden lg:flex flex-col z-50">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-6 transition-transform">
                            <HiLink className="text-2xl" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">LinkPeak</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${isActive
                                    ? "bg-primary text-primary-content shadow-xl shadow-primary/20"
                                    : "hover:bg-base-200 text-base-content/60 hover:text-base-content"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <link.icon className={`text-xl ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                                    <span className="font-bold tracking-tight">{link.name}</span>
                                </div>
                                {isActive && <HiChevronRight className="text-lg animate-pulse" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-base-200">
                    <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-2xl">
                        <UserButton afterSignOutUrl="/" />
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Account</span>
                            <span className="text-[11px] font-bold">Manage Profile</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen relative">
                {/* Mobile Header */}
                <header className="lg:hidden sticky top-0 bg-base-100/80 backdrop-blur-md border-b border-base-200 h-16 flex items-center justify-between px-6 z-40">
                    <span className="text-xl font-black tracking-tighter">LinkPeak</span>
                    <div className="flex items-center gap-4">
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
                </header>

                <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
                <Toaster richColors position="bottom-right" />
            </main>
        </div>
    );
}
