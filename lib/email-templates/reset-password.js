import { emailLayout } from "./layout";
import { CONFIG } from "@/constants/config";

export const resetPasswordTemplate = (token) => {
    const resetUrl = `${CONFIG.SITE_URL}/reset-password?token=${token}`;

    return emailLayout({
        title: "Reset your password",
        previewText: "Follow the link below to reset your account password.",
        content: `
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;">Reset Your Password</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">We received a request to reset the password for your ${CONFIG.SITE_NAME} account. No worries, it happens!</p>
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            <p style="font-size: 16px; color: #4B5563; margin-top: 32px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
            <p style="font-size: 14px; color: #9CA3AF; margin-top: 32px; border-top: 1px solid #F3F4F6; padding-top: 16px;">If the button doesn't work, copy and paste this link:<br>
            <span style="color: #6D28D9;">${resetUrl}</span></p>
        `
    });
};
