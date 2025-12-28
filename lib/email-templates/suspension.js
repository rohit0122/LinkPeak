import { emailLayout, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const suspensionTemplate = ({ name, reason }) => {
    const dashboardUrl = `${CONFIG.SITE_URL}/dashboard`;

    return emailLayout({
        title: "Account Access Suspended",
        previewText: "Your account access has been limited. Reactivate now to get back online.",
        content: `
            <h1>Account Suspended</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Hi ${name},</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Your ${CONFIG.SITE_NAME} account has been suspended because your <strong>${reason || 'plan'}</strong> has ended. Your public bio link is currently offline.</p>
            
            <div style="background-color: #FEF2F2; border-radius: 12px; padding: 24px; border: 1px solid #FEE2E2; margin-bottom: 32px;">
                <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #991B1B;">What happens now?</p>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #B91C1C;">
                    <li style="margin-bottom: 8px;">Your public bio link will show a "suspended" message.</li>
                    <li style="margin-bottom: 8px;">Analytics tracking is temporarily paused.</li>
                    <li style="margin-bottom: 0;">Access to premium themes is limited.</li>
                </ul>
            </div>

            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Don't worry—your data is safe! You can reactivate your account and get everything back online instantly by renewing your plan.</p>
            
            <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Reactivate My Account</a>
            </div>

            <p style="font-size: 16px; color: #4B5563; margin-top: 32px;">If this is a mistake, please reach out to our support team right away.</p>
        `
    });
};

