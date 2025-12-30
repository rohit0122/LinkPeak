# LinkPeak Master Blueprint & AI Agent Prompt

This document serves as the **Single Source of Truth** for recreating the LinkPeak application. It details the core logic, data structures, and architectural patterns required to build a fully functional clone without glitches or functional gaps.

---

## 1. System Vision & Business Logic

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

## 2. Schema Blueprint (Database Agnostic)

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
- `views`, `likes`: Counters.
- `seo`: Object `{ title, description, keywords }`.
- `branding`: Object `{ removeWatermark: bool, customText, customUrl }`.

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

## 3. The Engine Room (Core Logic)

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

---

## 4. Technical Guardrails

### API Standards
- **Standard Envelope**: All responses MUST follow `{ success: boolean, data?: object, error?: string }`.
- **Stateless Verification**: Use JWT (HttpOnly cookies) for authentication.
- **Validation**: Strict schema validation on every POST/PATCH request (e.g., Zod).

### Security
- **Rate Limiting**: Apply separate limits for Authentication (5 per min) vs. Tracking (60 per min).
- **Ownership Verification**: Every repository method that modifies data MUST accept a `userId` and check it against the document ownership before proceeding.

---

## 5. Workflow Map & User Journey

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

## 6. Setup & Configuration

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

---

## 7. UI Architecture & Page Roadmap

### A. Core Providers & Layout
- **Root Layout**: MUST include `AuthProvider` (session), `StoreProvider` (Redux), and `LoadingProvider`.
- **Global Loader**: A full-screen overlay controlled via `window.setGlobalLoading(true/false)` to ensure user patience during transitions.
- **Theme Engine**: Implement a "Design Token" system (e.g., using Vanilla CSS or a library like DaisyUI) so that the user's `BioPage.theme` choice propagates instantly.

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

---

## 8. Asset & Image Management

### Public vs. Private Assets
- **Standard Storage**: Logic should be compatible with S3 (AWS/DigitalOcean) or Local Disk.
- **The "Anti-Flicker" Cache**:
    - **Concept**: To ensure user-uploaded profile images load instantly, implement a **Client-Side Hash Cache**.
    - **Logic**: Store the image as a `base64` Data-URI in `localStorage` keyed by `{userId}_{imageHash}`.
    - **Flow**: UI checks cache first -> If not found, fetches from CDN/Server and populates cache -> On image update, server sends a new hash, forcing the client to re-fetch and re-cache.

---

## 9. AI Prompt Library (The Secret Sauce)

To ensure high-quality AI features, use these exact prompt structures with any LLM (Gemini, Mistral, GPT):

### A. SEO Metadata Generator
> "Acting as an SEO expert, analyzed this Bio Page title: '{title}' and bio description: '{bio}'. Generate a valid JSON object containing: 1. 'title' (max 60 chars), 2. 'description' (max 160 chars), 3. 'keywords' (comma-separated string). Ensure it is optimized for Google ranking."

### B. Link Title Refiner
> "Given the URL '{url}', suggest a catchy, conversion-focused title (max 40 chars) for a link-in-bio page. Return ONLY the title string."

---

## 10. Production Integrity & Longevity

### Branded Communication
- **System Emails**: Use a table-based, inline-styled HTML layout for maximum client compatibility (Branded Purple: `#6D28D9`).
- **Required Templates**:
    - Welcome (with Getting Started links)
    - Verification
    - Suspension Notice (with Payment link)
    - Trial Expiry Reminders (7 days, 3 days, 1 day)

### Monitoring & Resilience
- **Waterfall AI Strategy**: If Provider A (Gemini) hits a rate limit, automatically failover to Provider B (Mistral). If both fail, return a generic mock response to prevent site crashes.
- **Error Boundaries**: Wrap critical dashboard sections in Error Boundaries to allow users to "Save & Refresh" if a background fetch fails.
- **Soft Suspension**: When a user is suspended, do NOT delete their data. Redirect to a `/suspended` page with an urgent "Re-activate" CTA.

---
