import { NextResponse } from "next/server";
import { CONFIG } from "@/constants/config";
import { sendContactReceiptEmail, sendContactAdminEmail } from "@/lib/mailer";

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

        // 1. Send receipt to User
        try {
            await sendContactReceiptEmail(email, name, subject);
        } catch (mailError) {
            console.error("Contact receipt email failed:", mailError);
        }

        // 2. Send notification to Admin
        try {
            const adminEmail = process.env.ADMIN_EMAIL || CONFIG.SUPPORT_EMAIL;
            await sendContactAdminEmail(adminEmail, { name, email, subject, message });
        } catch (mailError) {
            console.error("Contact admin email failed:", mailError);
        }

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
