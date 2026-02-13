// constants/config.js
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "LinkPeakK.";
export const CONFIG = {
    SITE_NAME: siteName,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://www.linkpeakk.com",
    SUPPORT_EMAIL: "connect@linkpeakk.com",
    SITE_SCREENSHOT: `${process.env.NEXT_PUBLIC_SITE_URL}/linkpeakk-home.webp`,
    DEFAULT_PROFILE_IMAGE: "/qr-logos/linkpeak-favicon.svg",

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
            customQR: false,
            planIdInDb: 1,
        },
        FREE: {
            links: 5,
            pages: 1,
            allowedTemplates: ["classic"],
            allowedThemes: ["light", "dark"],
            analyticsDays: 7,
            customQR: false,
            planIdInDb: 2,
        },
        PRO: {
            links: 1000,
            pages: 1,
            allowedTemplates: ["classic", "bento", "hero", "influencer", "sleek", "minimalist", "glassmorphism", "stack"],
            allowedThemes: ["light", "dark", "midnight", "aurora", "cyberglow", "hyperpop", "zenstone", "matcha", "nebula"],
            analyticsDays: 90,
            customQR: true,
            planIdInDb: 3,
        },
        AGENCY: {
            links: 1000,
            pages: 10,
            allowedTemplates: "ALL",
            allowedThemes: "ALL", // includes Velvet Gold and Royal Amethyst
            analyticsDays: 9999,
            customQR: true,
            planIdInDb: 4,
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
    PLAN_MESSAGES: {
        TITLE: (days) => days > 0 ? `${days} Days Remaining in Plan` : `Last Day of Access`,
        SUBTEXT: "To ensure your bio page stays live for your fans, please renew your plan. Days are added to your current balance.",
        CTA: "Renew Plan"
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
            `Forever Free — Your baseline bio page is always active. Start sharing and tracking clicks with zero commitment. Reverts here automatically if a paid plan expires.`,
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
            `Just ${CONFIG.PRICING.PRO.currency}${CONFIG.PRICING.PRO.price} for 30 days — get custom SEO titles, analytics, AI suggestions, and unlock more clicks & higher engagement. No auto-renewal.`,
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
            { name: "Enjoy a generous one-time 7-day free trial — no credit card required.", included: true },
        ],
    },
    {
        name: "Agency",
        price: CONFIG.PRICING.AGENCY.price,
        description:
            `Just ${CONFIG.PRICING.AGENCY.currency}${CONFIG.PRICING.AGENCY.price} for 30 days — get ${CONFIG.PLAN_LIMITS.AGENCY.pages} branded bio pages, lifetime analytics, white-labeling, AI-optimized SEO & titles, custom QR codes. No auto-renewal.`,
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
            { name: "Enjoy a generous one-time 7-day free trial — no credit card required.", included: true },
        ],
    },
];


export const pricingUSPs = [
    {
        icon: "🚀",
        title: "Pay Only When Active",
        description: "Use premium for 30 days. Plan expires manually. We never charge without permission.",
        color: "bg-primary/10"
    },
    {
        icon: "🔒",
        title: "Your Bio is Forever",
        description: "If you don't renew, your page simply reverts to Free tier. You never lose your data.",
        color: "bg-success/10"
    },
    {
        icon: "🧘",
        title: "Peace of Mind",
        description: "No auto-pay means absolute control. We never charge without your explicit permission.",
        color: "bg-warning/10"
    },
    {
        icon: "📧",
        title: "Gentle Reminders",
        description: "We'll notify you 7 days before your term ends. No sudden cut-offs, just a heads-up.",
        color: "bg-info/10"
    },
    {
        icon: "📚",
        title: "Early Renewals",
        description: "Renew anytime and your days are simply added. You never lose a single day.",
        color: "bg-secondary/10"
    },
    {
        icon: "🛠️",
        title: "Safety Net",
        description: "Expired plans simply shift to Free tier. No data loss. Your page stays live forever.",
        color: "bg-error/10"
    }
];

export const getPlanIdByName = (name) => {
    return CONFIG.PLAN_LIMITS[name]?.planIdInDb || 2; // FREE plan default
}