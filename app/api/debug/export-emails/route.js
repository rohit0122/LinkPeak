import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verificationTemplate } from "@/lib/email-templates/verification";
import { welcomeTemplate } from "@/lib/email-templates/welcome";
import { suspensionTemplate } from "@/lib/email-templates/suspension";
import { reminderTemplate } from "@/lib/email-templates/reminder";
import { resetPasswordTemplate } from "@/lib/email-templates/reset-password";
import { passwordChangedTemplate } from "@/lib/email-templates/password-changed";
import { contactReceiptTemplate, contactAdminTemplate } from "@/lib/email-templates/contact";

export async function GET() {
    try {
        const exportDir = path.join(process.cwd(), "public", "email", "sample");

        // Ensure directory exists
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const samples = [
            { name: "verification.html", html: verificationTemplate("dummy-lpkSiteToken") },
            { name: "welcome.html", html: welcomeTemplate({ name: "John Doe" }) },
            { name: "suspension.html", html: suspensionTemplate({ name: "John Doe", reason: "Trial Period Expired" }) },
            { name: "reminder-7days.html", html: reminderTemplate({ name: "John Doe", days: 7 }) },
            { name: "reminder-3days.html", html: reminderTemplate({ name: "John Doe", days: 3 }) },
            { name: "reminder-1day.html", html: reminderTemplate({ name: "John Doe", days: 1 }) },
            { name: "reset-password.html", html: resetPasswordTemplate("dummy-reset-lpkSiteToken") },
            { name: "password-changed.html", html: passwordChangedTemplate({ name: "John Doe" }) },
            { name: "contact-receipt.html", html: contactReceiptTemplate({ name: "John Doe", subject: "Billing Inquiry" }) },
            { name: "contact-admin.html", html: contactAdminTemplate({ name: "John Doe", email: "john@example.com", subject: "Billing Inquiry", message: "I have a question about my last invoice." }) },
        ];

        for (const sample of samples) {
            fs.writeFileSync(path.join(exportDir, sample.name), sample.html);
        }

        return NextResponse.json({
            success: true,
            message: `Exported ${samples.length} email templates to public/email/sample/`,
            path: "/email/sample/"
        });
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
