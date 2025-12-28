import { emailLayout } from "./layout";
import { CONFIG } from "@/constants/config";

export const welcomeTemplate = ({ name }) => {
    const dashboardUrl = `${CONFIG.SITE_URL}/dashboard`;

    return emailLayout({
        title: `Welcome to ${CONFIG.SITE_NAME}!`,
        previewText: "Your account is verified. Let's build your amazing bio link page.",
        content: `
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;">You're in, ${name}!</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Your account is officially verified. It's time to create a bio page that works as hard as you do.</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;"><strong>Here's how to get started:</strong></p>
            <ul style="font-size: 16px; color: #4B5563; margin-bottom: 24px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Claim your unique @username</li>
                <li style="margin-bottom: 8px;">Add your most important links</li>
                <li style="margin-bottom: 8px;">Pick a theme that matches your brand</li>
                <li style="margin-bottom: 8px;">Share it everywhere!</li>
            </ul>
            <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Go to My Dashboard</a>
            </div>
            <p style="font-size: 16px; color: #4B5563; margin-top: 32px;">We can't wait to see what you build!</p>
        `
    });
};
