import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

/**
 * POST /api/auth/forgot-password
 * Sends password reset email with token
 */
export async function POST(req) {
    try {
        await dbConnect();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                success: true,
                message: "If an account exists with this email, a reset link has been sent.",
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Set token and expiry (1 hour)
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        // TODO: Send email with reset link
        // For now, just log it (in production, use email service)
        console.log("Password Reset Link:", resetUrl);
        console.log("User:", user.email);

        // In development, you can return the link for testing
        if (process.env.NODE_ENV === "development") {
            return NextResponse.json({
                success: true,
                message: "Password reset link generated",
                resetUrl, // Remove this in production
            });
        }

        return NextResponse.json({
            success: true,
            message: "If an account exists with this email, a reset link has been sent.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process request" },
            { status: 500 }
        );
    }
}
