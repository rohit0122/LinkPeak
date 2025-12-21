"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { HiLink, HiBars3, HiXMark, HiUserCircle, HiArrowRightOnRectangle } from "react-icons/hi2";
import { useState } from "react";

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="border-b border-base-200 bg-base-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-6 transition-transform">
                        <HiLink className="text-2xl" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">LinkPeak</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {!loading && (
                        <>
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Dashboard</Link>
                                    <div className="dropdown dropdown-end">
                                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                            <div className="w-10 rounded-full bg-base-300 flex items-center justify-center overflow-hidden">
                                                {user.imageUrl ? (
                                                    <img src={user.imageUrl} alt={user.name} />
                                                ) : (
                                                    <HiUserCircle className="text-2xl opacity-40" />
                                                )}
                                            </div>
                                        </div>
                                        <ul tabIndex={0} className="mt-3 z-[1] p-4 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-[2rem] border border-base-300 w-52 space-y-2">
                                            <div className="px-4 py-2 border-b border-base-200 mb-2">
                                                <p className="font-black text-xs opacity-40 uppercase tracking-widest">Signed in as</p>
                                                <p className="font-bold truncate">{user.email}</p>
                                            </div>
                                            <li><Link href="/dashboard/settings" className="rounded-xl py-3 px-4 font-bold">Settings</Link></li>
                                            <li>
                                                <button onClick={logout} className="rounded-xl py-3 px-4 font-bold text-error hover:bg-error/10">
                                                    <HiArrowRightOnRectangle className="text-lg" /> Sign Out
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">Log In</Link>
                                    <Link href="/register" className="btn btn-primary rounded-xl px-6 font-bold shadow-lg shadow-primary/20">Sign Up Free</Link>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden btn btn-ghost btn-circle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-base-200 bg-base-100 p-4 space-y-4 animate-in slide-in-from-top duration-300">
                    {!loading && (
                        <>
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 p-4 bg-base-200 rounded-2xl mb-4">
                                        <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center overflow-hidden text-2xl">
                                            {user.imageUrl ? <img src={user.imageUrl} alt={user.name} /> : <HiUserCircle className="opacity-40" />}
                                        </div>
                                        <div>
                                            <p className="font-black tracking-tight">{user.name || 'User'}</p>
                                            <p className="text-xs opacity-50 font-bold">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link href="/dashboard" className="btn btn-ghost btn-block justify-start rounded-xl font-bold">Dashboard</Link>
                                    <Link href="/dashboard/settings" className="btn btn-ghost btn-block justify-start rounded-xl font-bold">Settings</Link>
                                    <button onClick={logout} className="btn btn-error btn-outline btn-block rounded-xl font-bold gap-2 mt-4">
                                        <HiArrowRightOnRectangle className="text-lg" /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    <Link href="/login" className="btn btn-ghost rounded-xl font-bold">Log In</Link>
                                    <Link href="/register" className="btn btn-primary rounded-xl font-bold">Sign Up Free</Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
