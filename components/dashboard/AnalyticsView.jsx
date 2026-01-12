"use client";

import { useState, useEffect } from "react";
import { RiRefreshLine } from "react-icons/ri";
import StatsCards from "../shared/charts/StatsCards";
import SummaryAreaChart from "../shared/charts/SummaryAreaChart";
import LinkPerformanceChart from "../shared/charts/LinkPerformanceChart";
import { SkeletonTable } from "../shared/SkeletonLoaders";

import { API_PREFIX, ENDPOINTS } from "@/constants/endpoints";
import { useAuthStore } from "@/stores/useAuthStore";
import httpClient from "@/lib/httpClient";
import { useAnalyticsStore } from "@/stores/useAnalyticsStore";

export default function AnalyticsView() {
  const [summaryChartData, setSummaryChartData] = useState([]);
  const [linkChartData, setLinkChartData] = useState([]);
  const { currentRange, setCurrentRange } = useAnalyticsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentBioPage, currentUser } = useAuthStore();

  const [activeTotals, setActiveTotals] = useState({
    views: 0,
    clicks: 0,
    likes: 0,
    avgCTR: 0,
  });

  // Fetch chart data from API (single call for both charts)
  const fetchChartData = async (range) => {
    if (!currentBioPage?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await httpClient.get(
        `${ENDPOINTS.ANALYTICS.CHARTS}?pageId=${currentBioPage.id}&range=${range}`
      );
      const result = await response.data;

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch chart data");
      }

      setSummaryChartData(result.data.data.summaryChart || []);
      setLinkChartData(result.data.data.detailedLinksChart || []);
    } catch (err) {
      console.error("Error fetching chart data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch fresh lifetime stats
  const fetchLifetimeStats = async () => {
    if (!currentBioPage?.id) return;

    try {
      const response = await fetch(
        `${API_PREFIX}${ENDPOINTS.ANALYTICS.GET}?pageId=${currentBioPage.id}`
      );
      const result = await response.json();

      if (result.success && result.data.lifetime) {
        setActiveTotals({
          views: result.data.lifetime.totalViews || 0,
          clicks: result.data.lifetime.totalClicks || 0,
          likes: result.data.lifetime.totalLikes || 0,
          avgCTR: result.data.lifetime.avgCTR || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching lifetime stats:", err);
    }
  };

  // Fetch initial data on mount (Reset to 7 days as requested)
  useEffect(() => {
    if (currentBioPage?.id) {
      setCurrentRange(7);
      fetchLifetimeStats();
      fetchChartData(7);
    }
  }, [currentBioPage?.id]);

  // Handle range change (updates both charts)
  const handleRangeChange = (newRange) => {
    setCurrentRange(newRange);
    fetchChartData(newRange);
  };

  // Handle refresh: Reset to 7 days, fetch charts and stats
  const handleRefresh = async () => {
    setCurrentRange(7);
    await Promise.all([fetchChartData(7), fetchLifetimeStats()]);
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
          onClick={handleRefresh}
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
          plan={currentUser.plan}
          onRangeChange={handleRangeChange}
          currentRange={currentRange}
        />
      )}

      {/* Link Performance Chart */}
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <LinkPerformanceChart
          plan={currentUser.plan}
          linkChart={linkChartData}
          onRangeChange={handleRangeChange}
          currentRange={currentRange}
        />
      )}
    </div>
  );
}
