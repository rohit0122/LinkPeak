import { NextResponse } from "next/server";
import UserRepository from "@/lib/repositories/UserRepository";
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

        const { email, password } = await req.json();

        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ success: false, error: "Please verify your email first" }, { status: 403 });
        }

        // Check if account is active (suspended)
        if (user.isActive === false) {
            return NextResponse.json({
                success: false,
                error: "Account suspended. Please contact support to reactivate."
            }, { status: 403 });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        const token = await createToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
            plan: user.plan,
            isActive: user.isActive,
        });

        const response = NextResponse.json({
            success: true,
            data: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                name: user.name,
                plan: user.plan,
                isActive: user.isActive,
            },
        });

        response.cookies.set("token", token, {
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
