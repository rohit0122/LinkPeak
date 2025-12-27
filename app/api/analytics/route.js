import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Analytics from "@/models/Analytics";
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

        await dbConnect();

        // Plan-based analytics depth (default range if not provided)
        let maxDays = CONFIG.PLAN_LIMITS.FREE.analyticsDays;
        if (session.plan === "PRO") maxDays = CONFIG.PLAN_LIMITS.PRO.analyticsDays;
        if (session.plan === "AGENCY") maxDays = 36500;

        const range = searchParams.get("range"); // 7d, 30d, all
        let days = range ? parseInt(range) : maxDays;
        if (range === "all") days = maxDays;
        if (isNaN(days)) days = maxDays;

        // Ensure range doesn't exceed plan limit
        days = Math.min(days, maxDays);

        const startDate = startOfDay(subDays(new Date(), days));

        // Optimized Aggregation Pipeline
        const pipeline = [
            {
                $match: {
                    pageId: new mongoose.Types.ObjectId(pageId),
                    date: { $gte: startDate }
                }
            },
            { $sort: { date: 1 } },
            {
                $project: {
                    _id: 0,
                    date: 1,
                    views: 1,
                    clicks: 1,
                    likes: 1,
                    linkStats: 1
                }
            }
        ];

        const data = await Analytics.aggregate(pipeline);

        // Secondary Query for Lifetime Sum (as requested in prompt #3)
        const lifetimeSum = await Analytics.aggregate([
            { $match: { pageId: new mongoose.Types.ObjectId(pageId) } },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                    totalClicks: { $sum: "$clicks" },
                    totalLikes: { $sum: "$likes" }
                }
            }
        ]);

        return NextResponse.json({
            success: true,
            data,
            lifetime: lifetimeSum[0] || { totalViews: 0, totalClicks: 0, totalLikes: 0 }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
