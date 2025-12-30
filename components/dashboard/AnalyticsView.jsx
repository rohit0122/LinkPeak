"use client";

import { useState, useEffect } from "react";
import { CONFIG } from "@/constants/config";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts";
import { format } from "date-fns";
import { RiEyeLine, RiCursorLine, RiHeartLine, RiPercentLine, RiBarChartGroupedLine, RiRefreshLine } from "react-icons/ri";

function StatCard({ title, value, icon: Icon, colorClass }) {
    return (
        <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{title}</p>
                        <h3 className="text-3xl font-medium">{value}</h3>
                    </div>
                    <div className={`p-3  ${colorClass}`}>
                        <Icon className="text-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AnalyticsView({ data = [], plan, links = [], page = {}, lifetime, onRefresh, isRefreshing }) {
    const [chartData, setChartData] = useState([]);
    const [performanceRange, setPerformanceRange] = useState(7); // Default 7 days

    const limitDays = CONFIG.PLAN_LIMITS[plan || "FREE"].analyticsDays;

    useEffect(() => {
        if (data.length > 0) {
            // Slice data based on plan limits
            const slicedData = data.slice(-limitDays);
            setChartData(slicedData.map(item => ({
                ...item,
                date: format(new Date(item.date), "MMM dd")
            })));
        } else {
            // Mock empty data for visual
            setChartData([
                { date: "Day 1", views: 0, clicks: 0, likes: 0 },
                { date: "Day 2", views: 0, clicks: 0, likes: 0 },
                { date: "Day 3", views: 0, clicks: 0, likes: 0 },
            ]);
        }
    }, [data, limitDays]);

    // Priority: use the 'lifetime' prop (Aggregated/Direct API), fallback to summing 'data' array
    const totals = lifetime ? {
        views: lifetime.totalViews || 0,
        clicks: lifetime.totalClicks || 0,
        likes: lifetime.totalLikes || 0
    } : data.reduce((acc, curr) => ({
        views: acc.views + curr.views,
        clicks: acc.clicks + curr.clicks,
        likes: acc.likes + curr.likes
    }), { views: 0, clicks: 0, likes: 0 });

    const ctr = totals.views > 0 ? ((totals.clicks / totals.views) * 100).toFixed(1) : 0;

    // Link Performance Logic
    const getLinkPerformance = (days) => {
        // Correctly handle range for performance chart
        const filteredData = days === 9999 ? data : data.filter(item => {
            const date = new Date(item.date);
            const diffTime = Math.abs(new Date() - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= days;
        });

        // Aggregate clicks and views per link
        const linkMetrics = {};

        filteredData.forEach(day => {
            (day.linkStats || []).forEach(stat => {
                const id = String(stat.linkId);
                if (!linkMetrics[id]) linkMetrics[id] = { clicks: 0, views: 0 };
                linkMetrics[id].clicks += (stat.clicks || 0);
                linkMetrics[id].views += (stat.views || 0);
            });
        });

        // Map to active links
        return links
            .filter(link => link.isActive)
            .map(link => {
                const linkId = String(link._id);
                const metrics = linkMetrics[linkId] || { clicks: 0, views: 0 };

                return {
                    name: link.title.length > 15 ? link.title.substring(0, 12) + ".." : link.title,
                    fullName: link.title,
                    clicks: metrics.clicks,
                    views: metrics.views,
                    hasData: metrics.clicks > 0 || metrics.views > 0
                };
            })
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 8); // Top 8 links for readability
    };

    const linkPerformanceData = getLinkPerformance(performanceRange);
    const hasAnyLinkData = linkPerformanceData.some(l => l.hasData);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Refresh */}
            <div className="flex justify-between items-center bg-base-100 p-4 border border-base-300 rounded-xl shadow-sm">
                <div>
                    <h2 className="text-lg font-bold">Analytics Overview</h2>
                    <p className="text-xs opacity-60">Real-time performance metrics</p>
                </div>
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="btn btn-sm btn-ghost gap-2"
                >
                    <RiRefreshLine className={isRefreshing ? "animate-spin" : ""} />
                    {isRefreshing ? "Refreshing..." : "Refresh Data"}
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <StatCard
                    title="Total Views"
                    value={totals.views}
                    icon={RiEyeLine}
                    colorClass="bg-blue-100 text-blue-600"
                />
                <StatCard
                    title="Total Clicks"
                    value={totals.clicks}
                    icon={RiCursorLine}
                    colorClass="bg-purple-100 text-purple-600"
                />
                <StatCard
                    title="Avg. CTR"
                    value={`${ctr}%`}
                    icon={RiPercentLine}
                    colorClass="bg-orange-100 text-orange-600"
                />
                <StatCard
                    title="Total Likes"
                    value={totals.likes}
                    icon={RiHeartLine}
                    colorClass="bg-pink-100 text-pink-600"
                />
            </div>

            {/* Engagement Chart */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold">Engagement Over Time</h2>
                            <p className="text-sm opacity-60">
                                Showing last {limitDays === 9999 ? 'lifetime' : limitDays} days
                            </p>
                        </div>
                        {plan === 'FREE' && (
                            <div className="badge badge-primary badge-outline gap-2 p-4 font-bold">
                                Upgrade for 90-day history
                            </div>
                        )}
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9333ea" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="#9333ea"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorClicks)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Link Performance Graph - Premium Feature */}
            {plan !== 'FREE' ? (
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-bold">Link Performance</h2>
                                <p className="text-sm opacity-60">Click distribution for selected period</p>
                            </div>

                            <div className="join join-horizontal bg-base-200 p-1 rounded-xl">
                                {[
                                    { label: '7D', value: 7 },
                                    { label: '90D', value: 90, disabled: plan === 'PRO' && limitDays < 90 },
                                    { label: 'Lifetime', value: 9999 }
                                ].map((range) => (
                                    <button
                                        key={range.value}
                                        onClick={() => setPerformanceRange(range.value)}
                                        className={`btn btn-xs join-item border-none ${performanceRange === range.value ? 'btn-primary' : 'btn-ghost opacity-60'}`}
                                        disabled={range.disabled}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {linkPerformanceData.length > 0 ? (
                            <div className="h-[400px] w-full relative">
                                {(!hasAnyLinkData && performanceRange !== 9999) && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100/50 backdrop-blur-[2px]">
                                        <div className="bg-base-100 p-6 shadow-xl border border-base-300 text-center max-w-xs space-y-3">
                                            <RiBarChartGroupedLine className="text-4xl text-primary mx-auto" />
                                            <h3 className="font-bold">Collecting Data...</h3>
                                            <p className="text-xs opacity-60">Detailed stats for this period are being gathered. Check "Lifetime" for total clicks.</p>
                                            <button onClick={() => setPerformanceRange(9999)} className="btn btn-primary btn-sm btn-block">View Lifetime Stats</button>
                                        </div>
                                    </div>
                                )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={linkPerformanceData} layout="vertical" margin={{ left: 30, right: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                                        <XAxis type="number" hide />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 500 }}
                                            width={100}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f3f4f6' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 shadow-2xl border border-gray-100 rounded-xl space-y-1">
                                                            <p className="font-bold text-sm text-gray-900">{data.fullName}</p>
                                                            <div className="flex justify-between gap-6 items-center">
                                                                <span className="text-xs text-purple-600 font-medium">Clicks</span>
                                                                <span className="text-sm font-bold">{data.clicks}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="clicks" fill="#9333ea" radius={[0, 6, 6, 0]} barSize={28}>
                                            {linkPerformanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={[
                                                    '#9333ea', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95'
                                                ][index % 5]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-center opacity-40">
                                <div className="space-y-2">
                                    <RiCursorLine className="text-4xl mx-auto" />
                                    <p>No active links to display metrics for.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="card bg-slate-900 text-white shadow-xl border border-slate-700/50 group overflow-hidden relative">
                    {/* Ambient Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                    <div className="card-body p-10 items-center text-center relative z-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                            <RiBarChartGroupedLine className="text-3xl text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            Unlock Per-Link Analytics
                        </h2>
                        <p className="text-white/60 max-w-sm mb-8 leading-relaxed">
                            Upgrade to Pro to see exactly which links your fans are clicking most with detailed 7-day, 90-day, and lifetime performance data.
                        </p>
                        <button
                            onClick={() => window.location.href = '/#pricing'}
                            className="btn btn-primary btn-wide font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                        >
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
