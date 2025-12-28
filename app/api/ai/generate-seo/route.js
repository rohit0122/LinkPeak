import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Feature gating: PRO or AGENCY only
        if (user.plan === "FREE") {
            return NextResponse.json({
                success: false,
                error: "AI SEO tool requires a PRO or AGENCY plan."
            }, { status: 403 });
        }

        const { title, bio, slug } = await req.json();

        const { aiEngine } = await import("@/lib/ai");
        const prompt = `Generate catchy SEO metadata for a "Link in Bio" page.
        User Name: ${title}
        User Bio: ${bio}
        Slug: ${slug}
        
        Respond ONLY with a JSON object in this format:
        {
            "title": "Meta Title (max 60 chars)",
            "description": "Meta Description (max 160 chars)",
            "keywords": "comma, separated, keywords (max 10)"
        }`;

        const aiData = await aiEngine.generateContent(prompt, { json: true });

        if (aiData) {
            return NextResponse.json({
                success: true,
                data: aiData
            });
        }

        // --- MOCK FALLBACK LOGIC ---
        const suggestions = {
            title: `${title} | Professional Bio & Links`,
            description: `Connect with ${title} on LinkPeak. ${bio?.slice(0, 100)}... Check out all my official links and social media profiles in one place!`,
            keywords: `linkpeak, ${title?.toLowerCase()}, link in bio, ${slug}, social links, creator toolkit`
        };

        return NextResponse.json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
