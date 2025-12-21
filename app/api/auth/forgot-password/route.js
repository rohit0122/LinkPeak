import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";

export async function POST(req) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // For security reasons, don't reveal if user exists
            return NextResponse.json({
                success: true,
                message: "If an account exists with that email, a reset link will be sent."
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        // IN PRODUCTION: Send email with resetToken
        console.log(`Password reset token for ${email}: ${resetToken}`);

        return NextResponse.json({
            success: true,
            message: "Reset token generated successfully (Check console in development).",
            // In dev mode, we return the token for ease of testing
            ...(process.env.NODE_ENV !== "production" && { devToken: resetToken })
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
