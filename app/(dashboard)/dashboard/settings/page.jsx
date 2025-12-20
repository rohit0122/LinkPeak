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
import { UserButton, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";

export default function SettingsPage() {
    const { user } = useUser();

    const sections = [
        {
            title: "Peak Identity",
            desc: "Manage your public handle and bio appearance",
            icon: HiUser,
            color: "text-primary",
            bg: "bg-primary/10",
            action: { label: "Edit Profile", href: "https://accounts.clerk.com/user" }, // External or Clerk managed
            isClerk: true
        },
        {
            title: "Security Core",
            desc: "2FA and account access settings",
            icon: HiShieldCheck,
            color: "text-success",
            bg: "bg-success/10",
            action: { label: "Configure", href: "https://accounts.clerk.com/user/security" },
            isClerk: true
        },
        {
            title: "Peak Pulse Alerts",
            desc: "Engagement notification pulses",
            icon: HiBell,
            color: "text-secondary",
            bg: "bg-secondary/10",
            toggle: true
        },
        {
            title: "Protocol Subscription",
            desc: "Scale your reach with Pro peak performance",
            icon: HiCreditCard,
            color: "text-accent",
            bg: "bg-accent/10",
            badge: "FREE PLAN",
            action: { label: "Upgrade Pulse", href: "/pricing" }
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
                                        target={section.isClerk ? "_blank" : "_self"}
                                        className="btn btn-ghost btn-sm rounded-xl font-black text-[10px] uppercase tracking-widest border-base-300 gap-2 hover:bg-base-200"
                                    >
                                        {section.action.label} <HiArrowTopRightOnSquare strokeWidth={3} />
                                    </Link>
                                )}
                            </div>

                            {section.isClerk && (
                                <div className="p-6 bg-base-200/40 rounded-[2rem] border border-base-300/50 flex items-center justify-between group/clerk">
                                    <div className="flex items-center gap-4">
                                        <div className="avatar">
                                            <div className="w-14 h-14 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-xl">
                                                <img src={user?.imageUrl} alt="Profile" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-black tracking-tight">{user?.fullName || "Peak User"}</div>
                                            <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{user?.primaryEmailAddress?.emailAddress}</div>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover/clerk:opacity-100 transition-opacity">
                                        <div className="p-2 bg-primary/20 rounded-xl text-primary">
                                            <HiSparkles className="text-xl animate-pulse" />
                                        </div>
                                    </div>
                                </div>
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
