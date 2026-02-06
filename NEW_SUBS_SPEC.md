# Subscription System Specification (v1.0)

This document is the authoritative source of truth for the LinkPeak subscription system. It defines the API contract, state machine logic, and failure recovery protocols.

## 1. System Overview

### Architecture

The system follows a **Local-First / Direct-Control** architecture. Razorpay is used solely as a payment processor and event emitter. The Laravel database is the **only** source of truth for user access.

- **Backend:** Laravel 11.x (PHP 8.2+)
- **Frontend:** Next.js (with Zustand for state management, daisyui, tailwindcss and other npm packages, refer to frontend codebase for details)
- **Processor:** Razorpay Subscriptions
- **Core Principle:** Access is determined by local `subscriptions.status`, which is updated strictly through an idempotent Finite State Machine (FSM).

### State Machine (FSM)

All transitions must pass through `SubscriptionService::transitionState()`.

```ascii
       [ Start ]
           |
           v
    +--------------+
    |     free     | <-------------------------+
    +--------------+                           |
           | (createTrial/selectPlan)          |
           v                                   |
    +--------------+                           | (downgrade)
    |   pending    |                           |
    +--------------+                           |
           | (webhook: authenticated/activated)|
           v                                   |
    +--------------+      (webhook: charged)   |
    |    trial     | --------------------------+
    +--------------+                           |
           | (webhook: charged)                |
           v                                   |
    +--------------+                           |
    |    active    | --------------------------+
    +--------------+                           |
           | (webhook: halted/expired)         |
           v                                   |
    +--------------+                           |
    |   expired    | --------------------------+
    +--------------+                           |
           | (manual/webhook: cancelled)       |
    +--------------+                           |
    |  cancelled   | --------------------------+
    +--------------+
```

---

## 2. Subscription States

The system handles multiple paid tiers (**PRO**, **AGENCY**) and free tiers (**FREE**, **DEMO**) generically. The logic is based on `plan.price` rather than hardcoded names.

| State         | Description                                                    | Entry Condition                             | Access Level                          |
| ------------- | -------------------------------------------------------------- | ------------------------------------------- | ------------------------------------- |
| **free**      | Default state for all new users.                               | Account creation or downgrade.              | Limited (5 links, 1 page)             |
| **pending**   | User has clicked "Upgrade" but payment not confirmed.          | `POST /subscriptions/select-plan`           | Current active tier access            |
| **trial**     | User is in their 7-day free trial for a paid plan.             | Razorpay `subscription.activated` webhook.  | Selected Paid Tier (PRO/AGENCY)       |
| **active**    | Recurring payment successful for a paid plan.                  | Razorpay `subscription.charged` webhook.    | Selected Paid Tier (PRO/AGENCY)       |
| **expired**   | Payment failed or trial ended without card.                    | Razorpay `subscription.halted` or Cron job. | Downgraded to Free                    |
| **cancelled** | User explicitly cancelled. Access remains until end of period. | `POST /subscriptions/cancel` or Webhook.    | Selected Paid Tier (Until period end) |

---

## 3. User Journeys

### A. Free → Trial → Active (Standard Flow)

1. User calls `/subscriptions/select-plan` for either **PRO** or **AGENCY**. State: `pending`.
2. User completes checkout (Razorpay checkout).
3. Webhook `subscription.activated` arrives. State transitions `pending` → `trial`.
4. After 7 days, payment is charged. Webhook `subscription.charged` arrives. State transitions `trial` → `active`.

### B. Upgrade / Change Flow (e.g., Pro → Agency or Monthly → Yearly)

The system supports seamless switching between paid tiers:

1. User calls `/subscriptions/select-plan` with any different Plan ID.
2. System identifies existing `active` subscription.
3. System calls Razorpay to **cancel** the old sub immediately and transitions local status to `cancelled` (reason: `upgrade_to_plan_X`).
4. New `pending` subscription created for the new plan. User completes checkout for the new tier.

### C. Active → Cancelled → Free (Churn Flow)

1. User clicks "Cancel Subscription". Calls `/subscriptions/cancel`.
2. Local state transitions to `cancelled`. `current_period_end` remains in DB.
3. User retains access to **PRO/AGENCY** features until `current_period_end`.
4. Cron job checks expired cancellations and downgrades user to `free` status.

---

## 4. API Endpoints (Contract)

### [POST] /api/v1/subscriptions/select-plan

- **Auth:** Required
- **Summary:** Initiates the upgrade flow.
- **Request:** `{ "plan_id": 2 }`
- **Response (200):** `{ "success": true, "data": { "razorpay_subscription_id": "sub_123", "key": "rzp_test_..." } }`
- **Allowed States:** `free`, `expired`, `cancelled`, `active` (Upgrade flow).
- **Error (422):** Already on this plan.

### [POST] /api/v1/subscriptions/verify

- **Auth:** Required
- **Summary:** Optional client-side verification to speed up UI.
- **Request:** `{ "razorpay_payment_id": "pay_...", "razorpay_signature": "..." }`
- **Logic:** Verifies signature but does **NOT** update status to `active`. Only webhooks do that.
- **Response (200):** `{ "success": true, "message": "Signature verified, waiting for processing." }`

### [GET] /api/v1/subscriptions/status

- **Auth:** Required
- **Response:** `{ "status": "active", "plan": "PRO", "trial_ends_at": null, "current_period_end": "2026-03-06" }`

### [POST] /api/v1/subscriptions/sync-status

- **Auth:** Required
- **Summary:** Manual fallback if webhooks are delayed. Calls Razorpay API to poll current status.

---

## 5. Webhooks

**Endpoint:** `POST /api/v1/payment/callback`
**Middleware:** `razorpay.webhook` (Rate limiting + Secret verification)

| Event                    | Logic                                  | Resulting State                      |
| ------------------------ | -------------------------------------- | ------------------------------------ |
| `subscription.activated` | Verify event_id is new.                | `trial` (if start_at > current time) |
| `subscription.charged`   | Update Billing Dates + Record Payment. | `active`                             |
| `subscription.halted`    | Stop access due to repeated failures.  | `expired`                            |
| `subscription.cancelled` | Mark for final removal.                | `cancelled`                          |

---

## 6. Frontend Rules

| State         | UI Header/Banner         | Action Buttons      | Restricted Features           |
| ------------- | ------------------------ | ------------------- | ----------------------------- |
| **free**      | "Go Pro" button visible. | Upgrade enabled.    | Disabled after limit reached. |
| **pending**   | "Completing payment..."  | Upgrade disabled.   | Free tier limits apply.       |
| **trial**     | "7 days left in trial"   | Cancel enabled.     | All features unlocked.        |
| **active**    | "Subscription Active"    | Cancel enabled.     | All features unlocked.        |
| **expired**   | "Plan Expired - Renew"   | Re-upgrade enabled. | Blocked (Read-only).          |
| **cancelled** | "Ends on [Date]"         | Resume enabled.     | Unlocked until Date.          |

---

## 7. Failure Scenarios (Critical)

### Duplicate Webhook

- **Behavior:** `webhook_logs` has unique index on `event_id`.
- **Reaction:** `WebhookService` catches `QueryException`, logs "Skipping duplicate", and returns `200 OK`. No state change occurs.

### Delayed Webhook

- **Behavior:** User stays in `pending` state.
- **Reaction:** Frontend shows "Payment processing...". User can click "Sync Status" button which calls `/subscriptions/sync-status` (Backend polls Razorpay).

### Lost Webhook (Idempotency Check)

- **Behavior:** State doesn't change.
- **Reaction:** Recurring Cron job checks all `pending` subscriptions > 1 hour old and calls Razorpay API to verify their status.

### Server Crash During Webhook

- **Behavior:** Webhook record in `webhook_logs` remains with status `processing` or `failed`.
- **Recovery:** A dedicated cron job `ProcessFailedWebhooks` retries these records with exponential backoff every 10 mins.

---

## 8. Invariants (Must Never Break)

1. **Local First:** If Razorpay says ACTIVE but DB says FREE, the user is FREE.
2. **One Source of Truth:** `subscriptions.status` is the only field checked by `User::isActive()`.
3. **No Double Plans:** User table row is locked (`lockForUpdate`) during subscription creation.
4. **Idempotent Transitions:** Transitioning from `active` to `active` is a NO-OP, preventing duplicate audit logs or emails.
5. **Secret Verification:** Webhooks without a valid `X-Razorpay-Signature` matching `RAZORPAY_WEBHOOK_SECRET` are rejected with `403`.

---

## 9. Testing Checklist

### Automated Unit Tests

- `it_transitions_from_free_to_trial`: Standard flow.
- `it_prevents_invalid_transitions`: e.g., `free` → `active`.
- `it_prevents_race_conditions`: Concurrent transition attempts.
- `it_auto_cancels_old_sub`: Upgrade flow verification.

### Manual QA Scenarios

1. **Refresh during payment:** Ensure user stays `pending` and can resume.
2. **Expired Trial:** Set `trial_ends_at` to past date and run `subscriptions:check-trial-expiry`.
3. **Webhook Injection:** Send fake signature to verify 403 response.
4. **Upgrades:** Verify old subscription in Razorpay is actually CANCELLED.
