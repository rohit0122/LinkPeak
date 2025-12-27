import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import BioPage from "@/models/BioPage";
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

        const { pageId } = await req.json();
        if (!pageId) return NextResponse.json({ success: false }, { status: 400 });

        await dbConnect();
        const today = startOfDay(new Date());

        // Atomic increment for BioPage
        await BioPage.findByIdAndUpdate(pageId, { $inc: { views: 1 } });

        // Atomic increment for daily Analytics record
        await Analytics.findOneAndUpdate(
            { pageId, date: today },
            { $inc: { views: 1 } },
            { upsert: true, new: true }
        );

        // Track impressions for all active links on the page
        const activeLinks = await Link.find({ pageId, isActive: true }).select('_id');

        if (activeLinks.length > 0) {
            for (const link of activeLinks) {
                const linkId = link._id;
                // Update or Push link-specific views in Analytics
                const analyticsUpdate = await Analytics.findOneAndUpdate(
                    { pageId, date: today, "linkStats.linkId": linkId },
                    { $inc: { "linkStats.$.views": 1 } },
                    { new: true }
                );

                if (!analyticsUpdate) {
                    await Analytics.findOneAndUpdate(
                        { pageId, date: today },
                        { $push: { linkStats: { linkId, views: 1, clicks: 0 } } }
                    );
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
