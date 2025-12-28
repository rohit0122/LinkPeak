import { emailLayout, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const passwordChangedTemplate = ({ name }) => {
    return emailLayout({
        title: "Password Updated Successfully",
        previewText: "Your account password has been updated.",
        content: `
            <h1>Password Updated</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Hi ${name},</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">This is a confirmation that the password for your ${CONFIG.SITE_NAME} account was successfully changed just now.</p>
            
            <div style="background-color: #FEF2F2; border-radius: 8px; padding: 20px; border: 1px solid #FEE2E2; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #991B1B;">
                    <strong>Didn't make this change?</strong> If you did not update your password, please secure your account immediately by contacting our support team or using the link below.
                </p>
            </div>

            <div style="text-align: center;">
                <a href="${CONFIG.SITE_URL}/contact-us" class="button">Secure My Account</a>
            </div>
            
            <p style="font-size: 16px; color: #4B5563; margin-top: 32px;">Stay safe,<br>The ${CONFIG.SITE_NAME} Team</p>
        `
    });
};

