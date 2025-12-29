# 🏔️ LinkPeakK.
### Premium Link-in-Bio Platform for Creators, Brands & Professionals

**LinkPeakK.** is a high-performance, fully customizable "Link in Bio" platform designed to help creators, entrepreneurs, and brands consolidate their online presence into one powerful, high-converting landing page.

![Banner](https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop)

---

## ✨ Key Features

- **🎨 Multi-Template System**: Choose between **Classic**, **Grid**, and **Hero** templates to match your personal brand or business style.
- **🌈 Dynamic Themes**: Full integration with **DaisyUI** themes (Light, Dark, Luxury, Cyberpunk, and more) for instant aesthetic transformations.
- **📊 Advanced Analytics**: Track your traffic in real-time with comprehensive visitor stats, top links, and engagement metrics powered by **Recharts**.
- **🔗 Drag-and-Drop Editor**: Organize your links effortlessly with our intuitive drag-and-drop interface.
- **💳 Monetization & Billing**: Integrated **Razorpay** payment gateway with role-based upgrade/renewal logic and benefit justifications.
- **📱 Custom QR Codes**: Generate branded QR codes for your bio pages with custom logos and styling.
- **🔐 Secure Authentication**: Robust JWT-based authentication with email verification and password recovery.
- **📧 Automated Notifications**: Branded email notification system for welcomes, password resets, and account status updates.
- **⚖️ Legal Ready**: Built-in pages for Privacy Policy, Terms of Service, and Cookie Policy.
- **🖥️ Admin Dashboard**: Powerful administrative tools for user management and platform-wide analytics.

---

## ⚙️ Automated Lifecycle Management

The platform includes a production-grade automated system for subscription reminders and account protections.

### 🕒 Daily Scheduler
- **Trigger**: Every day at **5:00 AM EST** (10:00 AM UTC).
- **Service**: GitHub Actions (`.github/workflows/daily.yml`).
- **Functionality**:
  - **7, 3, 1 Day Reminders**: Automatic branded emails sent to users before their plan expires.
  - **Auto-Suspension**: Accounts with expired plans are automatically marked as `inactive`, which suspends their public bio page.
  - **Admin Immunity**: System administrators are exempt from automated suspensions.

---

## 🛠️ Internal Debug & Utility Tools

The following routes are available for system testing and developer previews.

### 📧 Email Utilities
- **Send Test Email**: `/api/debug/test-email?to=your-email@example.com`
  - *Sends a branded system welcome email to the specified address.*
- **Sample Email Template Gallery**: `/marketing/email/sample`
  - *Comprehensive gallery to preview all system email templates (Welcome, Suspension, Trial Expiry, etc).*
- **Manual Cron Trigger**: `/api/cron/expiry-check`
  - *Requires `Authorization: Bearer <CRON_SECRET>` header.*

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Icons**: [Remix Icons](https://remixicon.com/) (Standardized)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: JWT & `bcryptjs`
- **Email**: [Nodemailer](https://nodemailer.com/) (Zoho SMTP Optimized)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Analytics**: [Recharts](https://recharts.org/)
- **QR Generation**: `qrcode.react`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (Latest LTS)
- MongoDB Connection URI

### 2. Installation
```bash
git clone https://github.com/rohit0122/LinkPeak.git
cd LinkPeak
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Database
MONGODB_URI=your_mongodb_uri

# Auth
JWT_SECRET=your_jwt_secret
CRON_SECRET=your_random_secure_token

# SMTP (Zoho Recommended)
NODEMAILER_HOST=smtp.zoho.in
NODEMAILER_PORT=587
NODEMAILER_USER=your_email@domain.com
NODEMAILER_PASS=your_app_password
NODEMAILER_USER_SENDER=your_email@domain.com

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# AI (Waterfall Engine)
# Get Gemini Key: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_google_gemini_key
# Get Mistral Key: https://console.mistral.ai/
MISTRAL_API_KEY=your_mistral_ai_key

# Analytics / Public
NEXT_PUBLIC_SITE_NAME="LinkPeakK."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 4. Deployment & Secrets (CRITICAL)

Since `.env` files are not committed to Git, you must manually add the following secrets to your production environment:

#### A. GitHub Repository Secrets
To enable the **Daily Scheduler**, go to your GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions** and add:
- `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., `https://linkpeakk.com`)
- `CRON_SECRET`: The same random token you generated for your `.env` file.

#### B. Vercel / Hosting Provider Env Variables
Add the following to your production environment variables:
- `CRON_SECRET`: (Matches the one in GitHub)
- `NEXT_PUBLIC_SITE_URL`: Your live site URL.

---

### 5. Running the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📦 Project Structure

```text
├── .github/workflows/ # CI/CD & Automated Schedulers
├── app/               # Next.js App Router (Pages & APIs)
├── components/        # Reusable UI Components
├── constants/         # Global Config & Constants
├── lib/               # Utility functions (db connection, mailer)
├── models/            # Mongoose Schemas
├── public/            # Static Assets
└── styles/            # Global CSS
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Support
For any questions or support, please contact us at **connect@linkpeakk.com**.

Built with ❤️ for Creators.
