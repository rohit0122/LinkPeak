# Admin API Specification (v1.0)

This document defines the API endpoints reserved for the Super-Admin dashboard. All endpoints require `auth:sanctum` and should be restricted to admin roles on the frontend.

## 1. System Metrics & Stats

### [GET] /api/v1/admin/stats

- **Summary:** High-level overview of the system performance.
- **Response (200):**

```json
{
  "metrics": {
    "total_users": 1500,
    "paid_users": 120,
    "new_users_30d": 45,
    "conversion_rate": 8.0,
    "mrr": 2400.0,
    "annual_revenue": 28800.0,
    "total_views": 45000,
    "total_links": 12000
  },
  "charts": {
    "plan_distribution": [
      { "label": "PRO", "value": 80 },
      { "label": "AGENCY", "value": 40 }
    ],
    "user_distribution": [
      { "label": "Active", "value": 1400 },
      { "label": "Inactive", "value": 100 }
    ],
    "user_growth": [{ "label": "Oct 01", "date": "2023-10-01T...", "count": 5 }]
  }
}
```

---

## 2. User & Subscription Management

### [GET] /api/v1/admin/users

- **Summary:** Paginated list of all users.
- **Query Params:** `page`, `search`
- **Includes:** `activeSubscription.plan`

### [POST] /api/v1/admin/user/suspend

- **Summary:** Blocks/Unblocks an account.
- **Request:** `{ "userId": 123, "suspend": true }`

### [GET] /api/v1/admin/subscriptions

- **Summary:** Paginated list of all subscription records in the system.
- **Includes:** `user`, `plan`

### [POST] /api/v1/admin/subscriptions/sync

- **Summary:** Trigger a global sync with Razorpay (Polled fallback). Use only for recovery.

---

## 3. Plan Management (CRUD)

### [GET] /api/v1/admin/plans

- **Summary:** List all plans (FREE, PRO, AGENCY).

### [POST] /api/v1/admin/plans

- **Summary:** Create a new plan tier.
- **Fields:** `name`, `price`, `billing_interval`, `trial_days`, `features` (JSON).

### [PUT] /api/v1/admin/plans/{id}

- **Summary:** Update plan features or price (Caution: Affects new subscribers).

---

## 4. Monitoring & Audit Logs (NEW)

These endpoints provide visibility into the background state machine and webhook processing.

### [GET] /api/v1/admin/logs/subscriptions

- **Summary:** Audit trail of every state transition in the system.
- **Query Params:** `subscription_id`, `status` (Target state).
- **Use Case:** "Why did user X lose access?" -> Check logs for `active` -> `expired`.

### [GET] /api/v1/admin/logs/webhooks

- **Summary:** Verification of Razorpay event delivery.
- **Filter:** `status` (processing, processed, failed).
- **Response Fields:** `retry_count`, `next_retry_at`, `error_message`.

### [GET] /api/v1/admin/logs/webhooks/{id}

- **Summary:** View raw JSON payload and full error stack trace for a failed webhook.

---

## 5. Security Note

All routes are prefixed with `/api/v1/admin/` and protected by Sanctum. The frontend MUST verify the user's admin status before attempting to call these endpoints to avoid 403 errors.
