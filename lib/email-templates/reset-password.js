import { emailLayout, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const resetPasswordTemplate = (token) => {
    const resetUrl = `${CONFIG.SITE_URL}/reset-password?token=${token}`;

    return emailLayout({
        title: "Reset your password",
        previewText: "Follow the link below to reset your account password.",
        content: `
            <h1>Reset your password</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">We received a request to reset the password for your ${CONFIG.SITE_NAME} account. No worries, it happens!</p>
            
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>

            <div style="background-color: #FFFBEB; border-radius: 8px; padding: 20px; border: 1px solid #FEF3C7; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #92400E;">
                    <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this change, you can safely ignore this email and your password will remain unchanged.
                </p>
            </div>

            <p style="font-size: 14px; color: #9CA3AF; border-top: 1px solid #F3F4F6; padding-top: 24px;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <span style="color: ${PRIMARY_COLOR}; word-break: break-all;">${resetUrl}</span>
            </p>
        `
    });
};

