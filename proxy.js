import { NextResponse } from "next/server";

export async function proxy(req) {
  const lpkSiteToken = req.cookies.get("lpkSiteToken")?.value;
  const { pathname } = req.nextUrl;

  // 1. Protected Routes (Dashboard & Admin)
  // If no token, redirect to login
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname === "/suspended"
  ) {
    if (!lpkSiteToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // We cannot verify Sanctum tokens statelessly (they are opaque).
    // Verification happens at the API level (when dashboard fetches data).
    // If API returns 401, Client UI handles redirection.
    return NextResponse.next();
  }

  // 2. Auth Routes (Login/Register)
  // If token exists, redirect to dashboard (skip login)
  if (lpkSiteToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/suspended",
  ],
};
