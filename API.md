# LinkPeak API Documentation

Welcome to the LinkPeak API documentation. This guide provides all the necessary information to consume LinkPeak's APIs for mobile apps, internal tools, or external integrations.

## Standard Response Format

All APIs return a consistent JSON structure:

### Success Response
- **Status Code**: `200 OK` or `201 Created`
- **Body**:
```json
{
  "success": true,
  "data": { ... }, // The requested resource or result
  "message": "Optional success message"
}
```

### Error Response
- **Status Code**: `400`, `401`, `403`, `404`, `429`, or `500`
- **Body**:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

---

## 1. Authentication

All authenticated requests require a `token` cookie. External apps should handle session management via cookies or include the JWT in the `Authorization` header if supported.

### Login
`POST /auth/login`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: User object and `token` cookie set.

### Register
`POST /auth/register`
- **Body**: `{ "name": "John Doe", "email": "john@example.com", "password": "password123", "plan": "FREE" }`
- **Response**: Success message. Email verification required.

### Get Current User
`GET /auth/me`
- **Auth**: Required
- **Response**: `{ "success": true, "data": { "id": "...", "name": "...", "email": "...", "role": "...", "plan": "..." } }`

---

## 2. Bio Pages

### List All Pages
`GET /pages`
- **Auth**: Required
- **Response**: Array of Bio Page objects.

### Create Page
`POST /pages`
- **Auth**: Required
- **Body**: `{ "slug": "my-cool-bio", "title": "My Bio", "bio": "Hello world" }`

### Update Page
`PATCH /pages`
- **Auth**: Required
- **Body**: `{ "id": "page_id", "title": "New Title", "theme": "dark", "template": "creator", ... }`

---

## 3. Links

### List Links for Page
`GET /links?pageId=PAGE_ID`
- **Auth**: Required

### Add Link
`POST /links`
- **Auth**: Required
- **Body**: `{ "pageId": "PAGE_ID", "title": "My Twitter", "url": "https://twitter.com/me", "icon": "🐦" }`

### Reorder Links
`PUT /links`
- **Auth**: Required
- **Body**: `{ "links": [{ "id": "LINK_ID", "order": 0 }, { "id": "LINK_ID_2", "order": 1 }] }`

---

## 4. Analytics & Tracking

### Get Page Analytics
`GET /analytics?pageId=PAGE_ID&range=30d`
- **Auth**: Required
- **Query Params**:
  - `range`: `7d`, `30d`, or `all`
- **Response**: Time-series data and lifetime totals.

### Track Page View (Public)
`POST /track/view`
- **Body**: `{ "pageId": "PAGE_ID" }`

### Track Link Click (Public)
`POST /track/click`
- **Body**: `{ "pageId": "PAGE_ID", "linkId": "LINK_ID" }`

---

## 5. Support & Contact

### Get My Tickets
`GET /support`
- **Auth**: Required

### Create Ticket
`POST /support`
- **Auth**: Required
- **Body**: `{ "subject": "Issue", "message": "...", "priority": "high", "category": "billing" }`

---

## 6. AI Features (PRO/AGENCY)

### Generate Link Title
`POST /ai/generate-title`
- **Auth**: Required
- **Body**: `{ "url": "https://github.com/someone" }`

### Generate SEO Metadata
`POST /ai/generate-seo`
- **Auth**: Required
- **Body**: `{ "title": "My Name", "bio": "My Bio", "slug": "my-slug" }`

---

## 7. Subscriptions & Payments

### Get Status
`GET /subscriptions`
- **Auth**: Required
- **Response**: Trial info, active subscription, and renewal status.

### Create Payment Link
`POST /subscriptions/create-payment-link`
- **Auth**: Required
- **Body**: `{ "planId": "PRO" }`

---

## 8. Admin APIs

### Dashboard Stats
`GET /admin/stats`
- **Auth**: Admin Only
- **Response**: Comprehensive revenue, growth, and user distribution metrics.

---

## 9. Test & Debug APIs (Mock)

### Simulate Payment Success
`POST /mock/razorpay/payment-success`
- **Body**: `{ "paymentLinkId": "PL_ID" }`
- **Effect**: Reactivates account and upgrades plan in development.

### Test Email SMTP
`GET /debug/test-email?to=user@example.com`
- **Effect**: Sends a test welcome email to the specified address.
