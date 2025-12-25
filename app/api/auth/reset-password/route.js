import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";

/**
 * POST /api/auth/reset-password
 * Resets user password using valid token
 */
export async function POST(req) {
    try {
        await dbConnect();

        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { success: false, error: "Token and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Hash the token to compare with stored hash
        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

        // Find user with valid token and not expired
        const user = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid or expired reset token" },
                { status: 400 }
            );
        }

        // Update password (will be hashed by User model pre-save hook)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password has been reset successfully",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to reset password" },
            { status: 500 }
        );
    }
}
