import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendPasswordChangedEmail } from "@/lib/mailer";

/**
 * POST /api/auth/reset-password
 * Resets currentUser password using valid lpkSiteToken
 */
export async function POST(req) {
    try {
        await dbConnect();

        const { lpkSiteToken, password } = await req.json();

        if (!lpkSiteToken || !password) {
            return NextResponse.json(
                { success: false, error: "Token and password are required" },
                { status: 400 }
            );
        }

        // Hash the lpkSiteToken provided in URL to match the one in DB
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(lpkSiteToken)
            .digest("hex");

        // Find currentUser with valid lpkSiteToken and not expired
        const currentUser = await User.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!currentUser) {
            return NextResponse.json(
                { success: false, error: "Invalid or expired reset lpkSiteToken" },
                { status: 400 }
            );
        }

        // Update password (will be hashed by User model pre-save hook)
        currentUser.password = password;
        currentUser.resetPasswordToken = undefined;
        currentUser.resetPasswordExpire = undefined;
        await currentUser.save();

        // Send confirmation email
        try {
            await sendPasswordChangedEmail(currentUser.email, currentUser.name || "Creator");
        } catch (mailError) {
            console.error("Password changed email failed:", mailError);
        }

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

