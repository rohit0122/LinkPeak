import { NextResponse } from "next/server";
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
        const data = await AnalyticsRepository.findByPageIdWithDateRange(pageId, startDate, session.id);

        // Use Repository for Lifetime Sum
        const lifetime = await AnalyticsRepository.getLifetimeSum(pageId, session.id);

        return NextResponse.json({
            success: true,
            data,
            lifetime
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
