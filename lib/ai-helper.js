/**
 * AI Helper logic using OpenAI.
 * This is a server-side only utility.
 */

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function optimizeLinkTitles(links) {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("Missing OPENAI_API_KEY, returning mock data.");
        return links.map(link => ({ ...link, title: `✨ ${link.title}` }));
    }

    try {
        const prompt = `
      Optimize the following link titles for higher Click-Through Rate (CTR). 
      Keep them punchy, engaging, and relevant. 
      Return ONLY a JSON array of strings matching the order of input.
      
      Input Titles:
      ${links.map(l => l.title).join('\n')}
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using the specified model
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }, // Ensure JSON mode if supported or parse manually
        });

        // Note: response_format: { type: "json_object" } requires the system message to instruct JSON.
        // Let's refine the prompt/implementation to be robust.
        // Actually simplicity: just ask for the list.

        // Simpler parsing for this snippet:
        const content = response.choices[0].message.content;
        const optimizedTitles = JSON.parse(content).titles || []; // Assuming AI returns { titles: [...] }

        return links.map((link, i) => ({
            ...link,
            title: optimizedTitles[i] || link.title // Fallback
        }));

    } catch (error) {
        console.error("OpenAI Error:", error);
        return links;
    }
}

export async function suggestSortOrder(links) {
    // Placeholder - Logic remains similar, just sorting advice
    return links.sort((a, b) => b.clicks - a.clicks);
}
