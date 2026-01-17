"use client";

import { RiCloseLine, RiBarChartFill, RiLinksFill, RiTimeLine, RiPieChartLine } from "react-icons/ri";

export default function AnalyticsGuideModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-base-200">
                {/* Header */}
                <div className="p-6 border-b border-base-200 flex items-center justify-between bg-base-100 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <RiBarChartFill className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Understanding Your Analytics</h2>
                            <p className="text-sm opacity-60">A quick guide to reading your performance metrics</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-circle btn-ghost btn-sm hover:bg-base-200 transition-colors"
                        aria-label="Close modal"
                    >
                        <RiCloseLine className="text-xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">

                    {/* Section 1: Lifetime Stats */}
                    <section className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <span className="badge badge-primary badge-lg h-8 w-8 rounded-full p-0 flex items-center justify-center font-bold">1</span>
                            </div>
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        Lifetime Stats <span className="badge badge-ghost font-normal text-xs uppercase tracking-wider">Hero Overview</span>
                                    </h3>
                                    <p className="text-sm opacity-70 mt-1">A clearer picture of your bio page&apos;s cumulative performance since day one.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="card bg-base-200/50 border border-base-200 p-4 rounded-xl hover:border-primary/30 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-sm uppercase tracking-wide opacity-50">Views & Traffic</span>
                                        </div>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex flex-col">
                                                <span className="font-bold">Total Views</span>
                                                <span className="opacity-70 text-xs">Every single time someone opened your page (including refreshes by the same person).</span>
                                            </li>
                                            <li className="flex flex-col border-t border-base-content/5 pt-2">
                                                <span className="font-bold">Unique Views</span>
                                                <span className="opacity-70 text-xs">The actual number of distinct people who visited. This will always be lower than total views.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="card bg-base-200/50 border border-base-200 p-4 rounded-xl hover:border-secondary/30 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-sm uppercase tracking-wide opacity-50">Engagement</span>
                                        </div>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex flex-col">
                                                <span className="font-bold">Total Clicks</span>
                                                <span className="opacity-70 text-xs">How many times links were actually clicked. Includes history from links you used to have.</span>
                                            </li>
                                            <li className="flex flex-col border-t border-base-content/5 pt-2">
                                                <span className="font-bold flex items-center gap-2">Avg CTR <span className="badge badge-sm badge-success text-[10px]">Vital Metric</span></span>
                                                <span className="opacity-70 text-xs">Click-Through Rate. Shows what % of visitors actually clicked a link. Higher is better!</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="divider opacity-10"></div>

                    {/* Section 2: Summary Chart */}
                    <section className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <span className="badge badge-secondary badge-lg h-8 w-8 rounded-full p-0 flex items-center justify-center font-bold">2</span>
                            </div>
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        Summary Timeline <RiTimeLine className="opacity-50" />
                                    </h3>
                                    <p className="text-sm opacity-70 mt-1">Identify traffic spikes, successful campaigns, or quiet periods over time.</p>
                                </div>

                                <div className="bg-base-200/30 border border-base-200 rounded-xl p-5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <RiBarChartFill className="text-6xl" />
                                    </div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-primary/20"></div>
                                                <span className="font-medium">Series 1 (Views)</span>
                                                <span className="opacity-60 text-xs">- Traffic trends</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-secondary ring-2 ring-secondary/20"></div>
                                                <span className="font-medium">Series 2 (Clicks)</span>
                                                <span className="opacity-60 text-xs">- Engagement trends</span>
                                            </div>
                                        </div>
                                        <div className="alert bg-base-100 shadow-sm border-l-4 border-l-info text-xs py-3 rounded-lg">
                                            <span className="font-bold opacity-80">💡 Practical usage:</span>
                                            &quot;Did my Instagram post on Tuesday actually drive traffic?&quot; Check the spike for that specific day.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="divider opacity-10"></div>

                    {/* Section 3: Detailed Links */}
                    <section className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                <span className="badge badge-accent badge-lg h-8 w-8 rounded-full p-0 flex items-center justify-center font-bold">3</span>
                            </div>
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        Link Breakdown <RiLinksFill className="opacity-50" />
                                    </h3>
                                    <p className="text-sm opacity-70 mt-1">See exactly which content is capturing your audience&apos;s attention.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="card bg-base-200/30 border border-base-200 p-4 rounded-xl col-span-2">
                                        <h4 className="font-bold text-sm mb-2 opacity-80">Detailed Charts</h4>
                                        <p className="text-xs opacity-60 leading-relaxed mb-3">
                                            Visualizes the clicks for each specific link over time. Helps you spot which specific link is viral right now.
                                        </p>
                                        <div className="bg-base-100 rounded-lg p-3 space-y-2 border border-base-200/50">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="flex items-center gap-2 font-medium">
                                                    <span className="file-icon file-icon-sm block w-2 h-2 rounded-full bg-purple-500"></span>
                                                    Portfolio
                                                </span>
                                                <span className="opacity-70 font-bold">10 clicks</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="flex items-center gap-2 font-medium">
                                                    <span className="file-icon file-icon-sm block w-2 h-2 rounded-full bg-blue-500"></span>
                                                    YouTube
                                                </span>
                                                <span className="opacity-70 font-bold">5 clicks</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card bg-base-200/30 border border-base-200 p-4 rounded-xl flex flex-col justify-center">
                                        <div className="flex items-center justify-center mb-2">
                                            <RiPieChartLine className="text-3xl text-accent" />
                                        </div>
                                        <div className="text-center">
                                            <h4 className="font-bold text-sm">Top Performers</h4>
                                            <p className="text-[10px] opacity-60 mt-1">Shows your top 3 winning links instantly.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="alert bg-base-100 shadow-sm border-l-4 border-l-accent text-xs py-3 rounded-lg">
                                    <span className="font-bold opacity-80">💡 Insight:</span>
                                    &quot;My &apos;YouTube&apos; link gets way more clicks than my &apos;Portfolio&apos; on weekends.&quot;
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-base-200 bg-base-100/80 backdrop-blur flex justify-end sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="btn btn-primary btn-sm md:btn-md"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
}
