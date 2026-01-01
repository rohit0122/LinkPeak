import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { createToken } from "@/lib/auth";
import { authRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
    try {
        // Rate limiting
        const rateLimitResult = await authRateLimit(req);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { success: false, error: "Too many login attempts. Please try again later." },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString()
                    }
                }
            );
        }

        await dbConnect();
        const { email, password } = await req.json();

        const currentUser = await User.findOne({ email }).select("+password");
        if (!currentUser) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        if (!currentUser.isVerified) {
            return NextResponse.json({ success: false, error: "Please verify your email first" }, { status: 403 });
        }

        // Check if account is active (suspended)
        if (currentUser.isActive === false) {
            return NextResponse.json({
                success: false,
                error: "Account suspended. Please contact support to reactivate."
            }, { status: 403 });
        }

        const isMatch = await currentUser.matchPassword(password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        const lpkSiteToken = await createToken({
            id: currentUser._id.toString(),
            email: currentUser.email,
            role: currentUser.role,
            name: currentUser.name,
            plan: currentUser.plan,
            isActive: currentUser.isActive,
        });

        const response = NextResponse.json({
            success: true,
            data: {
                id: currentUser._id.toString(),
                email: currentUser.email,
                role: currentUser.role,
                name: currentUser.name,
                plan: currentUser.plan,
                isActive: currentUser.isActive,
            },
        });

        response.cookies.set("lpkSiteToken", lpkSiteToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
