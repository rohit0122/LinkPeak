import { emailLayout, STYLES } from "./layout";
import { CONFIG } from "@/constants/config";

export const suspensionTemplate = ({ userName }) => {
    const renewUrl = `${CONFIG.SITE_URL}/suspended`;

    return emailLayout({
        title: "Action Required: Account Suspended",
        previewText: "Your subscription has expired. Renew now to reactivate your bio page.",
        content: `
            <div style="text-align: center;">
                <h1 style="${STYLES.h1} color: #DC2626;">Account Suspended</h1>
            </div>

            <p style="${STYLES.text}">Hi ${userName},</p>
            
            <p style="${STYLES.text}">
                We were unable to renew your subscription, and as a result, your account has been temporarily suspended.
            </p>

            <div style="background-color: #FEF2F2; border: 1px solid #FECACA; padding: 20px; border-radius: 8px; margin: 24px 0;">
                <strong style="color: #991B1B; display: block; margin-bottom: 8px;">What does this mean?</strong>
                <ul style="margin: 0; padding-left: 20px; color: #7F1D1D; text-align: left;">
                    <li style="margin-bottom: 4px;">Your bio page is currently hidden</li>
                    <li style="margin-bottom: 4px;">Public visitors cannot see your links</li>
                    <li>Analytics collection is paused</li>
                </ul>
            </div>

            <p style="${STYLES.text}">
                But don't worry! Your data is safe. You can reactivate your account instantly by updating your payment method.
            </p>

            <div style="text-align: center; margin-top: 32px;">
                <a href="${renewUrl}" style="${STYLES.button} background-color: #DC2626;">
                    Reactivate My Account
                </a>
            </div>
        `
    });
};
