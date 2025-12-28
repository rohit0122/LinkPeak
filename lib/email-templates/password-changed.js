import { emailLayout } from "./layout";
import { CONFIG } from "@/constants/config";

export const passwordChangedTemplate = ({ name }) => {
    return emailLayout({
        title: "Password Changed Successfully",
        previewText: "Your account password has been updated.",
        content: `
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;">Password Updated</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Hi ${name},</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">This is a confirmation that the password for your ${CONFIG.SITE_NAME} account has been successfully changed.</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">If you did not make this change, please contact our support team immediately to secure your account.</p>
            <div style="text-align: center;">
                <a href="${CONFIG.SITE_URL}/contact" class="button">Contact Support</a>
            </div>
        `
    });
};
