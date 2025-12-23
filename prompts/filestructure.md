linkpeak/
├── constants/
│   └── config.js                  # Global Constants
├── app/
│   ├── (auth)/                    # Verify, Login, Register, Reset
│   ├── (marketing)/               # Home, Pricing, Contact, Legal
│   ├── (dashboard)/               # User App (Tracking, QR, Analytics, Tickets)
│   ├── (admin)/                   # Super Admin Control Panel
│   ├── [slug]/                    # SEO-Optimized Public Bio Page
│   ├── layout.jsx                 # Root + Global Axios Loader + Toaster
│   └── api/                       # Auth, Track, Cron, QR, Tickets, AI
├── components/
│   ├── layout/                    # Header, Footer, Sidebar
│   ├── bio-templates/             # The 5 Layout Components
│   ├── shared/                    # Loader, ExpiryAlert, PreviewPhone
│   ├── analytics/                 # Recharts Components
│   └── seo/                       # JSON-LD & AI Meta Tags
├── lib/
│   ├── axios.js                   # Axios Instance + Interceptors for Global UI
│   ├── db.js                      # Mongoose Singleton (Vercel-Ready)
│   ├── mailer.js                  # Nodemailer Helper
│   └── env-check.js               # Runtime Environment Validation
├── proxy.js                       # Next.js 16 RBAC/Auth Middleware
└── next.config.js                 # Optimized Build & Image Config