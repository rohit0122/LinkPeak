import StatsGrid from "@/components/dashboard/StatsGrid";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { HiSparkles, HiArrowTopRightOnSquare } from "react-icons/hi2";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db/connect";
import BioPage from "@/lib/db/models/BioPage";
import LinkModel from "@/lib/db/models/Link";
import User from "@/lib/db/models/User";
import { formatNumber } from "@/lib/utils";

export default async function DashboardPage() {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId) redirect("/");

    await connectDB();

    // Proactive Sync: Ensure user record stays updated with Clerk profile
    if (clerkUser) {
        await User.findOneAndUpdate(
            { clerkId: userId },
            {
                email: clerkUser.emailAddresses[0]?.emailAddress,
                imageUrl: clerkUser.imageUrl
            },
            { upsert: true }
        );
    }

    const page = await BioPage.findOne({ ownerId: userId });

    if (!page) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in duration-700">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary to-secondary p-[2px] rotate-6 shadow-2xl shadow-primary/20">
                    <div className="w-full h-full rounded-[2rem] bg-base-100 flex items-center justify-center">
                        <HiSparkles className="text-5xl text-primary" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter">Welcome to LinkPeak!</h1>
                    <p className="text-base-content/50 font-medium max-w-sm">
                        You haven't created your bio page yet. Let's get you set up in seconds.
                    </p>
                </div>
                <Link href="/dashboard/links" className="btn btn-primary btn-wide rounded-2xl h-14 font-black shadow-xl shadow-primary/20">
                    Create Your Page
                </Link>
            </div>
        );
    }

    const links = await LinkModel.find({ pageId: page._id });
    const totalClicks = links.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
    const avgCtr = page.views ? ((totalClicks / page.views) * 100).toFixed(1) : "0.0";

    // Weekly data distribution (Replicating the logic from old_code for parity)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIndex = new Date().getDay();
    const reorderedDays = [...days.slice(currentDayIndex), ...days.slice(0, currentDayIndex)];

    const chartData = reorderedDays.map((day, i) => {
        const isToday = i === 6;
        const dayFactor = (i + 1) / 28;

        let dayViews = Math.floor((page.views || 0) * dayFactor);
        let dayClicks = Math.floor(totalClicks * dayFactor);

        if (isToday) {
            dayViews = Math.max(dayViews, (page.views || 0) > 0 ? 1 : 0);
            dayClicks = Math.max(dayClicks, totalClicks > 0 ? 1 : 0);
        }

        return {
            name: day,
            views: dayViews,
            clicks: dayClicks,
        };
    });

    const statsData = {
        views: page.views || 0,
        clicks: totalClicks,
        ctr: parseFloat(avgCtr)
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight">Peak Overview</h1>
                    <p className="text-base-content/60 font-medium text-lg italic">Welcome back. Your audience is peaking.</p>
                </div>
                <Link href={`/${page.slug}`} target="_blank" className="btn btn-outline btn-md rounded-2xl border-base-300 hover:bg-base-300 font-bold transition-all gap-2">
                    View Live Site <HiArrowTopRightOnSquare />
                </Link>
            </div>

            <StatsGrid stats={statsData} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 border border-base-200 shadow-2xl overflow-hidden group">
                        <div className="card-body p-8">
                            <h3 className="text-xl font-black tracking-tight mb-2">Recent Performance</h3>
                            <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-widest opacity-40 mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span>Views Pulse</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-secondary" />
                                    <span>Click Action</span>
                                </div>
                            </div>
                            <AnalyticsChart data={chartData} />
                        </div>
                    </div>
                </div>

                <div className="card bg-primary/5 border border-primary/20 shadow-xl shadow-primary/5 overflow-hidden group">
                    <div className="h-1.5 bg-primary w-full origin-left group-hover:scale-x-110 transition-transform duration-500" />
                    <div className="card-body p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/20 rounded-2xl text-primary rotate-3 shadow-lg shadow-primary/10">
                                <HiSparkles className="text-2xl" />
                            </div>
                            <h3 className="card-title text-sm uppercase tracking-widest font-black">AI Recommendations</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 bg-base-100/60 rounded-[2rem] border border-primary/10 transition-all hover:border-primary/30">
                                <p className="text-xs opacity-80 leading-relaxed font-medium">
                                    Our AI detected your links have <span className="font-extrabold text-primary uppercase">rising resonance</span>. Consider adding high-contrast visual cues to drive higher conversion velocity.
                                </p>
                            </div>

                            <Link href="/dashboard/links" className="btn btn-primary btn-block rounded-2xl h-14 font-black shadow-xl shadow-primary/20 gap-2">
                                Optimize Link Flow
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
