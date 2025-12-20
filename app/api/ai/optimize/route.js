import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import Link from "@/lib/db/models/Link";
import BioPage from "@/lib/db/models/BioPage";
import { optimizeLinkTitles } from "@/lib/ai-helper";

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { pageId } = await req.json();
        if (!pageId) return new NextResponse("Missing pageId", { status: 400 });

        await connectDB();

        // Verify ownership
        const page = await BioPage.findOne({ _id: pageId, ownerId: userId });
        if (!page) return new NextResponse("Forbidden", { status: 403 });

        const links = await Link.find({ pageId });

        // Call AI helper - using the existing optimizeLinkTitles for parity
        const optimizedLinks = await optimizeLinkTitles(links);

        // Return titles for local state update
        return NextResponse.json({
            reorderedLinks: optimizedLinks.map(l => l.title),
            links: optimizedLinks
        });
    } catch (error) {
        console.error("[AI_OPTIMIZE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
