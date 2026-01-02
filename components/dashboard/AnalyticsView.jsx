"use client";

import { useState, useEffect } from "react";
import { RiRefreshLine } from "react-icons/ri";
import StatsCards from "../shared/charts/StatsCards";
import SummaryAreaChart from "../shared/charts/SummaryAreaChart";
import LinkPerformanceChart from "../shared/charts/LinkPerformanceChart";
import { SkeletonChart, SkeletonTable } from "../shared/SkeletonLoaders";
import { useLoader } from "@/context/LoaderContext";

import { API_PREFIX, ENDPOINTS } from "@/constants/endpoints";

export default function AnalyticsView({ data = [], plan, links = [], page = {}, lifetime }) {
    const [summaryChartData, setSummaryChartData] = useState([]);
    const [linkChartData, setLinkChartData] = useState([]);
    const [currentRange, setCurrentRange] = useState(7);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showLoader, hideLoader } = useLoader();

    // Initialize activeTotals from props or fallback calculation
    const [activeTotals, setActiveTotals] = useState(() => {
        if (lifetime && (lifetime.totalViews || lifetime.totalClicks || lifetime.totalLikes)) {
            return {
                views: lifetime.totalViews || 0,
                clicks: lifetime.totalClicks || 0,
                likes: lifetime.totalLikes || 0
            };
        }
        return data.reduce((acc, curr) => ({
            views: acc.views + curr.views,
            clicks: acc.clicks + curr.clicks,
            likes: acc.likes + curr.likes
        }), { views: 0, clicks: 0, likes: 0 });
    });

    // Fetch chart data from API (single call for both charts)
    const fetchChartData = async (range) => {
        if (!page?._id) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${API_PREFIX}${ENDPOINTS.ANALYTICS.CHARTS}?pageId=${page._id}&range=${range}`
            );
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch chart data');
            }

            // Update both charts from single API response
            setSummaryChartData(result.data.summaryChart || []);
            setLinkChartData(result.data.detailedLinksChart || []);
        } catch (err) {
            console.error('Error fetching chart data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch fresh lifetime stats
    const fetchLifetimeStats = async () => {
        if (!page?._id) return;
        try {
            const response = await fetch(`${API_PREFIX}${ENDPOINTS.ANALYTICS.GET}?pageId=${page._id}`);
            const result = await response.json();
            if (result.success && result.lifetime) {
                setActiveTotals({
                    views: result.lifetime.totalViews || 0,
                    clicks: result.lifetime.totalClicks || 0,
                    likes: result.lifetime.totalLikes || 0
                });
            }
        } catch (err) {
            console.error('Error fetching lifetime stats:', err);
        }
    };

    // Fetch initial data on mount
    useEffect(() => {
        if (page?._id) {
            fetchChartData(currentRange);
        }
    }, [page?._id]);

    // Handle range change (updates both charts)
    const handleRangeChange = (newRange) => {
        setCurrentRange(newRange);
        fetchChartData(newRange);
    };

    // Handle refresh: Reset to 7 days, fetch charts, fetch stats
    const handleRefresh = () => {
        showLoader();
        setCurrentRange(7);
        // We trigger both. fetchChartData manages the loading state / main spinner.
        // fetchLifetimeStats updates the cards silently/concurrently.
        fetchChartData(7);
        fetchLifetimeStats();
        hideLoader();
    };

    return (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-center bg-base-100 p-4 border border-base-300 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold">Analytics Overview</h2>
                    <p className="text-xs opacity-60">Real-time performance metrics</p>
                </div>
                <button
                    onClick={() => handleRefresh()}
                    disabled={isLoading}
                    className="btn btn-sm btn-neutral btn-outline gap-2"
                >
                    <RiRefreshLine className={isLoading ? "animate-spin" : ""} />
                    Refresh Data
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-error">
                    <span>Error: {error}</span>
                </div>
            )}

            {/* Stat Cards */}
            <StatsCards totals={activeTotals} />

            {/* Summary Engagement Chart */}
            {isLoading ? (
                <SkeletonTable />
            ) : (
                <SummaryAreaChart
                    summaryChart={summaryChartData}
                    plan={plan}
                    onRangeChange={handleRangeChange}
                    currentRange={currentRange}
                />
            )}

            {/* Link Performance Chart */}
            {isLoading ? (
                <SkeletonTable />
            ) : (
                <LinkPerformanceChart
                    plan={plan}
                    linkChart={linkChartData}
                    onRangeChange={handleRangeChange}
                    currentRange={currentRange}
                />
            )}
        </div>
    );
}
