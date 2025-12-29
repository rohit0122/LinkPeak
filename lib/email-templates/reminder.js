import { emailLayout, STYLES, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const reminderTemplate = ({ daysLeft, userName, trial }) => {
    const renewUrl = `${CONFIG.SITE_URL}/dashboard`;
    const isUrgent = daysLeft <= 3;
    const color = isUrgent ? "#DC2626" : PRIMARY_COLOR; // Red for urgent, Purple for notice

    return emailLayout({
        title: trial ? `Your trial ends in ${daysLeft} days!` : `Subscription expires in ${daysLeft} days`,
        previewText: "Don't lose your premium features and data. Renew now.",
        content: `
            <h1 style="${STYLES.h1}">Don't lose your access!</h1>
            
            <p style="${STYLES.text}">Hi ${userName},</p>
            
            <p style="${STYLES.text}">
                This is a friendly reminder that your <strong>${trial ? 'Trial' : 'Premium Subscription'}</strong> expires in:
            </p>

            <div style="text-align: center; margin: 32px 0;">
                <span style="font-size: 48px; font-weight: 800; color: ${color}; line-height: 1;">${daysLeft}</span>
                <div style="font-size: 18px; color: #6B7280; margin-top: 4px;">DAYS</div>
            </div>

            <p style="${STYLES.text}">
                To keep your bio page live, your analytics tracking, and all your premium customizations, please renew your plan before time runs out.
            </p>

            <div style="text-align: center; margin-top: 32px;">
                <a href="${renewUrl}" style="${STYLES.button} background-color: ${color};">
                    ${trial ? 'Secure My Account' : 'Renew Subscription'}
                </a>
            </div>
        `
    });
};
