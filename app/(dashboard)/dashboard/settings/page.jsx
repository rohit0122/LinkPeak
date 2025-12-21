"use client";

import {
    HiUser,
    HiBell,
    HiCreditCard,
    HiShieldCheck,
    HiChevronRight,
    HiPhoto,
    HiLockClosed,
    HiSparkles,
    HiArrowTopRightOnSquare
} from "react-icons/hi2";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";

export default function SettingsPage() {
    const { user, loading, checkUser } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200/50 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Profile updated successfully!");
                await checkUser(); // Refresh user data in context
            } else {
                toast.error(data.error || "Update failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (e.g., 2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            return toast.error("File size must be less than 2MB");
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsUpdating(true);
        try {
            const res = await fetch("/api/user/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Profile picture updated!");
                await checkUser();
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setIsUpdating(false);
        }
    };

    const sections = [
        {
            title: "Peak Identity",
            desc: "Manage your public handle and bio appearance",
            icon: HiUser,
            color: "text-primary",
            bg: "bg-primary/10",
            isCustom: true
        },
        {
            title: "Protocol Subscription",
            desc: "Scale your reach with Pro peak performance",
            icon: HiCreditCard,
            color: "text-accent",
            bg: "bg-accent/10",
            badge: user?.role?.replace('_USER', '') || "FREE",
            action: { label: "Upgrade Pulse", href: "/pricing" }
        },
        {
            title: "Security Core",
            desc: "Password and account access settings",
            icon: HiShieldCheck,
            color: "text-success",
            bg: "bg-success/10",
            action: { label: "Change Password", href: "/forgot-password" }
        },
        {
            title: "Peak Pulse Alerts",
            desc: "Engagement notification pulses",
            icon: HiBell,
            color: "text-secondary",
            bg: "bg-secondary/10",
            toggle: true
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter">System Configuration</h1>
                <p className="text-base-content/60 font-medium text-lg">Personalize your peak experience and account security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {sections.map((section, i) => (
                    <div key={i} className="card bg-base-100 border border-base-200 shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden">
                        <div className={`h-1.5 w-full bg-current ${section.color.replace('text-', 'bg-')} opacity-20 group-hover:opacity-100 transition-opacity`} />
                        <div className="card-body p-8">
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex gap-4">
                                    <div className={`p-4 rounded-2xl ${section.bg} ${section.color} transition-transform group-hover:rotate-6 shadow-sm`}>
                                        <section.icon className="text-2xl" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black tracking-tight">{section.title}</h3>
                                            {section.badge && (
                                                <span className="badge badge-primary badge-outline font-black text-[9px] uppercase tracking-widest px-3 py-3">{section.badge}</span>
                                            )}
                                        </div>
                                        <p className="text-xs font-bold opacity-30 uppercase tracking-[0.1em] mt-1">{section.desc}</p>
                                    </div>
                                </div>
                                {section.action && (
                                    <Link
                                        href={section.action.href}
                                        className="btn btn-ghost btn-sm rounded-xl font-black text-[10px] uppercase tracking-widest border-base-300 gap-2 hover:bg-base-200"
                                    >
                                        {section.action.label} <HiChevronRight strokeWidth={3} />
                                    </Link>
                                )}
                            </div>

                            {section.isCustom && (
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="p-6 bg-base-200/40 rounded-[2rem] border border-base-300/50 flex flex-col gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar group/avatar relative">
                                                <div className="w-14 h-14 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-xl">
                                                    {user?.imageUrl ? (
                                                        <img src={user.imageUrl} alt="Profile" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-base-300 text-base-content/20">
                                                            <HiUser className="text-3xl" />
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                                                    <HiPhoto className="text-xl" />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        disabled={isUpdating}
                                                    />
                                                </label>
                                            </div>
                                            <div>
                                                <div className="text-lg font-black tracking-tight">{user?.name || "Peak User"}</div>
                                                <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{user?.email}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text-alt font-black uppercase tracking-widest opacity-40 text-[9px]">Full Name</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="input input-bordered rounded-xl font-bold"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text-alt font-black uppercase tracking-widest opacity-40 text-[9px]">Email Address</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className="input input-bordered rounded-xl font-bold"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="btn btn-primary rounded-2xl px-10 font-black shadow-xl shadow-primary/20 transition-all"
                                        >
                                            {isUpdating ? <span className="loading loading-spinner" /> : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {section.toggle && (
                                <div className="space-y-4 bg-base-200/30 p-6 rounded-[2rem] border border-base-300/50">
                                    {[
                                        { l: "Direct Click Alerts", d: "Instantly notify when a link is pulsed" },
                                        { l: "Daily Engagement Summary", d: "Condensed peak performance report" },
                                        { l: "AI Optimization Suggestions", d: "Weekly growth triggers from our model" }
                                    ].map((t, idx) => (
                                        <div key={idx} className="flex items-center justify-between pb-4 last:pb-0 last:border-0 border-b border-base-300/50">
                                            <div className="max-w-[80%]">
                                                <div className="text-sm font-bold tracking-tight">{t.l}</div>
                                                <div className="text-[10px] opacity-40 font-medium">{t.d}</div>
                                            </div>
                                            <input type="checkbox" className="toggle toggle-primary toggle-sm" defaultChecked />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!section.isClerk && !section.toggle && (
                                <div className="p-8 bg-black/5 rounded-[2rem] border border-dashed border-base-300 flex flex-col items-center justify-center text-center gap-3">
                                    <div className="p-4 bg-base-100 rounded-3xl shadow-sm text-base-content/20">
                                        <HiSparkles className="text-3xl" />
                                    </div>
                                    <p className="text-xs font-bold opacity-30 uppercase tracking-[0.2em]">Upgrade to unlock deep configuration</p>
                                </div>
                            )}

                            <div className="mt-8 flex justify-end">
                                <button
                                    className="btn btn-primary rounded-2xl px-10 font-black shadow-xl shadow-primary/20 group-hover:scale-105 active:scale-95 transition-all"
                                    onClick={() => toast.success("Configuration pulse saved!")}
                                >
                                    Synchronize Status
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-error/5 border border-error/10 rounded-[3rem] p-12 transition-all hover:bg-error/10 group">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-black tracking-tight text-error mb-2">Danger Territory</h3>
                        <p className="font-bold opacity-40 text-sm">Once you terminate your peak identity, there's no restoration.</p>
                    </div>
                    <button
                        className="btn btn-outline btn-error rounded-2xl px-12 font-black border-2 hover:shadow-xl hover:shadow-error/20 transition-all"
                        onClick={() => toast.error("Self-destruction protocol requires higher clearance.")}
                    >
                        Terminate Identity
                    </button>
                </div>
            </div>
        </div>
    );
}
