import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Link from "@/lib/db/models/Link";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        await connectDB();

        // Increment QR clicks
        const link = await Link.findByIdAndUpdate(
            id,
            { $inc: { qrClicks: 1 } },
            { new: true }
        );

        if (!link) {
            return new NextResponse("Link not found", { status: 404 });
        }

        // Redirect to the actual URL
        return NextResponse.redirect(link.url);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
