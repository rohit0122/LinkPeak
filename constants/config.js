// constants/config.js
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LinkPeakK.";
export const CONFIG = {
    SITE_NAME: siteName,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://www.linkpeakk.com",
    SUPPORT_EMAIL: "connect@linkpeakk.com",
    SITE_SCREENSHOT: `${process.env.NEXT_PUBLIC_SITE_URL}/linkpeakk-home.webp`,

    METATAGS: {
        title: `${siteName} | Premium Link in Bio Platform for Creators, Brands & Professionals`,
        description: `Create a high-converting, AI-powered link-in-bio page with ${siteName}. Perfect for TikTok, Instagram, YouTube creators & brands. Get real-time analytics, AI-optimized SEO, and customizable templates - all in one powerful link.`,
        keywords: [
            // Core link in bio keywords
            "link in bio", "link in bio tool", "link in bio platform",

            // Platform-specific (what competitors rank for)
            "link in bio for TikTok", "link in bio for Instagram",
            "link in bio for YouTube", "link in bio for Twitter",
            "TikTok link in bio", "Instagram link in bio",
            "YouTube link in bio", "Twitter link in bio",

            // AI-powered (YOUR USP)
            "AI link in bio", "AI-powered link in bio",
            "link in bio with AI", "smart link in bio",
            "AI SEO link in bio", "AI bio page generator",

            // Analytics-focused (YOUR USP)
            "link in bio with analytics", "link in bio analytics",
            "link in bio tracking", "real-time link analytics",
            "link in bio insights", "bio page analytics",

            // Target audience
            "link in bio for creators", "link in bio for influencers",
            "link in bio for brands", "link in bio for businesses",
            "link in bio for entrepreneurs", "link in bio for professionals",

            // Feature-based
            "customizable link in bio", "free link in bio",
            "link in bio with QR code", "branded link in bio",
            "link in bio templates", "link in bio themes"
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
        SUBTEXT: "Your trial is active! Secure your analytics and keep your bio live beyond the next 7 days.",
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
    },
    STATS: {
        CREATORS: "500+"
    }
};


export const pricingPlans = [
    {
        name: "Free",
        price: CONFIG.PRICING.FREE.price,
        description:
            `Absolutely Free — create your first bio page, share links, and start tracking basic click stats — no payment needed, perfect for getting started right away.`,
        popular: false,
        features: [
            { name: `${CONFIG.PLAN_LIMITS.FREE.pages} Bio Page`, included: true },
            { name: `${CONFIG.PLAN_LIMITS.FREE.allowedTemplates.length} Template (Classic)`, included: true },
            { name: `${CONFIG.PLAN_LIMITS.FREE.links} Links`, included: true },
            { name: `${CONFIG.PLAN_LIMITS.FREE.analyticsDays} Days Analytics`, included: true },
            { name: "Basic QR Code", included: true },
            { name: "Standard Themes", included: true },
            { name: "AI Features", included: false },
            { name: "Custom QR Code (Logo)", included: false },
        ],
    },
    {
        name: "Pro",
        price: CONFIG.PRICING.PRO.price,
        description:
            `Just ${CONFIG.PRICING.PRO.currency}${CONFIG.PRICING.PRO.price}/month — get custom SEO titles, analytics, AI suggestions, and unlock more clicks & higher engagement.`,
        popular: true,
        features: [
            { name: `${CONFIG.PLAN_LIMITS.PRO.pages} Bio Page`, included: true },
            { name: `${CONFIG.PLAN_LIMITS.PRO.allowedTemplates.length} Designer Templates`, included: true },
            { name: "Unlimited Links", included: true },
            { name: `${CONFIG.PLAN_LIMITS.PRO.analyticsDays} Days Analytics`, included: true },
            { name: "Custom QR Code (Logo, Color)", included: true },
            { name: `${CONFIG.PLAN_LIMITS.PRO.allowedThemes.length}+ Identity Themes`, included: true },
            { name: "AI Link Title Suggestions", included: true },
            { name: "AI SEO Optimization", included: true },
            { name: "Enjoy a generous 7-day free trial — no credit card required.", included: true },
        ],
    },
    {
        name: "Agency",
        price: CONFIG.PRICING.AGENCY.price,
        description:
            `Just ${CONFIG.PRICING.AGENCY.currency}${CONFIG.PRICING.AGENCY.price}/month — get ${CONFIG.PLAN_LIMITS.AGENCY.pages} branded bio pages, lifetime analytics, white-labeling, AI-optimized SEO & titles, custom QR codes, and manage multiple clients effortlessly with one dashboard.`,
        popular: false,
        features: [
            { name: `${CONFIG.PLAN_LIMITS.AGENCY.pages} Bio Pages`, included: true },
            { name: "All Premium Templates", included: true },
            { name: "Unlimited Links", included: true },
            { name: "Lifetime Analytics", included: true },
            { name: "Custom QR Code (Logo, Color)", included: true },
            { name: "All 12+ Premium Themes", included: true },
            { name: "AI Enhanced Bio Page SEO & Titles", included: true },
            { name: "White Labeling", included: true },
            { name: "Enjoy a generous 7-day free trial — no credit card required.", included: true },
        ],
    },
];
