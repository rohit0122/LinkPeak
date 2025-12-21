import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback_secret_change_me_in_production"
);

export async function middleware(request) {
    const token = request.cookies.get("auth_token")?.value;
    const { pathname } = request.nextUrl;

    // 1. Define protected routes
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isApiProtectedRoute = pathname.startsWith("/api/") &&
        !pathname.startsWith("/api/auth") &&
        !pathname.startsWith("/api/webhooks") &&
        !pathname.startsWith("/api/links/click"); // Public click tracking

    if (isDashboardRoute || isApiProtectedRoute) {
        if (!token) {
            if (isDashboardRoute) {
                const url = new URL("/login", request.url);
                url.searchParams.set("redirect", pathname);
                return NextResponse.redirect(url);
            }
            return NextResponse.json({ error: "Auth required" }, { status: 401 });
        }

        try {
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            if (isDashboardRoute) {
                const url = new URL("/login", request.url);
                url.searchParams.set("redirect", pathname);
                return NextResponse.redirect(url);
            }
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }
    }

    // 2. Redirect logged-in users away from auth pages
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    if (isAuthPage && token) {
        try {
            await jwtVerify(token, secret);
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } catch (error) {
            // Token invalid, let them stay on auth page
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
};
