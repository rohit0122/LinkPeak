/*import { NextResponse } from "next/server";
import AnalyticsRepository from "@/lib/repositories/AnalyticsRepository";
import UserRepository from "@/lib/repositories/UserRepository";
import { getAuthUser } from "@/lib/auth";
import { subDays, startOfDay } from "date-fns";
import { CONFIG } from "@/constants/config";

export async function GET(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const pageId = searchParams.get("pageId");
        if (!pageId) return NextResponse.json({ success: false, error: "Page ID required" }, { status: 400 });

        // Get user for plan-based analytics depth
        const user = await UserRepository.findById(session.id);
        const plan = user?.plan || "FREE";

        let maxDays = CONFIG.PLAN_LIMITS[plan].analyticsDays;
        if (plan === "AGENCY") maxDays = 36500;

        const range = searchParams.get("range"); // 7d, 30d, all
        let days = range ? parseInt(range) : maxDays;
        if (range === "all") days = maxDays;
        if (isNaN(days)) days = maxDays;

        // Ensure range doesn't exceed plan limit
        days = Math.min(days, maxDays);

        const startDate = startOfDay(subDays(new Date(), days));

        // Use Repository for time-series data
        const data = await AnalyticsRepository.findByPageIdWithDateRange(pageId, startDate);

        // Use Repository for Lifetime Sum
        const lifetime = await AnalyticsRepository.getLifetimeSum(pageId);

        return NextResponse.json({
            success: true,
            data: {
                data,
                lifetime
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
*/
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import AnalyticsRepository from "@/lib/repositories/AnalyticsRepository";
import UserRepository from "@/lib/repositories/UserRepository";

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
        const rangeParam = searchParams.get("range"); // "7", "15", "30", "90", "180", "lifetime"
        const isLifetime = searchParams.get("lifetime");

        if (!pageId) {
            return NextResponse.json(
                { success: false, error: "Page ID required" },
                { status: 400 }
            );
        }
        if (isLifetime) {
            const lifetime = await AnalyticsRepository.getLifetimeSum(pageId);
            return NextResponse.json({
                success: true,
                data: lifetime,
            });
        }
        // Get user & plan
        const user = await UserRepository.findById(session.id);
        const plan = user?.plan || "FREE";

        // Validate range based on plan
        const allowedRanges = {
            FREE: ["7"],
            PRO: ["7", "15", "30", "90"],
            AGENCY: ["7", "15", "30", "90", "180", "lifetime"],
        }[plan];

        let range = rangeParam || allowedRanges[0];
        if (!allowedRanges.includes(range)) range = allowedRanges[0];

        // Fetch chart-ready analytics
        const data = await AnalyticsRepository.getChartReadyAnalytics({
            pageId,
            plan,
            range,
        });

        // Response format
        const response = {
            success: true,
            meta: {
                plan,
                range,
            },
            data,
        };

        // Free plan only gets summary chart
        if (plan === "FREE") {
            return NextResponse.json({
                success: true,
                meta: response.meta,
                data: { summaryChart: data.summaryChart },
            });
        }

        return NextResponse.json(response);
    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
