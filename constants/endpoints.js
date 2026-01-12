// Frontend URL (Next.js App)
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
// Backend URL (Laravel API)
export const BACKEND_URL =
  process.env.LARAVEL_BACKEND_URL || "http://localhost:8000";

// Frontend API Prefix
export const API_PREFIX = "/api";

// 1. Frontend Endpoints (UI -> Next.js API Proxy)
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    VERIFY: "/auth/verify",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    LOGOUT: "/auth/logout",
  },
  AI: {
    GENERATE_LINK_TITLE: "/ai/generate-title",
    GENERATE_SEO: `/ai/generate-seo`,
  },
  DASHBOARD: {
    INIT: "/dashboard/init",
  },
  PAGES: "/pages",
  PAGES_BY_ID: (id) => `/pages/${id}`,
  LINKS: "/links",
  ANALYTICS: {
    GET: "/analytics",
    CHARTS: "/analytics/charts",
  },
  ADMIN: {
    STATS: "/admin/stats",
    USERS: "/admin/users",
    SUSPEND_USER: "/admin/user/suspend",
    TICKETS: "/admin/tickets",
  },
  TRACK: {
    VIEW: "/track/view",
    LIKE: "/track/like",
    CLICK: "/track/click",
  },
  PUBLIC: {
    GET_PAGE: (slug) => `/public/pages/${slug}`,
    LEADS: "/public/leads",
    QR_CODE: (id) => `/public/pages/${id}/qrcode`,
  },
  SETTINGS: {
    PROFILE: "/settings/profile",
    PASSWORD: "/settings/password",
  },
  SUPPORT: {
    TICKETS: "/support",
    BY_ID: (id) => `/support/${id}`,
    REPLY: (id) => `/support/${id}/reply`,
  },
  LEADS: (pageId) => `/pages/${pageId}/leads`,
  SUBSCRIPTION: {
    CHANGE_PLAN: `/subscriptions/change-plan`,
  }
};

// 2. Backend Endpoints (Next.js API Proxy -> Laravel API)
// These are absolute URLs to the Laravel Backend
export const BACKEND_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BACKEND_URL}/api/v1/auth/login`,
    REGISTER: `${BACKEND_URL}/api/v1/auth/register`,
    VERIFY: `${BACKEND_URL}/api/v1/auth/verify`,
    FORGOT_PASSWORD: `${BACKEND_URL}/api/v1/auth/forgot-password`,
    RESET_PASSWORD: `${BACKEND_URL}/api/v1/auth/reset-password`,
    LOGOUT: `${BACKEND_URL}/api/v1/auth/logout`,
    ME: `${BACKEND_URL}/api/v1/auth/me`, // If applicable
  },
  PUBLIC: {
    GET_PAGE: (slug) => `${BACKEND_URL}/api/v1/public/pages/${slug}`,
    LEADS: `${BACKEND_URL}/api/v1/public/leads`,
    QR_CODE: (id) => `${BACKEND_URL}/api/v1/public/pages/${id}/qrcode`,
  },
  TRACK: {
    VIEW: `${BACKEND_URL}/api/v1/track/view`,
    CLICK: `${BACKEND_URL}/api/v1/track/click`,
    LIKE: `${BACKEND_URL}/api/v1/track/like`,
  },
  AI: {
    GENERATE_LINK_TITLE: `${BACKEND_URL}/api/v1/ai/generate-link-title`,
    GENERATE_SEO: `${BACKEND_URL}/api/v1/ai/generate-seo`,
  },
  DASHBOARD: {
    INIT: `${BACKEND_URL}/api/v1/dashboard/init`,
  },
  PAGES: {
    BASE: `${BACKEND_URL}/api/v1/pages`,
    BY_ID: (id) => `${BACKEND_URL}/api/v1/pages/${id}`,
  },
  LINKS: {
    BASE: `${BACKEND_URL}/api/v1/links`,
    BY_ID: (id) => `${BACKEND_URL}/api/v1/links/${id}`,
    BULK_REORDER: `${BACKEND_URL}/api/v1/links/bulk-reorder`,
  },
  ANALYTICS: {
    STATS: `${BACKEND_URL}/api/v1/analytics`,
    CHARTS: `${BACKEND_URL}/api/v1/analytics/charts`,
  },
  LEADS: (pageId) => `${BACKEND_URL}/api/v1/pages/${pageId}/leads`,
  SETTINGS: {
    PROFILE: `${BACKEND_URL}/api/v1/settings/profile`,
    PASSWORD: `${BACKEND_URL}/api/v1/settings/password`,
    AVATAR: `${BACKEND_URL}/api/v1/settings/avatar`,
  },
  ADMIN: {
    STATS: `${BACKEND_URL}/api/v1/admin/stats`,
    USERS: `${BACKEND_URL}/api/v1/admin/users`,
    SUSPEND: `${BACKEND_URL}/api/v1/admin/user/suspend`,
    TICKETS: `${BACKEND_URL}/api/v1/admin/tickets`,
    TICKET_BY_ID: (id) => `${BACKEND_URL}/api/v1/admin/tickets/${id}`,
  },
  SUPPORT: {
    BASE: `${BACKEND_URL}/api/v1/tickets`,
    BY_ID: (id) => `${BACKEND_URL}/api/v1/tickets/${id}`,
    REPLY: (id) => `${BACKEND_URL}/api/v1/tickets/${id}/reply`,
  },
  SUBSCRIPTION: {
    CHANGE_PLAN: `${BACKEND_URL}/api/v1/subscriptions/select-plan`,
  }
};
