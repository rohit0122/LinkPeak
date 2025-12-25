🧠 AI AGENT INSTRUCTION — API CONSOLIDATION & PERFORMANCE OPTIMIZATION
Objective

Improve application performance by reducing redundant API calls and optimizing payload size, while maintaining full backward compatibility with existing UI and features.

Core Requirement (Must Follow Strictly)

You may merge multiple API calls into a single API endpoint only when they serve the same functional purpose (e.g., dashboard initialization).

However:

❌ Do NOT break existing routes

❌ Do NOT remove existing APIs

❌ Do NOT change existing response contracts

❌ Do NOT cause UI regressions

Allowed Optimization Strategy
1️⃣ Aggregated APIs (Preferred)

Create new aggregated endpoints such as:

GET /api/dashboard/init


This endpoint may internally call or aggregate:

user profile

subscription status

trial info

plan metadata

usage limits

Existing endpoints must remain intact and functional.

2️⃣ Field-Level Data Optimization

Fetch only the fields actually required by the UI.

Use MongoDB projections:

User.findById(id).select("name email plan trialEndsAt")


Never over-fetch large nested objects.

3️⃣ UI Handling Rules

UI must:

Gracefully handle partial data availability

Never assume all fields are present

Support both:

legacy multi-API flow

new aggregated API flow

4️⃣ Backward Compatibility Guarantee

Existing pages and features must continue working unchanged

Aggregated APIs must be opt-in, not forced

Rollout must be incremental and safe

5️⃣ MongoDB Safety Rules

No schema breaking changes

No destructive migrations

All new fields must be optional

Default values must be handled in code, not assumed in DB

Example Use Case

Before (current):

Dashboard reload triggers 5 API calls

After (optimized):

Dashboard reload triggers 1 aggregated API call

Existing APIs remain available as fallback

Non-Negotiable Rule

Performance optimization must never compromise data correctness, security, or UX stability.