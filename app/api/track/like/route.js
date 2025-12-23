import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import BioPage from "@/models/BioPage";
import Analytics from "@/models/Analytics";
import { startOfDay } from "date-fns";

export async function POST(req) {
    try {
        const { pageId } = await req.json();
        if (!pageId) return NextResponse.json({ success: false }, { status: 400 });

        await dbConnect();
        const today = startOfDay(new Date());

        // Atomic increment for BioPage
        await BioPage.findByIdAndUpdate(pageId, { $inc: { likes: 1 } });

        // Atomic increment for daily Analytics record
        await Analytics.findOneAndUpdate(
            { pageId, date: today },
            { $inc: { likes: 1 } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
