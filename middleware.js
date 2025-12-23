import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // Protect dashboard and admin routes
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname === "/suspended") {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const { payload } = await jwtVerify(token, secret);

            // Super Admin protection
            if (pathname.startsWith("/admin") && payload.role !== "admin") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            // Account Status protection
            if (payload.isActive === false && pathname !== "/suspended") {
                return NextResponse.redirect(new URL("/suspended", req.url));
            }

            if (payload.isActive !== false && pathname === "/suspended") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Redirect authenticated users away from auth pages
    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register", "/suspended"],
};
