import { emailLayout } from "./layout";
import { CONFIG } from "@/constants/config";

export const verificationTemplate = (token) => {
    const verifyUrl = `${CONFIG.SITE_URL}/api/auth/verify?token=${token}`;

    return emailLayout({
        title: "Verify your email",
        previewText: "Confirm your email address to unlock your personal bio link page.",
        content: `
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;">Welcome to ${CONFIG.SITE_NAME}!</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Success! You're one step away from launching your digital identity. Please confirm your email address to activate your account and start building your page.</p>
            <div style="text-align: center;">
                <a href="${verifyUrl}" class="button">Verify My Email Address</a>
            </div>
            <p style="font-size: 14px; color: #9CA3AF; margin-top: 32px; border-top: 1px solid #F3F4F6; pt-24">If the button doesn't work, copy and paste this link into your browser:<br>
            <span style="color: #6D28D9;">${verifyUrl}</span></p>
        `
    });
};
