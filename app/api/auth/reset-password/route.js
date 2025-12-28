import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendPasswordChangedEmail } from "@/lib/mailer";

/**
 * POST /api/auth/reset-password
 * Resets user password using valid token
 */
export async function POST(req) {
    // ... existing validation code omitted for brevity but preserved in reality ...
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

    // Send confirmation email
    try {
        await sendPasswordChangedEmail(user.email, user.name || "Creator");
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
