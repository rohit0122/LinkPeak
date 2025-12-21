"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    HiLink,
    HiChevronRight,
    HiArrowRightOnRectangle,
    HiUserCircle
} from "react-icons/hi2";
import { Toaster } from 'sonner';
import { sidebarLinks } from "@/lib/global";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const { user, logout, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200/50 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

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
                    <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-2xl group relative">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center overflow-hidden">
                                {user?.imageUrl ? <img src={user.imageUrl} alt={user.name} /> : <HiUserCircle className="text-2xl opacity-40" />}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black truncate max-w-[100px]">{user?.name || 'User'}</span>
                                <span className="text-[10px] opacity-40 uppercase font-black tracking-widest">{user?.role?.replace('_USER', '') || 'FREE'}</span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="btn btn-ghost btn-circle btn-sm hover:text-error transition-colors"
                            title="Sign Out"
                        >
                            <HiArrowRightOnRectangle className="text-lg" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen relative">
                <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
