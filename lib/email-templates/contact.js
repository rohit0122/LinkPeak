import { emailLayout, STYLES, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const contactTemplate = ({ name, email, subject, message }) => {
    return emailLayout({
        title: `New Message: ${subject}`,
        previewText: `New contact form submission from ${name}`,
        content: `
            <h1 style="${STYLES.h1}">New Contact Form Submission</h1>
            
            <div style="background-color: #F9FAFB; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #6B7280;">SENDER DETAILS</p>
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #111827;">${name}</p>
                <p style="margin: 0; color: ${PRIMARY_COLOR};"><a href="mailto:${email}" style="color: ${PRIMARY_COLOR}; text-decoration: none;">${email}</a></p>
            </div>

            <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #374151;">SUBJECT</p>
                <p style="margin: 0; color: #111827; background-color: #F3F4F6; padding: 12px; border-radius: 6px;">${subject}</p>
            </div>

            <div>
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #374151;">MESSAGE</p>
                <div style="background-color: #F3F4F6; padding: 16px; border-radius: 6px; color: #374151; white-space: pre-wrap; line-height: 1.6;">${message}</div>
            </div>
        `
    });
};
