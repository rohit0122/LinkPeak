import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Link from "@/lib/db/models/Link";

export async function POST(req) {
    try {
        await connectDB();
        const { linkId } = await req.json();

        if (!linkId) {
            return new NextResponse("Link ID is required", { status: 400 });
        }

        const link = await Link.findByIdAndUpdate(
            linkId,
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!link) {
            return new NextResponse("Link not found", { status: 404 });
        }

        return NextResponse.json({ success: true, clicks: link.clicks });
    } catch (error) {
        console.error("LINK_CLICK_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
