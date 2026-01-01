import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";
import Link from "@/models/Link";
import { getAuthUser } from "@/lib/auth";
import {
    subDays,
    startOfDay,
    format,
    startOfWeek,
    startOfMonth,
    endOfWeek,
    eachDayOfInterval,
    eachWeekOfInterval,
    eachMonthOfInterval,
    endOfDay,
    getWeek
} from "date-fns";
import { CONFIG } from "@/constants/config";

/**
 * GET /api/analytics/charts
 * Returns optimized chart-ready data with intelligent aggregation:
 * - Range <= 30 days: Daily aggregation
 * - Range = 90 days: Weekly aggregation
 * - Range >= 180 days: Monthly aggregation
 * 
 * Performance optimized: Flat structure, no gaps, minimal payload
 */
export async function GET(req) {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const pageId = searchParams.get("pageId");
        if (!pageId) {
            return NextResponse.json(
                { success: false, error: "Page ID required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Determine plan-based analytics depth
        const userPlan = session.plan || "FREE";
        let maxDays = CONFIG.PLAN_LIMITS[userPlan].analyticsDays;

        // Get requested range
        const requestedRange = searchParams.get("range");
        let days = requestedRange ? parseInt(requestedRange) : 7;

        // Handle "all" or lifetime requests
        if (requestedRange === "all" || days === 9999) {
            days = maxDays;
        }

        // Ensure range doesn't exceed plan limit
        if (maxDays !== 9999 && days > maxDays) {
            days = maxDays;
        }

        const startDate = startOfDay(subDays(new Date(), days - 1));
        const endDate = endOfDay(new Date());

        // Fetch analytics data for the date range (read-only, no side effects)
        const analyticsData = await Analytics.find({
            pageId: new mongoose.Types.ObjectId(pageId),
            date: { $gte: startDate, $lte: endDate }
        })
            .sort({ date: 1 })
            .lean();

        // Fetch all active links for this page (read-only)
        const links = await Link.find({
            pageId: new mongoose.Types.ObjectId(pageId),
            isActive: true
        })
            .select("_id title")
            .lean();

        // Create a map of linkId to title for O(1) lookup
        const linkTitleMap = {};
        links.forEach(link => {
            linkTitleMap[link._id.toString()] = link.title;
        });

        // Determine aggregation strategy based on range
        let aggregationType = "daily";
        let dateFormat = "MMM dd";

        if (days === 90) {
            aggregationType = "weekly";
            dateFormat = "'Week' w"; // Week number format (e.g., "Week 1")
        } else if (days >= 180) {
            aggregationType = "monthly";
            dateFormat = "MMM yyyy";
        }

        // Generate all expected time periods (prevents gaps in charts)
        let timePeriods = [];
        if (aggregationType === "daily") {
            timePeriods = eachDayOfInterval({ start: startDate, end: endDate });
        } else if (aggregationType === "weekly") {
            timePeriods = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
        } else {
            timePeriods = eachMonthOfInterval({ start: startDate, end: endDate });
        }

        // Create a map of analytics data by date for O(1) lookup
        const analyticsMap = new Map();
        analyticsData.forEach(day => {
            const dateKey = format(new Date(day.date), "yyyy-MM-dd");
            analyticsMap.set(dateKey, day);
        });

        // Helper function to get period key for aggregation
        const getPeriodKey = (date) => {
            if (aggregationType === "daily") {
                return format(date, "yyyy-MM-dd");
            } else if (aggregationType === "weekly") {
                return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
            } else {
                return format(startOfMonth(date), "yyyy-MM-dd");
            }
        };

        // Aggregate data by time period
        const aggregatedData = new Map();

        timePeriods.forEach(period => {
            const periodKey = getPeriodKey(period);
            if (!aggregatedData.has(periodKey)) {
                aggregatedData.set(periodKey, {
                    date: period,
                    views: 0,
                    clicks: 0,
                    linkStats: {}
                });
            }
        });

        // Aggregate analytics data into periods
        analyticsData.forEach(day => {
            const periodKey = getPeriodKey(new Date(day.date));
            const period = aggregatedData.get(periodKey);

            if (period) {
                period.views += day.views || 0;
                period.clicks += day.clicks || 0;

                // Aggregate link stats
                if (day.linkStats && day.linkStats.length > 0) {
                    day.linkStats.forEach(stat => {
                        const linkId = stat.linkId.toString();
                        const linkTitle = linkTitleMap[linkId];

                        if (linkTitle) {
                            if (!period.linkStats[linkTitle]) {
                                period.linkStats[linkTitle] = 0;
                            }
                            period.linkStats[linkTitle] += stat.clicks || 0;
                        }
                    });
                }
            }
        });

        // Build summaryChart: Flat structure, no gaps, minimal payload
        const summaryChart = Array.from(aggregatedData.values()).map(period => ({
            label: format(period.date, dateFormat),
            views: period.views,
            clicks: period.clicks
        }));

        // Build detailedLinksChart: Flat structure with link names as keys
        const detailedLinksChart = Array.from(aggregatedData.values()).map(period => {
            const dayData = {
                label: format(period.date, dateFormat)
            };

            // Add all active links with their aggregated clicks (0 if no data)
            links.forEach(link => {
                dayData[link.title] = period.linkStats[link.title] || 0;
            });

            return dayData;
        });

        return NextResponse.json({
            success: true,
            meta: {
                plan: userPlan,
                range: days.toString(),
                aggregation: aggregationType
            },
            data: {
                summaryChart,
                detailedLinksChart
            }
        });

    } catch (error) {
        console.error("Chart API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
