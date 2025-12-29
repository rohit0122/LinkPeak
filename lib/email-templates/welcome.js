import { emailLayout, STYLES, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const welcomeTemplate = ({ name }) => {
    const dashboardUrl = `${CONFIG.SITE_URL}/dashboard`;

    return emailLayout({
        title: `Welcome to ${CONFIG.SITE_NAME}!`,
        previewText: "Your account is verified. Let's build your amazing bio link page.",
        content: `
            <h1 style="${STYLES.h1}">Welcome aboard, ${name}!</h1>
            <p style="${STYLES.text}">Your account is officially verified. It's time to create a bio page that works as hard as you do.</p>
            
            <p style="${STYLES.text} font-weight: 600; color: #111827;">Here's how to get started in 3 minutes:</p>
            
            <div style="margin-bottom: 32px;">
                <div style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                    <div style="background-color: #EDE9FE; color: ${PRIMARY_COLOR}; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 24px; font-weight: 700; margin-right: 12px; flex-shrink: 0;">1</div>
                    <p style="margin: 0; font-size: 16px; color: #4B5563;">Claim your unique <strong>@username</strong></p>
                </div>
                <div style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                    <div style="background-color: #EDE9FE; color: ${PRIMARY_COLOR}; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 24px; font-weight: 700; margin-right: 12px; flex-shrink: 0;">2</div>
                    <p style="margin: 0; font-size: 16px; color: #4B5563;">Add your most important links & social icons</p>
                </div>
                <div style="margin-bottom: 12px; display: flex; align-items: flex-start;">
                    <div style="background-color: #EDE9FE; color: ${PRIMARY_COLOR}; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 24px; font-weight: 700; margin-right: 12px; flex-shrink: 0;">3</div>
                    <p style="margin: 0; font-size: 16px; color: #4B5563;">Pick a theme or customize colors to match your brand</p>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="${dashboardUrl}" style="${STYLES.button}">Create My Bio Page</a>
            </div>

            <p style="${STYLES.text} margin-top: 32px;">We're thrilled to have you here. If you need any help, just reply to this email!</p>
        `
    });
};
