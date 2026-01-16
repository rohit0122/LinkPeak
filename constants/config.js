// constants/config.js
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LinkPeakK.";
export const CONFIG = {
    SITE_NAME: siteName,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://www.linkpeakk.com",
    SUPPORT_EMAIL: "connect@linkpeakk.com",

    METATAGS: {
        title: `${siteName} | Premium Link in Bio Platform for Creators, Brands & Professionals`,
        description: `Create a high-converting, fully customizable link-in-bio page with ${siteName} Designed for creators, entrepreneurs, and brands to showcase links, products, and profiles with one powerful link.`,
        keywords: [
            "Link in bio", "Link in bio tool", "Link in bio platform", "Link in bio for creators", "Link in bio for brands", "Link in bio for professionals", "Link in bio for entrepreneurs", "Link in bio for influencers", "Link in bio for businesses", "Link in bio for marketing",
        ],
    },
    // Pricing Configuration (Monthly)
    PRICING: {
        FREE: { price: 0, currency: "$", label: "Free" },
        PRO: { price: 9, currency: "$", label: "Pro" },
        AGENCY: { price: 49, currency: "$", label: "Agency" }
    },

    // RBAC & Plan Limits
    PLAN_LIMITS: {
        DEMO: {
            links: 5,
            pages: 1,
            allowedTemplates: ["classic"],
            allowedThemes: "ALL",
            analyticsDays: 7,
            customQR: false
        },
        FREE: {
            links: 5,
            pages: 1,
            allowedTemplates: ["classic"],
            allowedThemes: ["light", "dark"],
            analyticsDays: 7,
            customQR: false
        },
        PRO: {
            links: 1000,
            pages: 1,
            allowedTemplates: ["classic", "bento", "hero", "influencer", "sleek", "minimalist", "glassmorphism", "stack"],
            allowedThemes: ["light", "dark", "midnight", "aurora", "cyberglow", "hyperpop", "zenstone", "matcha", "nebula"],
            analyticsDays: 90,
            customQR: true
        },
        AGENCY: {
            links: 1000,
            pages: 10,
            allowedTemplates: "ALL",
            allowedThemes: "ALL", // includes Velvet Gold and Royal Amethyst
            analyticsDays: 9999,
            customQR: true
        }
    },
    // UI Settings
    DAISY_THEMES: [
        { id: "light", label: "Pure Light" },
        { id: "dark", label: "Onyx Night" },
        { id: "midnight", label: "Midnight Noir" }, // (Pro)
        { id: "aurora", label: "Aurora Prism" }, // (Pro)
        { id: "cyberglow", label: "Cyber Glow" }, // (Pro)
        { id: "matcha", label: "Matcha Brew" }, // (Pro)
        { id: "nebula", label: "Cosmic Nebula" }, // (Pro)
        { id: "hyperpop", label: "Hyper Pop" }, // (Pro)
        { id: "zenstone", label: "Zen Stone" }, // (Pro)
        { id: "royal", label: "Royal Amethyst" }, // (Agency)
        { id: "velvetgold", label: "Velvet Gold" }, // (Agency)
        { id: "oasis", label: "Desert Oasis" }, // (Agency)
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
        { id: "favicon", name: "LinkPeakk", url: "/qr-logos/linkpeak-favicon.svg" },
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
    },

    // AI API Endpoints
    AI_ENDPOINTS: {
        GEMINI: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
        MISTRAL: "https://api.mistral.ai/v1/chat/completions"
    }
};
