"use client";

import { useDispatch, useSelector } from "react-redux";
import { RiRefreshLine } from "react-icons/ri";
import { useGetAnalyticsQuery, useGetLifeTimeStatsQuery } from "@/store/services/analyticsApi";
import LinkPerformanceChart from "../shared/charts/LinkPerformanceChart";
import SummaryAreaChart from "../shared/charts/SummaryAreaChart";
import StatsCards from "../shared/charts/StatsCards";
import { startLoading, stopLoading } from "@/store/slices/loaderSlice";
import { useEffect, useMemo } from "react";
import { useQueryLoader } from "@/lib/hooks";





export default function AnalyticsView({ pageId, plan = "FREE" }) {
    const dispatch = useDispatch();

    const range = useSelector((state) => state.analytics.range);

    // -------------------- RTK Query --------------------
    const { data, isFetching, refetch } = useGetAnalyticsQuery({
        pageId,
        range: range === 9999 ? "all" : range,
    });

    const { data: statsData, isFetching: statsIsFetching, refetch: statsRefetch } = useGetLifeTimeStatsQuery({
        pageId,
        lifetime: true,
    });
    // Sync global loader with initial data fetching
    const queryArray = useMemo(() => [
        { isFetching, data },
        { isFetching: statsIsFetching, data: statsData }
    ], [isFetching, data, statsIsFetching, statsData]);

    useQueryLoader(queryArray);


    const summaryChart = data?.summaryChart || [];
    const linkChart = data?.detailedLinksChart || [];
    const totals = statsData ? { views: statsData.totalViews, clicks: statsData.totalClicks, likes: statsData.totalLikes } : { views: 0, clicks: 0, likes: 0 };
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-center bg-base-100 p-4 border border-base-300 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold">Analytics Overview</h2>
                    <p className="text-xs opacity-60">Real-time performance metrics</p>
                </div>
                <button
                    onClick={() => { refetch(); statsRefetch(); }}
                    disabled={isFetching || statsIsFetching}
                    className="btn btn-sm btn-neutral btn-outline gap-2"
                >
                    <RiRefreshLine className={isFetching ? "animate-spin" : ""} />
                    {isFetching ? "Refreshing..." : "Refresh Data"}
                </button>
            </div>

            {/* Stat Cards */}
            <StatsCards totals={totals} />

            {/* Engagement Chart */}
            <SummaryAreaChart summaryChart={summaryChart} plan={plan} />
            {/* Link Performance Chart */}
            <LinkPerformanceChart plan={plan} linkChart={linkChart} />
        </div>
    );
}
