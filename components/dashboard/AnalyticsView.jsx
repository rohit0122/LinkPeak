"use client";

import { useState, useEffect, useCallback } from "react";
import { RiRefreshLine, RiQuestionLine } from "react-icons/ri";
import StatsCards from "../shared/charts/StatsCards";
import SummaryAreaChart from "../shared/charts/SummaryAreaChart";
import LinkPerformanceChart from "../shared/charts/LinkPerformanceChart";
import { SkeletonTable } from "../shared/SkeletonLoaders";
import AnalyticsGuideModal from "./AnalyticsGuideModal";

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
  const [showGuide, setShowGuide] = useState(false);
  const { currentBioPage, currentUser } = useAuthStore();

  const [activeTotals, setActiveTotals] = useState({
    total_views: 0,
    unique_views: 0,
    total_clicks: 0,
    unique_clicks: 0,
    total_likes: 0,
    total_active_links: 0,
    avg_ctr: 0,
  });

  // Fetch chart data from API (single call for both charts)
  const fetchChartData = useCallback(async (range) => {
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
  }, [currentBioPage?.id]);

  // Fetch fresh lifetime stats
  const fetchLifetimeStats = useCallback(async () => {
    if (!currentBioPage?.id) return;

    try {
      const response = await fetch(
        `${API_PREFIX}${ENDPOINTS.ANALYTICS.GET}?pageId=${currentBioPage.id}`
      );
      const result = await response.json();

      if (result.success && result.data.lifetime) {
        setActiveTotals({
          total_views: result.data.lifetime.total_views || 0,
          unique_views: result.data.lifetime.unique_views || 0,
          total_clicks: result.data.lifetime.total_clicks || 0,
          unique_clicks: result.data.lifetime.unique_clicks || 0,
          total_likes: result.data.lifetime.total_likes || 0,
          total_active_links: result.data.lifetime.total_active_links || 0,
          avg_ctr: result.data.lifetime.avg_ctr || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching lifetime stats:", err);
    }
  }, [currentBioPage?.id]);

  // Fetch initial data on mount (Reset to 7 days as requested)
  useEffect(() => {
    if (currentBioPage?.id) {
      setCurrentRange(7);
      fetchLifetimeStats();
      fetchChartData(7);
    }
  }, [currentBioPage?.id, fetchChartData, fetchLifetimeStats, setCurrentRange]);

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body p-6 flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Bio Growth Insights</h2>
            <p className="text-xs opacity-60 mt-1">Track your bio engagement and performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(true)}
              className="btn btn-sm btn-ghost gap-2 text-primary"
            >
              <RiQuestionLine />
              How to read this?
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn btn-sm btn-neutral btn-outline gap-2"
            >
              <RiRefreshLine className={isLoading ? "animate-spin" : ""} />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>Error: {error}</span>
        </div>
      )}

      {/* Stat Cards */}
      <StatsCards totals={activeTotals} />

      <div className="divider"></div>

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

      <div className="divider"></div>

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

      <AnalyticsGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}
