import nodemailer from "nodemailer";
import { CONFIG } from "@/constants/config";
import { verificationTemplate } from "./email-templates/verification";
import { suspensionTemplate } from "./email-templates/suspension";
import { reminderTemplate } from "./email-templates/reminder";
import { welcomeTemplate } from "./email-templates/welcome";
import { resetPasswordTemplate } from "./email-templates/reset-password";
import { passwordChangedTemplate } from "./email-templates/password-changed";
import { contactReceiptTemplate, contactAdminTemplate } from "./email-templates/contact";

const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_PORT === "465",
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    },
});

export async function sendEmail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"${CONFIG.SITE_NAME}" <${process.env.NODEMAILER_USER_SENDER}>`,
            to,
            subject,
            html,
        });
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email error:", error);
        return { success: false, error: error.message };
    }
}

export async function sendVerificationEmail(email, token) {
    const html = verificationTemplate(token);
    return await sendEmail({
        to: email,
        subject: `Verify your ${CONFIG.SITE_NAME} account`,
        html
    });
}

export async function sendWelcomeEmail(email, name) {
    const html = welcomeTemplate({ name });
    return await sendEmail({
        to: email,
        subject: `Welcome to ${CONFIG.SITE_NAME}!`,
        html
    });
}

export async function sendSuspensionEmail(email, name, reason) {
    const html = suspensionTemplate({ name, reason });
    return await sendEmail({
        to: email,
        subject: `Account Suspended - ${CONFIG.SITE_NAME}`,
        html
    });
}

export async function sendExpiryReminderEmail(email, name, days) {
    const html = reminderTemplate({ name, days });
    return await sendEmail({
        to: email,
        subject: `${days} days remaining - ${CONFIG.SITE_NAME}`,
        html
    });
}

export async function sendResetPasswordEmail(email, token) {
    const html = resetPasswordTemplate(token);
    return await sendEmail({
        to: email,
        subject: `Reset your ${CONFIG.SITE_NAME} password`,
        html
    });
}

export async function sendContactReceiptEmail(email, name, subject) {
    const html = contactReceiptTemplate({ name, subject });
    return await sendEmail({
        to: email,
        subject: `We've received your message - ${CONFIG.SITE_NAME}`,
        html
    });
}

export async function sendContactAdminEmail(adminEmail, userData) {
    const html = contactAdminTemplate(userData);
    return await sendEmail({
        to: adminEmail,
        subject: `New Contact: ${userData.subject}`,
        html
    });
}

export async function sendPasswordChangedEmail(email, name) {
    const html = passwordChangedTemplate({ name });
    return await sendEmail({
        to: email,
        subject: `Your password has been changed - ${CONFIG.SITE_NAME}`,
        html
    });
}

