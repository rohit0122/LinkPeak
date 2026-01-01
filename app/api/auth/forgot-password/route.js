import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/mailer";

/**
 * POST /api/auth/forgot-password
 * Sends password reset email with lpkSiteToken
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

        // Find currentUser by email
        const currentUser = await User.findOne({ email: email.toLowerCase() });

        // Always return success to prevent email enumeration
        if (!currentUser) {
            return NextResponse.json({
                success: true,
                message: "If an account exists with this email, a reset link has been sent.",
            });
        }

        // Generate reset lpkSiteToken
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Set lpkSiteToken and expiry (1 hour)
        currentUser.resetPasswordToken = resetTokenHash;
        currentUser.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await currentUser.save();

        // Send Reset Email
        try {
            await sendResetPasswordEmail(currentUser.email, resetToken);
        } catch (mailError) {
            console.error("Reset password email failed:", mailError);
            // Optionally we could return an error here, but standard practice is to not confirm account existence
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
