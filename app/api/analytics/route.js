import { NextResponse } from "next/server";
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

        // Plan-based analytics depth
        let days = CONFIG.PLAN_LIMITS.FREE.analyticsDays;
        if (session.plan === "PRO") days = CONFIG.PLAN_LIMITS.PRO.analyticsDays;
        if (session.plan === "AGENCY") days = 36500; // Practically lifetime

        const startDate = startOfDay(subDays(new Date(), days));

        const data = await Analytics.find({
            pageId,
            date: { $gte: startDate },
        }).sort({ date: 1 });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
