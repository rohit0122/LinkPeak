💳 Razorpay Subscription Integration (MongoDB Compatible)

This document defines the complete subscription, trial, and payment-link flow for the Link-in-Bio application using Razorpay, implemented first with a Mock API, then switchable to production Razorpay keys.

⚠️ Important Principle

Do NOT break existing UI, APIs, routes, or auth logic
we are using nextjs 16, daisyui and tailwind 4 css.

Extend functionality incrementally

MongoDB is the only database

All logic must be idempotent and fault-tolerant

🧠 Application Context

Link-in-Bio SaaS (Global users)

MongoDB (Mongoose)

Subscription-based pricing

Logged-in dashboard driven

Existing trial logic is already implemented

🎯 Goal

Implement a Razorpay Payment Link–based subscription system with:

24-hour free trial

Monthly billing

Upgrade / downgrade window

Mock Razorpay API for testing

Seamless switch to real Razorpay

🧪 Trial Logic (Already Exists – Do Not Modify)

Each new user gets 24 hours of free trial

Trial starts at:

user.createdAt


During trial:

All premium features are enabled

Dashboard shows Subscribe / Upgrade button

Trial expires automatically after 24 hours

This logic must be reused, not rewritten

💰 Payment Entry Rules
1️⃣ First-Time Subscription

Payment is allowed only inside logged-in dashboard

Payment link:

Is plan-specific

Is user-specific

Expires in 24 hours

If payment is not completed:

Link expires

User must manually regenerate a new link

2️⃣ After Successful Payment

Trial ends immediately

Subscription becomes ACTIVE

Store in MongoDB:

userId

planId

startDate

endDate

billingCycle = monthly

paymentLinkId

paymentStatus = paid

🔁 Renewal, Upgrade & Downgrade Logic
Renewal Window

Payment link is visible only in last 7 days before plan expiry

Upgrade / Downgrade Rules

Allowed only in last 7 days

Payment link:

Charges new plan amount

Does NOT activate immediately

New plan activates after current plan expires

No overlapping subscriptions

🧱 MongoDB Data Models (Required)
User
{
  _id,
  email,
  role,
  trialEndsAt,
  createdAt
}

Subscription
{
  _id,
  userId,
  planId,
  status: "trial" | "active" | "expired" | "scheduled",
  startDate,
  endDate,
  billingCycle: "monthly",
  createdAt
}

PaymentLink
{
  _id,
  userId,
  planId,
  subscriptionId,
  provider: "mock" | "razorpay",
  providerPaymentLinkId,
  amount,
  currency: "INR",
  expiresAt,
  status: "created" | "paid" | "expired" | "failed",
  metadata,
  createdAt
}

🧩 Razorpay Integration Strategy
Phase 1 — MOCK Razorpay (Mandatory First)

Create a mock Razorpay service that simulates:

Payment link creation

Payment success

Payment failure

Payment expiry

Webhook events

Mock API Endpoints
POST /api/mock/razorpay/create-payment-link
POST /api/mock/razorpay/payment-success
POST /api/mock/razorpay/payment-failed
POST /api/mock/razorpay/payment-expired


Mock responses must match real Razorpay payload structure

Phase 2 — Real Razorpay (Drop-in Ready)

All payment logic must go through a provider abstraction:

paymentProvider.createPaymentLink()
paymentProvider.verifyPayment()
paymentProvider.handleWebhook()


Switch provider via env:

PAYMENT_PROVIDER=mock | razorpay

🔔 Webhook Handling (Mock + Real)

Implement webhook handling that:

Validates payload signature (mock + real)

Handles events:

payment_link.paid

payment_link.expired

payment.failed

Updates MongoDB safely:

No duplicate subscriptions

Idempotent updates

🖥️ Dashboard UI Rules (Do Not Break Existing UI)

Show Subscribe button when:

Trial active

No active subscription

Show Renew / Upgrade button when:

Subscription expires in ≤ 7 days

Hide payment actions otherwise

Never expose payment links publicly

🔐 Security Rules

Payment links are accessible only for logged-in users

Verify:

userId

planId

paymentLink ownership

Never trust frontend payment status

Always verify server-side

🧪 Testing Requirements

Mock API must support:

Successful payment

Failed payment

Expired payment

Duplicate webhook calls

Network retry simulation

🚫 Explicit Non-Goals

No auto-debit

No proration

No refunds

No partial payments

✅ Final Outcome

Fully tested subscription flow

Mock → Production switch without code rewrite

MongoDB-safe, scalable schema

Zero UI/API breaking changes

Global-ready billing UX