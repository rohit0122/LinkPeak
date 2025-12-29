import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import AnalyticsRepository from "@/lib/repositories/AnalyticsRepository";

export async function POST(req) {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { pageId } = await req.json();
        if (!pageId) {
            return NextResponse.json({ error: "Page ID required" }, { status: 400 });
        }

        await AnalyticsRepository.trackView(pageId, session.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Track View API Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
