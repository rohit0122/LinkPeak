import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(req) {
    const lpkSiteToken = req.cookies.get("lpkSiteToken")?.value;
    const { pathname } = req.nextUrl;

    // Protect dashboard and admin routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname === "/suspended") {
        if (!lpkSiteToken) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const { payload } = await jwtVerify(lpkSiteToken, secret);

            // Super Admin protection
            if (pathname.startsWith("/admin") && payload.role !== "admin") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            // Admin visiting Dashboard -> Redirect to Admin
            if (pathname.startsWith("/dashboard") && payload.role === "admin") {
                return NextResponse.redirect(new URL("/admin", req.url));
            }

            // Account Status protection (Inactive users to Suspended)
            if (payload.isActive === false && pathname !== "/suspended") {
                return NextResponse.redirect(new URL("/suspended", req.url));
            }

            // Active users visiting Suspended -> Redirect to Dashboard
            /*if (payload.isActive !== false && pathname === "/suspended") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }*/

            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Redirect authenticated users away from auth pages
    if (lpkSiteToken && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register", "/suspended"],
};
