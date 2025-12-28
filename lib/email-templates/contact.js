import { emailLayout, PRIMARY_COLOR } from "./layout";
import { CONFIG } from "@/constants/config";

export const contactReceiptTemplate = ({ name, subject }) => {
    return emailLayout({
        title: "We've received your message",
        previewText: "Thank you for reaching out to LinkPeak support.",
        content: `
            <h1>Message Received</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Hi ${name},</p>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">Thanks for reaching out! We've received your message regarding "<strong>${subject}</strong>" and our team will get back to you as soon as possible (usually within 24 hours).</p>
            
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">In the meantime, feel free to check out our <a href="${CONFIG.SITE_URL}/faq" style="color: ${PRIMARY_COLOR}; text-decoration: none; font-weight: 500;">Help Center</a> for quick answers to common questions.</p>
            
            <p style="font-size: 16px; color: #4B5563; margin-top: 40px;">Best regards,<br>The ${CONFIG.SITE_NAME} Support Team</p>
        `
    });
};

export const contactAdminTemplate = ({ name, email, subject, message }) => {
    return emailLayout({
        title: "New Contact Message",
        previewText: `New message from ${name}: ${subject}`,
        content: `
            <h1>New Inquiry Received</h1>
            <p style="font-size: 16px; color: #4B5563; margin-bottom: 24px;">You have a new contact submission from the website.</p>
            
            <div style="background-color: #F9FAFB; padding: 24px; border-radius: 12px; border: 1px solid #E5E7EB; margin-bottom: 32px;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #6B7280;">USER DETAILS</p>
                <p style="margin: 0 0 8px 0; font-size: 16px; color: #111827;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 8px 0; font-size: 16px; color: #111827;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 0 0 24px 0; font-size: 16px; color: #111827;"><strong>Subject:</strong> ${subject}</p>
                
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #6B7280;">MESSAGE CONTENT</p>
                <div style="padding: 16px; background-color: #ffffff; border-radius: 8px; border: 1px solid #F3F4F6; white-space: pre-wrap; color: #374151; font-size: 15px;">${message}</div>
            </div>

            <div style="text-align: center;">
                <a href="mailto:${email}" class="button">Quick Reply</a>
            </div>
        `
    });
};

