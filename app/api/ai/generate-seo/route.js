import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function POST(req) {
    try {
        const currentUser = await getAuthUser();
        if (!currentUser) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Feature gating: PRO or AGENCY only
        if (currentUser.plan === "FREE") {
            return NextResponse.json({
                success: false,
                error: "AI SEO tool requires a PRO or AGENCY plan."
            }, { status: 403 });
        }

        const { title, bio, slug } = await req.json();

        const { aiEngine } = await import("@/lib/ai");
        const prompt = `Act as an expert SEO Strategist & Copywriter. Your goal is to generate high-converting, click-worthy metadata for a "Link in Bio" page.
        
        CONTEXT:
        - Page Name: "${title}"
        - Bio/Description: "${bio}"
        - URL Slug: "${slug}"

        TASK:
        Generate minimal, professional, and engaging SEO metadata that drives clicks.
        
        RULES:
        1. Title: Must be catchy, include the brand name, and feel premium (max 60 chars).
        2. Description: compelling summary that encourages users to click. Use active voice. (max 160 chars).
        3. Keywords: 10 highly relevant, high-traffic keywords separated by commas.
        4. Output format: STRICT JSON.

        Refine the copy to be "Human-written" and avoid generic AI phrases like "Unlock your potential".

        Respond ONLY with this JSON structure:
        {
            "title": "Compelling Title Here",
            "description": "Engaging description that drives clicks...",
            "keywords": "keyword1, keyword2, keyword3..."
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
