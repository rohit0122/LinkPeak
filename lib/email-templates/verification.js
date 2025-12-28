import { emailLayout, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const verificationTemplate = (token) => {
    const verifyUrl = `${CONFIG.SITE_URL}/api/auth/verify?token=${token}`;

    return emailLayout({
        title: "Verify your email",
        previewText: "Confirm your email address to unlock your personal bio link page.",
        content: `
            <h1>Verify your ${CONFIG.SITE_NAME} account</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Success! You're one step away from launching your digital identity. Please confirm your email address to activate your account and start building your page.</p>
            
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${verifyUrl}" class="button">Verify My Email Address</a>
            </div>

            <div style="background-color: #F8FAFC; border-radius: 8px; padding: 20px; border: 1px solid #E2E8F0;">
                <p style="margin: 0; font-size: 14px; color: #64748B;">
                    <strong>Why verify?</strong> Verification ensures you can safely recover your account and receive important updates about your bio page.
                </p>
            </div>

            <p style="font-size: 14px; color: #9CA3AF; margin-top: 32px; border-top: 1px solid #F3F4F6; padding-top: 24px;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <span style="color: ${PRIMARY_COLOR}; word-break: break-all;">${verifyUrl}</span>
            </p>
        `
    });
};

