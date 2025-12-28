import { emailLayout, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const reminderTemplate = ({ name, days }) => {
    const dashboardUrl = `${CONFIG.SITE_URL}/dashboard`;
    const timeText = days === 1 ? "tomorrow" : `in ${days} days`;

    return emailLayout({
        title: "Your trial is ending soon",
        previewText: `Final ${days} day(s) of your premium access. Renewal recommended.`,
        content: `
            <h1>Don't lose your spotlight!</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Hi ${name},</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">This is a friendly reminder that your premium access at ${CONFIG.SITE_NAME} will expire <strong>${timeText}</strong>.</p>
            
            <div style="background-color: #F0F9FF; border-radius: 12px; padding: 24px; border: 1px solid #BAE6FD; margin-bottom: 32px;">
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #0369A1;">Keep your peak performance:</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #0E7490;">
                    <li style="margin-bottom: 8px;">Unlimited bio pages & links</li>
                    <li style="margin-bottom: 8px;">Advanced real-time analytics</li>
                    <li style="margin-bottom: 0;">Branded QR codes with custom logos</li>
                </ul>
            </div>

            <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Secure My Pro Access</a>
            </div>

            <p style="font-size: 14px; color: #6B7280; margin-top: 32px; text-align: center;">
                Need help choosing the right plan? Just reply to this email and our team will guide you!
            </p>
        `
    });
};

