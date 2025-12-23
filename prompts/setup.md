# [BRAND_NAME] Production SaaS Master Specification

## 1. Project Manifesto & Global Identity
**Objective:** Build a commercial-grade, mobile-first, high-conversion Link-in-Bio SaaS.
**Branding Philosophy:** All identity strings, limits, and settings **must** be imported from the Global Configuration to allow for one-click rebranding.
**Single Source of Truth:** `@/constants/config.js`

---

## 2. Technical Stack
* **Framework:** Next.js 16.0.0 (App Router)
* **Styling:** Tailwind CSS 4.0 + DaisyUI 5.0 (Latest)
* **Icons:** `react-icons` exclusively
* **Database:** MongoDB Atlas (Mongoose with Singleton Pattern)
* **Auth:** In-House JWT (`jose`) + HttpOnly Cookies (No 3rd party providers like Clerk/Auth0)
* **Email:** Nodemailer with custom HTML transaction templates
* **Analytics:** Recharts for graphical data representation
* **QR Engine:** `qrcode.react` with PNG export capability
* **Build Target:** Optimized for Vercel Serverless

---

## 3. Global Configuration (`/constants/config.js`)
```javascript
export const CONFIG = {
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "LinkPeak",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  SUPPORT_EMAIL: process.env.NODEMAILER_USER_SENDER || "support@linkpeak.com",
  PLAN_LIMITS: {
    FREE: { links: 5, pages: 1, templates: 1, themes: ["light", "dark"], analyticsDays: 7, customQR: false },
    PRO: { links: 1000, pages: 1, templates: 3, themes: "ALL", analyticsDays: 90, customQR: true },
    AGENCY: { links: 1000, pages: 10, templates: 5, themes: "ALL", analyticsDays: 9999, customQR: true }
  },
  DAISY_THEMES: ["light", "dark", "cupcake", "luxury", "dracula", "retro", "cyberpunk", "aqua"],
  SUPPORT_CATEGORIES: ["Billing", "Technical", "Feedback", "General"]
};