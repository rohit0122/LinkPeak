import { emailLayout, STYLES, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const verificationTemplate = ({ name, otp }) => {
    return emailLayout({
        title: "Verify your email",
        previewText: `${otp} is your verification code for ${CONFIG.SITE_NAME}.`,
        content: `
            <h1 style="${STYLES.h1}">Verify your email address</h1>
            <p style="${STYLES.text}">Thanks for signing up for ${CONFIG.SITE_NAME}! We're excited to have you on board.</p>
            <p style="${STYLES.text}">Please use the following code to complete your registration:</p>
            
            <div style="background-color: #F3F4F6; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
                <span style="font-family: monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: ${PRIMARY_COLOR};">${otp}</span>
            </div>

            <p style="${STYLES.text}">This code will expire in 10 minutes.</p>
            
            <p style="${STYLES.text} font-size: 14px; margin-top: 32px; color: #6B7280;">If you didn't create an account, you can safely ignore this email.</p>
        `
    });
};
