# LinkPeak SaaS Build: Logic & Feature Implementation Roadmap

## 1. Project Context (Pre-Installed)
* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS 4.0 + DaisyUI (Existing Config)
* **Icons:** React-Icons
* **Target:** Production-ready RBAC Link-in-Bio platform.

---

## 2. Feature Implementation: Sign-Up & RBAC Flow
The core objective is to bridge your existing Auth (Clerk) with a Plan-based Role system.

### A. Pricing-Driven Onboarding
* **Pricing Component:** Create `components/pricing/PricingCards.jsx` using existing DaisyUI `card` and `badge` classes.
* **Logic:** When a user selects a plan, redirect to `/sign-up?role=PRO_USER`. 
* **Metadata Sync:** Use a Clerk Webhook or the `afterSignUp` flow to inject the `role` into `user.publicMetadata`.

### B. RBAC Logic (Role-Based Access Control)
Implement a permission matrix within your existing structure:
* **`FREE_USER`**: Access to `/dashboard/links` (limit 5).
* **`PRO_USER`**: Access to AI Optimizer + Analytics.
* **`ADMIN_USER`**: Access to Team Management + Priority Support.

---

## 3. High-Priority Component Checklist (Using Existing Plugins)
Build these using the already configured DaisyUI and Tailwind 4:

1.  **Dashboard Shell (`app/(dashboard)/layout.jsx`)**:
    * Use DaisyUI `drawer` for navigation.
    * Display a `RoleBadge` in the navbar using `react-icons`.

2.  **Live Preview Mockup (`components/dashboard/Preview.jsx`)**:
    * Use DaisyUI `mockup-phone` to show a real-time preview of the public bio page.

3.  **The AI Link Optimizer (`app/api/ai/optimize/route.js`)**:
    * Check for `role === 'PRO_USER'` before processing.
    * Integrate OpenAI to suggest link titles and reordering based on CTR.

4.  **Public Bio Page (`app/[slug]/page.jsx`)**:
    * Utilize Tailwind 4 `@theme` variables for user-defined link colors.
    * Implement **Glassmorphism** using DaisyUI `glass` class.

---

## 4. Logical File Structure (Building on Existing)
*Ensure no new core installations occur; only create the following logic files:*

```text
linkpeak/
├── app/
│   ├── (auth)/
│   │   └── sign-up/page.jsx       # Capture ?role= from URL
│   ├── (dashboard)/
│   │   ├── links/page.jsx         # CRUD with "Max Link" check for Free tier
│   │   └── ai-tools/page.jsx      # Role-gated AI feature
│   └── [slug]/page.jsx            # The dynamic public bio
├── components/
│   ├── pricing/
│   │   └── PricingCards.jsx       # DaisyUI cards for plan selection
│   ├── dashboard/
│   │   └── RoleGate.jsx           # Higher-Order Component to protect features
│   └── bio/
│       └── BioCard.jsx            # Uses react-icons for social links
├── lib/
│   ├── roles.js                   # Object mapping roles to permissions
│   └── ai-helper.js               # Logic for GPT-4o-mini
└── middleware.ts                  # Route protection based on Clerk Metadata


# LinkPeak: Production-Ready SaaS Implementation Guide

## 1. Executive Summary
LinkPeak is a high-performance Link-in-Bio platform. This document outlines the end-to-end logic for user onboarding, plan-based Role-Based Access Control (RBAC), and the AI-driven dashboard.

---

## 2. Database Schema (Mongoose)
Define the core models in `lib/db/models/`.

### User Schema
* `clerkId`: String (Unique)
* `role`: Enum ['FREE', 'PRO', 'BIZ'] (Default: 'FREE')
* `slug`: String (Unique) - The public URL handle.
* `planStatus`: Enum ['active', 'past_due', 'canceled']

### Link Schema
* `userId`: ObjectId (Ref: User)
* `title`: String
* `url`: String
* `icon`: String (React-Icon identifier)
* `isPriority`: Boolean (Pro/Biz Feature)
* `analytics`: { clicks: Number, uniqueViews: Number }

---

## 3. RBAC & Pricing Flow Implementation

### Step 1: Pricing to Sign-Up
In `app/(marketing)/pricing/page.jsx`, implement DaisyUI cards.
* **Action:** Buttons link to `/sign-up?plan=pro` or `/sign-up?plan=biz`.
* **Visuals:** Use `className="card bg-base-200 shadow-xl border-primary"`.

### Step 2: Auth Webhook (Clerk + Route)
Create `app/api/webhooks/clerk/route.js` to handle `user.created`.
* **Logic:** Extract the `plan` from the referral metadata.
* **Action:** Update Clerk User `publicMetadata` using `clerkClient.users.updateUserMetadata`.
    ```javascript
    publicMetadata: { role: 'PRO_USER', maxLinks: 100 }
    ```

### Step 3: Global Role Protection
Create `components/dashboard/RoleGate.jsx`.
* **Function:** Wraps premium components. If `user.role` is insufficient, render a DaisyUI "Upgrade" alert or a locked-state UI with a `react-icons` lock icon.

---

## 4. Feature Implementation Details

### A. The Link Editor (Dashboard)
* **Path:** `app/(dashboard)/links/page.jsx`
* **Restriction:** If `links.length >= 5` and `role === 'FREE'`, disable the "Add Link" button and show a DaisyUI `toast` warning.
* **UI:** Use DaisyUI `mockup-phone` on the right side of the screen for live-previewing changes using a local state mirror.

### B. AI Link Optimizer (Pro/Biz)
* **Path:** `app/api/ai/optimize/route.js`
* **Logic:** Use `OpenAI` SDK (GPT-4o-mini). Pass the current link array. Ask AI to suggest "Higher CTR Titles" and "Optimal Sorting Order."
* **Security:** Verify user role in the API route before executing the AI call to prevent API credit abuse.

### C. Smart QR System
* **Component:** `components/dashboard/QRGenerator.jsx`
* **Library:** `qrcode.react`.
* **Logic:** * Free: Standard Black/White QR.
    * Pro+: Custom colors (DaisyUI color picker).
    * Biz: Emoji center-overlay enabled.

---

## 5. Styling Standards (Tailwind 4 + DaisyUI)
* **Buttons:** Always use `btn btn-primary`, `btn btn-outline`, etc.
* **Theming:** Implement theme switching in `layout.jsx` using DaisyUI's `data-theme` attribute.
* **Icons:** * UI Elements: `Hi2` (Hero Icons).
    * Social Brand Icons: `Si` (Simple Icons).
    * Navigation: `Ri` (Remix Icons).

---

## 6. Deployment & Performance Requirements
1.  **Partial Prerendering (PPR):** Enable in `next.config.js` for the `[slug]` route to ensure the public bio page loads in under 200ms.
2.  **Streaming:** Use React 19 `<Suspense>` for the Analytics dashboard to show DaisyUI `skeleton` loaders while data fetches.
3.  **SEO:** Dynamic metadata generation in `app/[slug]/page.jsx` based on the user's profile data.

---

## 7. Operational Checklist
- [ ] Connect Stripe Webhook to update `role` metadata on successful payment.
- [ ] Implement `middleware.ts` to redirect `FREE` users away from `/dashboard/analytics/pro`.
- [ ] Build the dynamic `[slug]` page with Tailwind 4 Glassmorphism (`backdrop-blur-md`).
- [ ] Ensure all `react-icons` are imported from sub-libraries to maintain small bundle sizes.