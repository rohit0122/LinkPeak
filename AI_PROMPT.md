# LinkPeak Master Blueprint & AI Agent Prompt

This document serves as the **Single Source of Truth** for recreating the LinkPeak application. It details the core logic, data structures, and architectural patterns required to build a fully functional clone without glitches or functional gaps.

---

## 1. Foundation: API-First Philosophy & Stack Portability

To build a production-grade, bulletproof system, the following architectural rule is MANDATORY:
- **API as Single Source of Truth**: The Backend/API owns 100% of the business logic, state resolution, and validation.
- **Dumb UI Layer**: The Frontend/UI is strictly for **view and interaction**. It should never calculate sensitive values.
- **Stateless interactions**: The UI passes a JWT token; the API resolves the user context.

> [!NOTE]
> **Stack Versatility**: This blueprint is written in **Logical Architecture** language. While the reference implementation uses Next.js, the logic is 100% portable to:
> - **Backend**: Laravel, Node.js, Django, or Go (The "API is King" principle).
> - **Database**: MySQL, PostgreSQL (using JSON columns or standard Joins), or MongoDB.
> - **Frontend**: Vue.js, React, Nuxt, or mobile apps (The "Dumb UI" principle).

---

## 2. System Vision & Business Logic

### High-Level Goal
LinkPeak is a premium "Link in Bio" platform that allows creators to build high-converting, customizable bio pages. It prioritizes **data accuracy, visual excellence, and zero-flicker UI updates.**

### Core Business Rules
- **Trial Period**: Every new user gets a 24-hour Pro trial (no credit card required) upon registration.
- **Plan Gating**:
    - **FREE**: 1 Page, 5 Links, 1 Template (Classic), Limited Themes, 7-day Analytics.
    - **PRO**: 1 Page, Unlimited Links, 3 Templates, All Themes, 90-day Analytics, Custom QR, Branded.
    - **AGENCY**: 10 Pages, Unlimited Links, All Templates, All Themes, Lifetime Analytics, Custom QR, White-labeling.
- **Account Suspension**: Users with expired trials are marked as `isActive: false`. Public pages remain visible, but dashboard access is blocked until payment reactivates the account.

---

## 3. Schema Blueprint (Database Agnostic)

### User Entity
- `name`: String, required.
- `email`: String, unique, lowercase.
- `password`: String (Hashed).
- `role`: "user" | "admin".
- `isVerified`: Boolean (Token-based).
- `plan`: "FREE" | "PRO" | "AGENCY".
- `planExpiresAt`: Date.
- `isActive`: Boolean (For trial expiry/suspension).

### BioPage Entity
- `userId`: Reference to User.
- `slug`: String, unique (URL identifier).
- `title`, `bio`: Strings.
- `theme`: String (e.g., "cupcake", "dracula" - refers to a design token).
- `template`: "classic" | "grid" | "hero" | "social" | "modern".
- `socialLinks`: Object containing platform strings (Instagram, Twitter, LinkedIn, GitHub, etc.).
- `views`, `likes`: Counters.
- `seo`: Object `{ title, description, keywords }`.
- `branding`: 
    - `removeWatermark`: Boolean (PRO/AGENCY only).
    - `customText`, `customUrl`: Optional branded footer override.

### Link Entity
- `userId`, `pageId`: References.
- `title`, `url`, `icon`: Required strings.
- `order`: Integer (For drag-and-drop sorting).
- `isActive`: Boolean.
- `clicks`: Counter.

### Analytics Entity (Daily Aggregates)
- **Granularity**: One record per `pageId` per `Date` (UTC midnight).
- **Structure**:
    - `date`: Date (Unique with pageId).
    - `views`, `clicks`, `likes`: Daily sums.
    - `linkStats`: Array of `{ linkId, clicks, views }`.

### Subscription & Payment (Secondary)
- **Subscription**: Tracks `planId`, `status` (trial/active/scheduled), and `endDate`.
- **PaymentLink**: Tracks provider (Razorpay/Mock), `amount`, `expiresAt`, and `status`.

---

## 4. The Engine Room (Core Logic)

### A. Subscription & Trial Engine
- **Trial Activation**: On sign-up, set `User.plan = "PRO"` and `User.planExpiresAt = now + 24 hours`.
- **Scheduled Activation**: If a user pays for an upgrade while a trial is active, create a `Subscription` with `status: "scheduled"` and `startDate: trialExpiry`. 
- **Auto-Promotion Logic**:
    - During Login or Dashboard Init, run `activateScheduledSubscriptions`.
    - Find any "scheduled" subscription where `startDate <= now`.
    - Update user's plan to the new plan and set `status: "active"`.
- **Gatekeeping**: Check `User.plan` and `User.planExpiresAt` globally. If expired and no active subscription, set `User.isActive = false`.

### B. Analytics & Tracking Engine
- **Atomic Operations**: Use `$inc` (atomic increment) to record Views and Clicks. Never read-then-write to avoid race conditions.
- **Data Partitioning**: Store data in daily records (`Analytics` collection) to prevent massive document growth.
- **Relationship Tracking**: 
    - `pageViews`: Recorded on `BioPage` (Lifetime) and `Analytics` (Daily).
    - `linkClicks`: Recorded on `Link` (Lifetime) and nested within `Analytics.linkStats` (Daily).

### C. Sync & Anti-Flicker Engine (Dashboard)
- **Problem**: UI flickering or data reverting after an auto-save due to background re-fetching.
- **Solution**:
    - Use Redux/RTK-Query with **Tags** (e.g., `Page`, `Link`) for automatic re-fetching.
    - **Anti-Flicker Timing**: When a save occurs, track `lastSaveTime`. Ignore background re-fetches for ~2 seconds after a save to allow the server state to stabilize and local UI state to remain leading.
    - **Global Loader**: Use a persistent global loader (accessible via `window.setGlobalLoading`) for all async operations to give consistent feedback.

### D. Payment Reconciliation Engine (The Checkout Flow)
- **Problem**: Ensuring the user's plan is upgraded ONLY after a verified payment.
- **Logic**: 
    1.  **Intent**: User clicks upgrade -> API creates a `PaymentLink` (status: "pending").
    2.  **Payment**: Interaction with Razorpay (Production) or Simulation API (Mock).
    3.  **Webhook/Callback**: On success, the API finds the `PaymentLink` by ID.
    4.  **Promotion**: 
        - If `User.planExpiresAt > now`, create `Subscription` with `status: "scheduled"`.
        - If `User.planExpiresAt <= now`, update `User.plan` immediately and set `isActive: true`.
    5.  **Sync**: The Dashboard MUST perform a hard re-fetch of the `user` state after the payment modal closes to ensure the UI reflects the new plan instantly.

---

## 5. Technical Guardrails

### API Standards
- **Standard Envelope**: All responses MUST follow `{ success: boolean, data?: object, error?: string }`.
- **Stateless Verification**: Use JWT (HttpOnly cookies) for authentication.
- **Validation**: Strict schema validation on every POST/PATCH request (e.g., Zod).

### Security
- **Rate Limiting**: Apply separate limits for Authentication (5 per min) vs. Tracking (60 per min).
- **Ownership Verification**: Every repository method that modifies data MUST accept a `userId` and check it against the document ownership before proceeding.

---

## 6. Workflow Map & User Journey

### Phase 1: The First 24 Hours
1. **Landing**: User arrives, sees value prop.
2. **Registration**: User signs up. Logic: `User.plan = "PRO"`, `isActive = true`, `planExpiresAt = +24h`.
3. **Onboarding**: User creates their first slug (slug availability check required).
4. **Customization**: User adds links (atomic create), chooses theme (state update), and selects template.

### Phase 2: The Decision Point (Trial Expiry)
1. **Notification**: At 23 hours, UI shows "Trial ending soon".
2. **Expiry**: At 24 hours, `now > planExpiresAt`. Dashboard sets `window.setGlobalLoading` and redirects to "Suspended" or "Upgrade" view.
3. **Upgrade Path**:
    - User selects "PRO" monthly ($9).
    - API creates `PaymentLink`.
    - User pays (Webhook or Mock Success).
    - Logic: Update `User.plan = "PRO"`, `isActive = true`, `planExpiresAt = +30 days`.

### Phase 3: Long-term Operations
1. **Analytics**: Real-time tracking of every view/click via `/api/track`.
2. **SEO**: AI generates metadata on-demand via Gemini/Mistral.
3. **Re-engagement**: Newsletter captures emails for marketing updates.

---

## 7. Setup & Configuration

### Required Environment Variables
- `MONGODB_URI`: Connection string.
- `JWT_SECRET`: For auth tokens.
- `ADMIN_EMAIL`: recipient for contact notifications.
- `NEXT_PUBLIC_APP_URL`: Base URL for links.
- `SMTP_USER`, `SMTP_PASS`, `SMTP_HOST`: For system emails (Verify, Reset, Suspension).
- `GEMINI_API_KEY`: For SEO/Content AI features.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: For production payments.

### Deployment Precautions
- **Database Indexing**: Ensure unique indexes on `User.email`, `BioPage.slug`, and composite index on `Analytics {pageId, date}`.
- **Middleware**: Implement a global auth check for `/dashboard` and `/admin` routes.
- **CSRF/Security**: Use HttpOnly, Secure cookies for JWT storage.
- **Styling Stack**: Mandate **Tailwind CSS v4** for utility-first styling and **DaisyUI v5** for component theming.

---

## 8. Security & Entitlements (RBAC)

### A. Config-Driven RBAC
The system MUST use a central configuration file (e.g., `PLAN_LIMITS`) to define entitlements for each role/plan. This allows for instant updates to business rules without changing code logic.
- **Key Config Structure**:
    - `FREE`: `{ links: 5, themes: ["light", "dark"], analyticsDays: 7 }`
    - `PRO`: `{ links: 1000, themes: "ALL", analyticsDays: 90, customQR: true }`
- **Validation Rule**: Every write operation (Create Link, Change Theme) MUST check the user's current usage against these limits in the backend repository.

### B. API-Driven Feature Gating
The UI should NEVER hardcode feature visibility. Instead:
1.  **Server-Side Auth**: The Login/Dashboard API returns the user's `plan` and `isActive` status.
2.  **Client-Side Check**: UI components (e.g., `FeatureGate`) compare the user's plan against the `PLAN_LIMITS` config to determine if a button is clickable or if an "Upgrade" overlay is shown.
3.  **The "Suspend" Trigger**: If `isActive: false`, the system blocks the entire `/dashboard` regardless of the route, forcing a redirect to the payment/suspension view.

---

## 9. UI Architecture & Page Roadmap

### A. Core Providers & Layout
- **Root Layout**: MUST include `AuthProvider` (session), `StoreProvider` (Redux), and `LoadingProvider`.
- **Global Loader**: A full-screen overlay controlled via `window.setGlobalLoading(true/false)` to ensure user patience during transitions.
- **Theme Engine**: Implement a "Design Token" system using **Tailwind CSS v4** and **DaisyUI v5**. The user's `BioPage.theme` choice must propagate instantly via the `data-theme` attribute.

### B. Essential Page Roadmap
#### 1. Marketing & Public
- **Landing (`/`)**: Hero section, features, and social proof.
- **Pricing (`/pricing`)**: Detailed plan comparison and "Upgrade" triggers.
- **Bio Page (`/[slug]`)**: The high-performance public view. MUST avoid heavy JS to ensure fast load times.

#### 2. Authentication
- **Register/Login**: Forms with validation (Zod) and standardized error handling.
- **Verification (`/verify`)**: Token-based email validation.
- **Forgot/Reset Password**: Secure flow via signed tokens.

#### 3. Dashboard (Authenticated)
- **Home (`/dashboard`)**: Summary stats and active page selection.
- **Links (`/dashboard/links`)**: Drag-and-drop link management with atomic saves.
- **Appearance (`/dashboard/appearance`)**: Real-time theme and template selection.
- **Analytics (`/dashboard/analytics`)**: Time-series charts and per-link performance.
- **Settings**: Profile management and subscription status.

#### 4. Admin (Privileged)
- **Stats (`/admin/stats`)**: Global health metrics (Total users, Revenue, Trial conversions).

### C. Signature UI Patterns
- **The "Live Preview"**: A mobile-frame component on the right side of the dashboard that re-renders instantly as the user modifies their links or theme.
- **QR Generation**: A modal that generates QR codes with brand-matching colors and custom logos for Pro users.
- **Skeleton States**: Used during data re-fetching to prevent layout shifts.

### D. Iconography & Dynamic Theming Guide
To ensure visual consistency, the system MUST follow these implementation rules:

1.  **Icon Library**: Standardize on `react-icons` (specifically the Remix Icons collection `/ri`).
2.  **Social Icon Mapping**: 
    - The UI must map platform strings (e.g., "instagram") to specific components (e.g., `RiInstagramFill`).
    - Every social link should use its brand's official hex color for the icon (e.g., YouTube: `#FF0000`, Instagram: Gradient/`#E1306C`).
3.  **Theme Injection**: 
    - The `BioPage.theme` string from the database MUST be applied as a `data-theme` attribute to the root container of the bio page.
    - Example: `<div data-theme={page.theme} className="min-h-screen">`.
    - This allows for instant, no-JS theme propagation using a CSS framework like DaisyUI.

---

## 10. Asset & Image Management

### Public vs. Private Assets
- **Standard Storage**: Logic should be compatible with S3 (AWS/DigitalOcean) or Local Disk.
- **The "Anti-Flicker" Cache**:
    - **Concept**: To ensure user-uploaded profile images load instantly, implement a **Client-Side Hash Cache**.
    - **Compression**: All user-uploaded images MUST be compressed/resized on the client-side (e.g., max 800px width, WebP format) before upload to optimize storage costs and load speed.
    - **Logic**: Store the image as a `base64` Data-URI in `localStorage` keyed by `{userId}_{imageHash}`.
    - **Flow**: UI checks cache first -> If not found, fetches from CDN/Server and populates cache -> On image update, server sends a new hash, forcing the client to re-fetch and re-cache.

---

## 11. AI Prompt Library (The Secret Sauce)

To ensure high-quality AI features, use these exact prompt structures with any LLM (Gemini, Mistral, GPT):

### A. SEO Metadata Generator
> "Acting as an SEO expert, analyzed this Bio Page title: '{title}' and bio description: '{bio}'. Generate a valid JSON object containing: 1. 'title' (max 60 chars), 2. 'description' (max 160 chars), 3. 'keywords' (comma-separated string). Ensure it is optimized for Google ranking."

### B. Link Title Refiner
> "Given the URL '{url}', suggest a catchy, conversion-focused title (max 40 chars) for a link-in-bio page. Return ONLY the title string."

---

## 12. Production Integrity & Longevity

### B. Email Automation & Lifecycle Triggers
A production-grade system MUST handle the following lifecycle emails automatically:

1.  **Onboarding**:
    - `welcome`: Triggered on sign-up. Includes the 24h trial confirmation.
    - `verification`: Triggered on sign-up/email-change. Contains a signed token link.
2.  **Account Retention (The Reminder Logic)**:
    - **Trigger**: Run a daily cron/background job to check `planExpiresAt`.
    - **7-Day Reminder**: "Plan expiring in a week."
    - **3-Day Reminder (Urgent)**: Switch template color to Red (`#DC2626`).
    - **1-Day Reminder (Final)**: Urgent CTA to prevent suspension.
3.  **Security & Support**:
    - `reset-password`: Triggered on "Forgot Password" request.
    - `password-changed`: Confirmation after successful reset.
    - `contact-receipt`: Auto-reply to the user when they submit a support ticket.
4.  **Suspension**:
    - `suspension-active`: Sent the moment `isActive` is set to `false`. MUST include a direct link to the checkout/re-activation page.

---

### C. Waterfall AI Strategy (Durable Intelligence)
To prevent "AI downtime," the system MUST implement this specific chain:
1.  **Primary**: Request data from **Gemini 1.5 Flash** (high speed, cost-effective).
2.  **Failover**: If Gemini returns a 429 (Rate Limit) or 500, automatically switch to **Mistral 7B/Large**.
3.  **Sanitized Fallback**: If all AI providers fail, use a **Rule-Based Mock Generator** (e.g., extracting keywords from the URL) to return a "Good Enough" result instead of an error.

---

## 13. UI/UX Excellence & Content Compliance

### A. Responsive Web Design (RWD) Standards
A production-grade system MUST be mobile-first and fluid:
- **Breakpoint Strategy**: Optimization for 375px (Mobile), 768px (Tablet), and 1440px (Desktop).
- **Typography**: Use fluid scaling (e.g., `clamp()`) and professional font pairs (e.g., Outfit for headings, Jakarta for body).
- **Touch-Targets**: Every interactive element must be at least 44x44px for accessibility.

### B. Professional Copywriting & Compliance
- **Legal Content**: The application MUST include furnished pages for:
    - **Privacy Policy**: Detailing data collection (Analytics, Newsletter).
    - **Terms of Service**: Outlining plan usage and refund policies.
    - **Cookie Consent**: A persistent banner with explicit "Accept/Reject" logic recorded in local state.
- **Copy Checklist**: 
    - Landing page content must be conversion-focused (Action-driven headlines).
    - Error messages must be "Human-Centric" (e.g., "We couldn't find that slug, want to try another?" instead of "404 Not Found").

### C. Performance & Accessibility (WCAG)
- **Contrast**: Maintain a ratio of at least 4.5:1 for all text.
- **Semantic HTML**: Use `<main>`, `<article>`, `<nav>`, and `<footer` tags correctly to ensure screen reader compatibility.
- **Image Optimization**: Use WebP format and lazy-loading for all public-facing assets to achieve a 90+ Lighthouse score.

---

## 14. SEO & Social Growth Strategy (Social Intelligence)

### A. Dynamic OpenGraph (OG) Metadata
- **Rule**: Every public bio page MUST generate dynamic metadata based on the current user's profile and SEO settings.
- **Logic**: 
    - Title: Use `BioPage.seo.title` -> Fallback to `BioPage.title` + `SiteName`.
    - Images: Use `BioPage.profileImage` -> Fallback to a branded default banner.
- **Validation**: Test slugs using "Social Debuggers" (Facebook/Twitter) to ensure images and descriptions unfurl correctly.

### B. Discoverability & Indexing
- **Sitemaps**: Automatically generate a `/sitemap.xml` containing all public, active, and indexed bio slugs.
- **Robots mapping**: Ensure `/dashboard`, `/api`, and `/admin` are explicitly disallowed in `robots.txt`.
- **JSON-LD**: Inject a "Profile" schema (schema.org) on every public bio page to help search engines understand the creator's identity and primary links.

---

## 15. Scaling, Testing & CI/CD (The Production Checklist)

### A. High-Traffic Scaling
- **Edge Caching**: For public bio pages (`/[slug]`), implement a 60-second SWR (Stale-While-Revalidate) cache at the CDN/Edge level.
- **Database Optimization**: Ensure composite indexes on frequently filtered fields (e.g., `Links {pageId: 1, isActive: 1, order: 1}`).
- **Static vs Dynamic**: Pre-render a static "Empty State" or "Not Found" page to reduce server load during bot-driven crawls.

### B. The Quality Assurance (Testing) Blueprint
A "Production Grade" system MUST pass these tests:
- **Unit (Logic)**: Verify Subscription activation dates and Plan limit calculations.
- **Integration (API)**: Ensure all endpoints return the `{ success, data, error }` envelope.
- **E2E (User Journey)**: Verify the full "Register -> Create Link -> Pay -> View Public Page" flow using Playwright/Cypress.

### C. CI/CD & Monitoring
- **Automatic Deploys**: Use GitHub Actions or GitLab CI to run linting and tests on every "Pre-Merge" request to the main branch.
- **Monitoring**: Integrate a service (e.g., Sentry) to catch real-time logical errors and frontend crashes before users report them.
- **Daily Backups**: Ensure the database has a point-in-time recovery (PITR) strategy for at least 7 days.

---

## 16. Operational Admin Suite (The Control Tower)

A production clone MUST include a hidden or privileged-access dashboard for administrators to manage the site health and user base.

### A. Core Admin Roadmap
- **Dashboard Summary (`/admin/stats`)**:
    - Real-time counters: Total Users, Pro Users, Revenue (Daily/MTD), Total Links.
- **User Management (`/admin/users`)**:
    - Search by Email/Slug.
    - Actions: `Suspend User` (set `isActive: false`), `Force Verify Email`, `Change Plan Manually`.
- **Subscription Tracker (`/admin/subscriptions`)**:
    - List of all active PaymentLinks and their statuses.
- **Support Inbox (`/admin/support`)**:
    - View and reply to `SupportTicket` entities.
- **Newsletter Center (`/admin/newsletter`)**:
    - Broadcast tool to send emails to all verified `NewsletterUser` records.

### B. Admin Safety Guardrails
- **Role-Based Protection**: All `/admin` routes and `/api/admin` endpoints MUST use the `role === "admin"` check.
- **Audit Logging**: Any manual change to a user's subscription or status should ideally be logged for security.

---

## 17. System Seeding & Initial Data

To ensure the UI is functional immediately upon deployment, the system MUST be seeded with the following metadata:

### A. Theme Metadata
- **Standard Themes**: Light, Dark, Cupcake, Emerald, Corporate, Retro, Cyberpunk, Valentine, Luxury, Dracula, Coffee.
- **Logic**: These IDs mapping directly to CSS design tokens or a framework like DaisyUI.

### B. Asset Metadata
- **QR Logos**: Seed a library of SVGs (e.g., Fire, Rocket, Star, Heart, Gem, Zap) that users can embed in their QR codes.
- **Emoji Sets**: Group emojis into categories (Social, Success, Life, System) for the link editor's quick-select tool.

### C. Default Content
- **New Page**: When a user creates their first page, it should prepopulate with:
    - **Title**: "[Full Name] | Creator & Architect"
    - **Bio**: "Welcome to my official bio page! Check out my links and social profiles below. 👇"
    - **Theme**: "light" (standard) or "cupcake" (premium Soft & Sweet).
    - **Demo Link Set**:
        1. "Visit My Website" (https://example.com)
        2. "Connect on LinkedIn" (https://linkedin.com)
        3. "Follow My Journey" (https://twitter.com)
    - **Social Icon Strip**: Initializing with placeholder icons for Instagram and Twitter.
    - **SEO Metadata**: 
        - Title: "[Full Name] | LinkPeak Profile"
        - Description: "Explore the links, projects, and social profiles of [Full Name]."

### D. System Admin Account (The Control User)
For testing and initial review, the system should expect a pre-initialized Admin account:
- **Email**: `admin@linkpeakk.com`
- **Role**: `admin`
- **Password**: `password`
- **Initial State**: Access to the `/admin` stats dashboard and the ability to suspend/verify other demo users.

---

## 18. Enterprise Security & Reliability

For production-grade deployments, the system MUST implement these architectural hardening rules:

### A. Data Atomicity (The Transaction Rule)
- **Rule**: Any operation that modifies multiple collections/entities (e.g., Payment -> Subscription -> User) MUST be wrapped in a **Database Transaction**.
- **Failure Mode**: If any part of the chain fails, all changes MUST be rolled back to prevent "orphan" payments or "free access" glitches.

### B. Content Security & Sanitization
- **XSS Prevention**: All user-generated content (Link titles, Bio text) MUST be sanitized using a library (e.g., DOMPurify or server-side equivalent) before being rendered in the public UI.
- **CSP Headers**: The system MUST implement a strict **Content Security Policy (CSP)** that restricts script execution to trusted domains and disallows inline styles/scripts where possible.

### C. Network Protection
- **CORS Policy**: Restrict API access to the specific APP_URL and allowed subdomains. 
- **CSRF Protection**: For state-changing operations, use a combination of **HttpOnly/Secure/SameSite:Strict** cookies and custom request headers (e.g., `X-Requested-With`) to prevent cross-site request forgery.

---

## 19. Observability & Operational Excellence

A Senior Architect prioritizes "The Golden Signals" to maintain 99.9% uptime.

### A. The Golden Signals (Monitoring)
The system MUST expose metrics or logs for:
1.  **Latency**: Time to resolve public bio pages.
2.  **Traffic**: Request rates for `/api/track` (to detect bot swarms).
3.  **Errors**: 5xx and 4xx spikes (using Sentry or structured logs).
4.  **Saturation**: Database connection pool usage and CPU memory ceilings.

### B. Health & Heartbeat
- **Rule**: Implement a `/api/health` endpoint that performs a "Deep Check" (verifies DB connection, AI provider connectivity, and SMTP readiness).
- **Graceful Declusion**: If an AI provider is down, the health check should report a "Degraded" state rather than a total failure.

---

## 20. API Governance & Lifecycle

### A. Versioning Strategy
- **Rule**: All API endpoints MUST be prefixed with a version (e.g., `/api/v1/...`).
- **Breaking Changes**: Do NOT modify existing response structures. Create `/v2/` for breaking changes and maintain `/v1/` for at least 6 months of deprecation.

### B. Documentation standard
- **OpenAPI/Swagger**: Maintain an updated OpenAPI 3.0 specification. The code MUST serve as the spec’s source of truth (via JSDoc or similar) to ensure the documentation never drifts from reality.

---

## 21. Architect’s Closing Statement

This blueprint represents a **Production-Grade, Scalable, and Secure** system. It is designed to survive real-world traffic, malicious actors, and technical debt. When building from this prompt, prioritize **System Integrity** over "Speed to Feature." 

**"Code is temporary, but Architecture is forever."**

---
