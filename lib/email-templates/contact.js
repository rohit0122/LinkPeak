import { emailLayout, STYLES, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

// Template for the Admin notification
export const contactAdminTemplate = ({ name, email, subject, message }) => {
    return emailLayout({
        title: `New Contact: ${subject}`,
        previewText: `New message from ${name}`,
        content: `
            <div style="background-color: #F9FAFB; border-radius: 8px; padding: 24px; border: 1px solid #E5E7EB;">
                <h2 style="margin-top: 0; color: #111827; font-size: 18px; margin-bottom: 20px;">New Contact Form Message</h2>
                
                <div style="margin-bottom: 16px;">
                    <strong style="display: block; font-size: 12px; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">From</strong>
                    <span style="font-size: 15px; color: #111827;">${name} (${email})</span>
                </div>

                <div style="margin-bottom: 16px;">
                    <strong style="display: block; font-size: 12px; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">Subject</strong>
                    <span style="font-size: 15px; color: #111827;">${subject}</span>
                </div>

                <div>
                    <strong style="display: block; font-size: 12px; color: #6B7280; text-transform: uppercase; margin-bottom: 4px;">Message</strong>
                    <div style="font-size: 15px; color: #374151; white-space: pre-wrap; line-height: 1.6; background: white; padding: 12px; border-radius: 4px; border: 1px solid #F3F4F6;">${message}</div>
                </div>
            </div>
            
            <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background-color: ${PRIMARY_COLOR}; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
            </div>
        `
    });
};

// Template for the User confirmation
export const contactReceiptTemplate = ({ name, subject }) => {
    return emailLayout({
        title: "Message Received",
        previewText: "We have received your message and will get back to you soon.",
        content: `
            <h1 style="${STYLES.h1}">Hello ${name},</h1>
            <p style="${STYLES.p}">
                Thanks for reaching out! We've received your message regarding "<strong>${subject}</strong>" and one of our team members will get back to you shortly.
            </p>
            <div style="margin: 32px 0; border-left: 4px solid ${PRIMARY_COLOR}; padding-left: 20px;">
                <p style="font-style: italic; color: #4B5563; margin: 0;">
                    We usually respond within 24 hours. Your patience is appreciated!
                </p>
            </div>
            <p style="${STYLES.p}">
                In the meantime, feel free to explore our <a href="${CONFIG.SITE_URL}/docs" style="color: ${PRIMARY_COLOR}; text-decoration: underline;">documentation</a> or visit our <a href="${CONFIG.SITE_URL}" style="color: ${PRIMARY_COLOR}; text-decoration: underline;">homepage</a>.
            </p>
        `
    });
};

// Legacy Export for backward compatibility
export const contactTemplate = contactAdminTemplate;

