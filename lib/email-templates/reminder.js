import { emailLayout } from "./layout";
import { CONFIG } from "@/constants/config";

export const reminderTemplate = ({ name, days }) => {
    const dashboardUrl = `${CONFIG.SITE_URL}/dashboard`;
    const timeText = days === 1 ? "tomorrow" : `in ${days} days`;

    return emailLayout({
        title: "Your trial is ending soon",
        previewText: `Final ${days} day(s) of your premium access. Renewal recommended.`,
        content: `
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;">Don't lose your spotlight!</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Hi ${name},</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">This is a friendly reminder that your premium access at ${CONFIG.SITE_NAME} will expire <strong>${timeText}</strong>.</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Upgrade now to keep your custom themes, advanced analytics, and premium QR codes live without interruption.</p>
            <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Keep My Pro Access</a>
            </div>
            <p style="font-size: 14px; color: #6B7280; margin-top: 32px; text-align: center;">Need help choosing a plan? Reply to this email!</p>
        `
    });
};
