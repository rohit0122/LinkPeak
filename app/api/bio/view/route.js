import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import BioPage from "@/lib/db/models/BioPage";

export async function POST(req) {
    try {
        const { slug } = await req.json();
        if (!slug) return new NextResponse("Missing slug", { status: 400 });

        await connectDB();

        // Atomically increment views
        const updated = await BioPage.findOneAndUpdate(
            { slug: slug.toLowerCase() },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!updated) return new NextResponse("Not Found", { status: 404 });

        return NextResponse.json({ success: true, views: updated.views });
    } catch (error) {
        console.error("BIO_VIEW_ERROR:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
