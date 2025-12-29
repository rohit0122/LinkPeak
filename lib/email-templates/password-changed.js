import { emailLayout, STYLES } from "./layout";
import { CONFIG } from "@/constants/config";

export const passwordChangedTemplate = () => {
    const loginUrl = `${CONFIG.SITE_URL}/login`;

    return emailLayout({
        title: "Password Changed Successfully",
        previewText: "Your password has been successfully updated.",
        content: `
            <div style="text-align: center;">
                <h1 style="${STYLES.h1}">Password Changed</h1>
                <p style="${STYLES.text}">Your password for ${CONFIG.SITE_NAME} has been successfully updated.</p>
                
                <p style="${STYLES.text} margin-bottom: 32px;">You can now log in with your new password.</p>

                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${loginUrl}" style="${STYLES.button}">Login to Dashboard</a>
                </div>
                
                <p style="${STYLES.text} font-size: 14px; color: #6B7280; margin-top: 24px;">
                    If you did not perform this action, please contact support immediately.
                </p>
            </div>
        `
    });
};
