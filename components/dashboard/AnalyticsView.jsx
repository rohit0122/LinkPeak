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
    PieChart,
    Pie,
    Cell
} from "recharts";
import { format } from "date-fns";
import { RiEyeLine, RiCursorLine, RiHeartLine, RiPercentLine } from "react-icons/ri";

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

export default function AnalyticsView({ data = [], plan }) {
    const [chartData, setChartData] = useState([]);

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
    }, [data]);

    const totals = data.reduce((acc, curr) => ({
        views: acc.views + curr.views,
        clicks: acc.clicks + curr.clicks,
        likes: acc.likes + curr.likes
    }), { views: 0, clicks: 0, likes: 0 });

    const ctr = totals.views > 0 ? ((totals.clicks / totals.views) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
        </div>
    );
}
