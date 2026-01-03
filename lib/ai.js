/**
 * LinkPeakK. AI Engine
 * Implements a "Waterfall" strategy to maximize free tier rate limits
 * Logic: Gemini (15 RPM) -> Mistral (60 RPM) -> Mock
 */

import { CONFIG } from "@/constants/config";
import axios from "axios";

const MOCK_DELAY = 1500;

export const aiEngine = {
    /**
     * Generate content using the best available free provider
     */
    async generateContent(prompt, options = {}) {
        const { json = false } = options;

        // 1. Try Google Gemini (15 RPM)
        if (process.env.GEMINI_API_KEY) {
            try {
                const { data } = await axios.post(
                    `${CONFIG.AI_ENDPOINTS.GEMINI}?key=${process.env.GEMINI_API_KEY}`,
                    {
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            response_mime_type: json ? "application/json" : "text/plain"
                        }
                    },
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );

                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    const text = data.candidates[0].content.parts[0].text;
                    return json ? JSON.parse(text) : text;
                }
                console.warn("Gemini check failed (invalid format), moving to next provider...");
            } catch (err) {
                console.error("Gemini Error:", err.response?.data || err.message);
            }
        }

        // 2. Try Mistral AI (60 RPM - OpenAI Compatible)
        if (process.env.MISTRAL_API_KEY) {
            try {
                const { data } = await axios.post(
                    CONFIG.AI_ENDPOINTS.MISTRAL,
                    {
                        model: "mistral-small-latest",
                        messages: [{ role: "user", content: prompt }],
                        response_format: json ? { type: "json_object" } : { type: "text" }
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
                        }
                    }
                );

                if (data.choices?.[0]?.message?.content) {
                    const text = data.choices[0].message.content;
                    return json ? JSON.parse(text) : text;
                }
                console.warn("Mistral check failed (invalid format), falling back to mock...");
            } catch (err) {
                console.error("Mistral Error:", err.response?.data || err.message);
            }
        }

        // 3. Fallback to Mock Logic (Always works)
        await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
        return null; // Signals to the caller to use their specific mock logic
    }
};
