import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Link from "@/models/Link";
import Analytics from "@/models/Analytics";
import { startOfDay } from "date-fns";

export async function POST(req) {
    try {
        const { linkId, pageId } = await req.json();
        if (!linkId || !pageId) return NextResponse.json({ success: false }, { status: 400 });

        await dbConnect();
        const today = startOfDay(new Date());

        // Atomic increment for Link
        await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });

        // Atomic increment for daily Analytics record
        await Analytics.findOneAndUpdate(
            { pageId, date: today },
            { $inc: { clicks: 1 } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
