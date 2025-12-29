import { emailLayout, STYLES, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const verificationTemplate = (token) => {
    const verifyUrl = `${CONFIG.SITE_URL}/api/auth/verify?token=${token}`;

    return emailLayout({
        title: "Verify your email",
        previewText: "Click the link to verify your email address.",
        content: `
            <h1 style="${STYLES.h1}">Verify your email address</h1>
            <p style="${STYLES.text}">Thanks for signing up for ${CONFIG.SITE_NAME}! We're excited to have you on board.</p>
            <p style="${STYLES.text}">Please click the button below to verify your email address and complete your registration:</p>
            
            <div style="text-align: center; margin: 32px 0;">
                <a href="${verifyUrl}" style="${STYLES.button}">Verify Email Address</a>
            </div>

            <p style="${STYLES.text}">This link will expire in 24 hours.</p>
            
            <p style="${STYLES.text} font-size: 14px; margin-top: 32px; color: #6B7280;">If you didn't create an account, you can safely ignore this email.</p>
            
            <p style="${STYLES.text} font-size: 14px; color: #9CA3AF; border-top: 1px solid #F3F4F6; padding-top: 24px;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <span style="color: ${PRIMARY_COLOR}; word-break: break-all;">${verifyUrl}</span>
            </p>
        `
    });
};
