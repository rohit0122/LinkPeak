import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { CONFIG } from "@/constants/config";

// Force Node.js runtime for nodemailer
export const runtime = 'nodejs';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required." },
                { status: 400 }
            );
        }

        // Configure Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.NODEMAILER_HOST,
            port: Number(process.env.NODEMAILER_PORT) || 587,
            secure: false, // Brevo uses 587 with STARTTLS usually
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        // Email Content
        const mailOptions = {
            from: `"${name}" <${process.env.NODEMAILER_USER_SENDER}>`, // Authenticated sender
            to: process.env.ADMIN_EMAIL || "admin@example.com", // List of receivers (Admin)
            replyTo: email, // Actual user email for reply
            subject: `[${CONFIG.SITE_NAME} Contact] ${subject}`,
            text: `
User Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
            `,
            html: `
<h3>New Contact Form Submission</h3>
<div style="padding: 15px; border: 1px solid #eee; border-radius: 5px; background: #f9f9f9;">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
    <p><strong>Subject:</strong> ${subject}</p>
</div>
<br/>
<h4>Message:</h4>
<div style="padding: 15px; background: white; border: 1px solid #eaeaea;">
    ${message.replace(/\n/g, '<br>')}
</div>
            `,
        };

        // Send Email
        if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASS) {
            console.warn("SMTP credentials not set. Email not sent.");
            // In dev mode, we might just log it and return success for loop testing
            if (process.env.NODE_ENV === 'development') {
                console.log("MOCK EMAIL SENT:", mailOptions);
                return NextResponse.json({ success: true, message: "Mock email sent (check console)" });
            }
            throw new Error("SMTP configuration missing");
        }

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { success: true, message: "Email sent successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            { error: "Failed to send message. Please try again later." },
            { status: 500 }
        );
    }
}
