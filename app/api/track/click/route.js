import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Link from "@/models/Link";
import Analytics from "@/models/Analytics";
import { startOfDay } from "date-fns";
import { trackingRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
    try {
        // Rate limiting
        const rateLimitResult = await trackingRateLimit(req);
        if (!rateLimitResult.success) {
            return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
        }

        const { linkId, pageId } = await req.json();
        if (!linkId || !pageId) return NextResponse.json({ success: false }, { status: 400 });

        await dbConnect();
        const today = startOfDay(new Date());
        // Atomic increment for Link
        await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });

        // Atomic increment for daily Analytics record
        await Analytics.findOneAndUpdate(
            { pageId, date: today },
            {
                $inc: { clicks: 1 },
                $set: { updatedAt: new Date() } // Ensure timestamp update
            },
            { upsert: true, new: true }
        );

        // Update or Push link-specific clicks in Analytics
        const analyticsUpdate = await Analytics.findOneAndUpdate(
            { pageId, date: today, "linkStats.linkId": linkId },
            { $inc: { "linkStats.$.clicks": 1 } },
            { new: true }
        );

        if (!analyticsUpdate) {
            await Analytics.findOneAndUpdate(
                { pageId, date: today },
                { $push: { linkStats: { linkId, clicks: 1 } } }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
