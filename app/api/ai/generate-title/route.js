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
                error: "AI Features require a PRO or AGENCY plan."
            }, { status: 403 });
        }

        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
        }

        const { aiEngine } = await import("@/lib/ai");
        const prompt = `Analyze this URL: "${url}".
        Return a JSON object with two fields:
        1. "brand": A short string identifying the platform, brand, or content type.
        2. "suggestions": An array of 3 distinct title options:
           - Option 1: Professional & Direct
           - Option 2: Creative & Engaging (with emoji)
           - Option 3: Minimal & Clean
        
        Example JSON:
        { 
            "brand": "GitHub", 
            "suggestions": [
                "My Professional GitHub Profile", 
                "Check out my Open Source Code 💻", 
                "My Code"
            ] 
        }`;

        const aiResponse = await aiEngine.generateContent(prompt, { json: true });

        console.log("AI Response:", aiResponse);

        // Handle both object (if parsed by aiEngine) or string
        let result = aiResponse;
        if (typeof aiResponse === 'string') {
            try {
                result = JSON.parse(aiResponse);
            } catch (e) {
                // Fallback if JSON parsing fails but we got text
                result = { suggestions: [aiResponse.replace(/[*_]/g, '').trim()], brand: "Link" };
            }
        }

        // Normalize response: Ensure suggestions array exists
        let suggestions = result.suggestions || [];
        if (!suggestions.length && result.title) {
            suggestions = [result.title];
        }

        if (suggestions.length > 0) {
            return NextResponse.json({
                success: true,
                data: {
                    suggestions: suggestions,
                    brand: result.brand || "Link"
                }
            });
        }

        // --- MOCK FALLBACK LOGIC ---
        // If we reach here, AI failed or returned empty results.
        const lowerUrl = url.toLowerCase();
        let fallbackSuggestions = ["Check out this link!"];
        let fallbackBrand = "Link";

        if (lowerUrl.includes("github")) {
            fallbackBrand = "GitHub";
            fallbackSuggestions = [
                "My Open Source Projects 💻",
                "Check out my Repositories",
                "Coding Portfolio"
            ];
        } else if (lowerUrl.includes("linkedin")) {
            fallbackBrand = "LinkedIn";
            fallbackSuggestions = [
                "My Professional Journey 🤝",
                "Connect with me on LinkedIn",
                "View my Resume & Experience"
            ];
        } else if (lowerUrl.includes("twitter") || lowerUrl.includes("x.com")) {
            fallbackBrand = "X (Twitter)";
            fallbackSuggestions = [
                "Join the Conversation on X 🐦",
                "Follow my Tweets",
                "My Thoughts & Updates"
            ];
        } else if (lowerUrl.includes("instagram")) {
            fallbackBrand = "Instagram";
            fallbackSuggestions = [
                "Follow My Daily Life 📸",
                "Check out my Photos",
                "My Visual Diary"
            ];
        } else if (lowerUrl.includes("youtube")) {
            fallbackBrand = "YouTube";
            fallbackSuggestions = [
                "Watch My Latest Videos 🎥",
                "Subscribe to my Channel",
                "My Video Content"
            ];
        } else if (lowerUrl.includes("spotify")) {
            fallbackBrand = "Spotify";
            fallbackSuggestions = [
                "My Ultimate Playlist 🎵",
                "Listen along with me",
                "My Music Rotation"
            ];
        } else if (lowerUrl.includes("discord")) {
            fallbackBrand = "Discord";
            fallbackSuggestions = [
                "Join My Community 🎮",
                "Chat with us on Discord",
                "My Server Invite"
            ];
        } else if (lowerUrl.includes("portfolio")) {
            fallbackBrand = "Portfolio";
            fallbackSuggestions = [
                "View My Creative Portfolio ✨",
                "My Selected Works",
                "Hire Me!"
            ];
        } else {
            fallbackBrand = "Website";
            fallbackSuggestions = [
                "Highly Recommended Link 🚀",
                "Visit this Page",
                "Check this out!"
            ];
        }

        return NextResponse.json({
            success: true,
            data: { suggestions: fallbackSuggestions, brand: fallbackBrand }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
