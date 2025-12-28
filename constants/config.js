// constants/config.js
export const CONFIG = {
    SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "LinkPeak",
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    SUPPORT_EMAIL: process.env.NODEMAILER_USER_SENDER || "support@linkpeak.com",

    // Pricing Configuration (Monthly)
    PRICING: {
        FREE: { price: 0, currency: "$", label: "Free" },
        PRO: { price: 9, currency: "$", label: "Pro" },
        AGENCY: { price: 49, currency: "$", label: "Agency" }
    },

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
        { id: "shape", name: "Peak", url: "/qr-logos/linkpeak-qr-logo.svg" },
        { id: "fire", name: "Fire", url: "/qr-logos/fire-emoji.svg" },
        { id: "rocket", name: "Rocket", url: "/qr-logos/rocket-emoji.svg" },
        { id: "star", name: "Star", url: "/qr-logos/star-qr-icon.svg" },
        { id: "heart", name: "Heart", url: "/qr-logos/heart-qr-icon.svg" },
        { id: "gem", name: "Diamond", url: "/qr-logos/diamond-emoji.svg" },
        { id: "crown", name: "Crown", url: "/qr-logos/crown-emoji.svg" },
        { id: "zap", name: "Zap", url: "/qr-logos/bolt-qr-icon.svg" }
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
