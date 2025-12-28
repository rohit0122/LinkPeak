import { emailLayout } from "./layout";
import { CONFIG } from "@/constants/config";

export const suspensionTemplate = ({ name, reason }) => {
    const dashboardUrl = `${CONFIG.SITE_URL}/dashboard`;

    return emailLayout({
        title: "Account Suspended",
        previewText: "Your account access has been limited due to trial or plan expiry.",
        content: `
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;">Account Suspended</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Hi ${name},</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Your ${CONFIG.SITE_NAME} account has been suspended because your ${reason || 'current plan'} has expired. Your bio link is currently offline.</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Don't worry—your data is safe! You can reactivate your account and get your bio back online instantly by upgrading to a premium plan.</p>
            <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Reactivate Now</a>
            </div>
            <p style="font-size: 16px; color: #4B5563; margin-top: 32px;">If you have any questions, our support team is here to help.</p>
        `
    });
};
