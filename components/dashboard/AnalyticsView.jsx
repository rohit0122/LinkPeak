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
import StatsCards from "../shared/charts/StatsCards";
import SummaryAreaChart from "../shared/charts/SummaryAreaChart";
import LinkPerformanceChart from "../shared/charts/LinkPerformanceChart";

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

export default function AnalyticsView({ data = [], plan, links = [], page = {}, lifetime }) {
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
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-center bg-base-100 p-4 border border-base-300 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold">Analytics Overview</h2>
                    <p className="text-xs opacity-60">Real-time performance metrics</p>
                </div>
                <button
                    onClick={() => { }}
                    className="btn btn-sm btn-neutral btn-outline gap-2"
                >
                    <RiRefreshLine />
                    Refresh Data
                </button>
            </div>
            {/* Stat Cards */}
            <StatsCards totals={totals} />

            {/* Engagement Chart */}
            <SummaryAreaChart summaryChart={chartData} plan={plan} />

            {/* Link Performance Graph - Premium Feature */}
            <LinkPerformanceChart plan={plan} linkPerformanceData={linkPerformanceData} />
        </div>
    );
}
