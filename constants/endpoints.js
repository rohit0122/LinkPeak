export const API_DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const API_PREFIX = "/api";

export const ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        ME: "/auth/me",
        VERIFY: "/auth/verify",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
        DELETE_ACCOUNT: "/auth/delete-account",
        LOGOUT: "/auth/logout",
    },
    DASHBOARD: {
        INIT: "/dashboard/init",
    },
    PAGES: "/pages",
    LINKS: "/links",
    ANALYTICS: {
        GET: "/analytics",
        CHARTS: "/analytics/charts",
    },
    ADMIN: {
        STATS: "/admin/stats",
        TICKETS: "/admin/tickets",
        USERS: "/admin/users",
    },
    PAYMENT: {
        SUBSCRIPTIONS: "/subscriptions",
        CREATE_PAYMENT_LINK: "/subscriptions/create-payment-link",
        CALLBACK: "/payment/callback",
    },
    SUPPORT: {
        CREATE: "/support",
        REPLY: (id) => `/support/${id}/reply`,
    },
    USER: {
        SUSPEND: "/user/suspend",
    },
    DEBUG: {
        EXPORT_EMAILS: "/debug/export-emails",
    },
    AI: {
        GENERATE_TITLE: "/ai/generate-title",
        GENERATE_SEO: "/ai/generate-seo",
    },
    NEWSLETTER: {
        SUBSCRIBE: "/newsletter/subscribe",
    },
    CONTACT: "/contact",
    UPLOAD: {
        PROFILE: "/upload/profile",
    },
    TRACK: {
        VIEW: "/track/view",
        LIKE: "/track/like",
        CLICK: "/track/click",
    }
};