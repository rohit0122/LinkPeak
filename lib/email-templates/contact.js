import { emailLayout } from "./layout";
import { CONFIG } from "@/constants/config";

export const contactReceiptTemplate = ({ name, subject }) => {
    return emailLayout({
        title: "We've received your message",
        previewText: "Thank you for reaching out to LinkPeak support.",
        content: `
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px;">Message Received</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Hi ${name},</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Thanks for reaching out! We've received your message regarding "<strong>${subject}</strong>" and our team will get back to you as soon as possible.</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">In the meantime, feel free to check out our <a href="${CONFIG.SITE_URL}/faq" style="color: #6D28D9; text-decoration: none; font-weight: 500;">Help Center</a> for quick answers.</p>
            <p style="font-size: 16px; color: #4B5563; margin-top: 32px;">Best,<br>The ${CONFIG.SITE_NAME} Team</p>
        `
    });
};

export const contactAdminTemplate = ({ name, email, subject, message }) => {
    return emailLayout({
        title: "New Contact Message",
        previewText: `New message from ${name}: ${subject}`,
        content: `
            <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 16px;">New Contact Submission</h1>
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name} (${email})</p>
                <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 0;"><strong>Message:</strong></p>
                <p style="margin: 8px 0 0 0; white-space: pre-wrap; color: #374151;">${message}</p>
            </div>
            <div style="text-align: center;">
                <a href="mailto:${email}" class="button">Reply to User</a>
            </div>
        `
    });
};
