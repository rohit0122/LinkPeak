// constants/config.js
export const CONFIG = {
    SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "LinkPeak",
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    SUPPORT_EMAIL: process.env.NODEMAILER_USER_SENDER || "support@linkpeak.com",

    // RBAC & Plan Limits
    PLAN_LIMITS: {
        DEMO: { links: 5, pages: 1, allowedTemplates: ["classic"], themes: "ALL", analyticsDays: 7, customQR: false },
        FREE: { links: 5, pages: 1, allowedTemplates: ["classic"], themes: ["light", "dark"], analyticsDays: 7, customQR: false },
        PRO: { links: 1000, pages: 1, allowedTemplates: ["classic", "grid", "hero"], themes: "ALL", analyticsDays: 90, customQR: true },
        AGENCY: { links: 1000, pages: 10, allowedTemplates: "ALL", themes: "ALL", analyticsDays: 9999, customQR: true }
    },
    // UI Settings
    DAISY_THEMES: [
        /* "light", "dark", "cupcake", "luxury", "dracula",
         "retro", "cyberpunk", "aqua", "synthwave"*/
        "light",      // Standard
        "dark",       // Night Mode
        "cupcake",    // Soft/Creative
        "luxury",     // High-end/Business
        "cyberpunk",  // Gaming/Tech
        "retro",      // Vintage/Indie
        "aqua",       // Travel/Nature
        "dracula",    // Developer/Pro
        "valentine",  // Fashion/Beauty
        "coffee",     // Warm/Professional
        "synthwave",  // High-Tech/Analytics
        "forest"      // Natural/Wellness
    ],

    SUPPORT_CATEGORIES: ["Billing", "Technical", "Feedback", "General"],

    // Emoji Picker Data
    COMMON_EMOJIS: [
        { name: "Social", emojis: ["📱", "💬", "📷", "🎥", "🐦", "🎵", "👾", "💼", "💻", "📧", "🔗", "📶"] },
        { name: "Success", emojis: ["💰", "📈", "🚀", "💎", "🤝", "💡", "📅", "📍", "🏢", "⚖️", "🛠️", "🎯"] },
        { name: "Life", emojis: ["🎨", "🎭", "🎬", "🎤", "🎧", "✨", "🔥", "🌈", "🍕", "🥂", "🎁", "🏆"] },
        { name: "System", emojis: ["⭐", "💖", "✅", "🔋", "🔔", "🛒", "🎟️", "📦", "🏷️", "📢", "🛡️", "⚙️"] }
    ],

    // QR Logo Choices (Premium SVGs)
    QR_LOGOS: [
        { id: "none", name: "None", url: "" },
        { id: "shape", name: "Peak", url: "https://api.dicebear.com/7.x/shapes/svg?seed=LinkPeak" },
        { id: "fire", name: "Fire", url: "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/1F525.svg" },
        { id: "rocket", name: "Rocket", url: "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/1F680.svg" },
        { id: "star", name: "Star", url: "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/2B50.svg" },
        { id: "heart", name: "Heart", url: "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/2764.svg" },
        { id: "gem", name: "Diamond", url: "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/1F48E.svg" },
        { id: "crown", name: "Crown", url: "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/1F451.svg" },
        { id: "zap", name: "Zap", url: "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/26A1.svg" }
    ],

    TRIAL_MESSAGES: {
        TITLE: (hours) => `${hours} Hours of Peak Access Remaining`,
        SUBTEXT: "Your trial is active! Secure your analytics and keep your bio live beyond the next 24 hours.",
        CTA: "Secure My Pro Access"
    },
    SUBSCRIPTION_MESSAGES: {
        TITLE: (days) => days > 0 ? `${days} Days Remaining in Plan` : `Last Day of Subscription`,
        SUBTEXT: "To ensure your bio page stays live for your fans, please renew your plan.",
        CTA: "Renew Subscription"
    }
};
