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
                error: "AI Features require a PRO or AGENCY plan."
            }, { status: 403 });
        }

        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
        }

        const { aiEngine } = await import("@/lib/ai");
        const prompt = `Generate a short, catchy, and professional link title (max 4-5 words) for this URL: ${url}. 
        Identify the brand or content type. Add one relevant emoji at the end.
        Example Output: "My Instagram 📸" or "Latest Tech Blog 💻"`;

        const aiTitle = await aiEngine.generateContent(prompt);

        if (aiTitle) {
            return NextResponse.json({
                success: true,
                data: { title: aiTitle.replace(/"/g, '').trim() }
            });
        }

        // --- MOCK FALLBACK LOGIC ---
        let title = "Check out this link!";
        const lowerUrl = url.toLowerCase();

        if (lowerUrl.includes("github")) title = "My Open Source Projects 💻";
        else if (lowerUrl.includes("linkedin")) title = "My Professional Journey 🤝";
        else if (lowerUrl.includes("twitter") || lowerUrl.includes("x.com")) title = "Join the Conversation on X 🐦";
        else if (lowerUrl.includes("instagram")) title = "Follow My Daily Life 📸";
        else if (lowerUrl.includes("youtube")) title = "Watch My Latest Videos 🎥";
        else if (lowerUrl.includes("spotify")) title = "My Ultimate Playlist 🎵";
        else if (lowerUrl.includes("discord")) title = "Join My Community 🎮";
        else if (lowerUrl.includes("portfolio")) title = "View My Creative Portfolio ✨";
        else title = "Highly Recommended Link 🚀";

        return NextResponse.json({
            success: true,
            data: { title }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
