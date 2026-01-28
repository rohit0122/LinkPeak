"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

export default function ConditionalGoogleAnalytics({ gaId }) {
    const pathname = usePathname();

    // Logic to identify slug pages: 
    // 1. It's a top-level path (only one slash)
    // 2. It's not a known static path like /, /contact-us, /why-different, etc.
    // 3. It's not an auth or admin page

    const knownStaticPaths = [
        "/",
        "/why-different",
        "/contact-us",
        "/account-deleted",
        "/suspended",
        "/email",
        "/privacy-policy",
        "/terms-and-conditions",
        "/cookies-policy"
    ];

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password") || pathname.startsWith("/verify-email") || pathname.startsWith("/setup-profile");
    const isDashboardPage = pathname.startsWith("/dashboard");
    const isAdminPage = pathname.startsWith("/admin");
    const isDemoPage = pathname.startsWith("/demo") || pathname.startsWith("/trial");
    const isPaymentPage = pathname.startsWith("/payment");

    const isStaticPath = knownStaticPaths.includes(pathname);

    // If it's a top-level path that is NOT a known static path and NOT an auth/admin etc. path, it's a slug page
    const isSlugPage = !isStaticPath && !isAuthPage && !isDashboardPage && !isAdminPage && !isDemoPage && !isPaymentPage && pathname.split("/").filter(Boolean).length === 1;

    if (isSlugPage) {
        return null;
    }

    return <GoogleAnalytics gaId={gaId} />;
}
