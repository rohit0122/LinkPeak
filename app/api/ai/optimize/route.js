import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/db/connect";
import Link from "@/lib/db/models/Link";
import BioPage from "@/lib/db/models/BioPage";
import { optimizeLinkTitles } from "@/lib/ai-helper";

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = payload.userId;

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
