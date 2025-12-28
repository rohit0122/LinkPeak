import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/mailer";

// Vercel Cron Secret Protection
// Set CRON_SECRET in your environment variables

export async function GET(req) {
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        await dbConnect();

        // 1. Unverified Users Reminder (24h+)
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const unverifiedUsers = await User.find({
            isVerified: false,
            createdAt: { $lt: dayAgo }
        });

        // 2. Plan Expiry Reminders (7, 3, 1 days)
        const checkWindow = (days) => {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() + days);
            const end = new Date(start);
            end.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: end };
        };

        const expiring7d = await User.find({ planExpiresAt: checkWindow(7), isActive: true });
        const expiring3d = await User.find({ planExpiresAt: checkWindow(3), isActive: true });
        const expiring1d = await User.find({ planExpiresAt: checkWindow(1), isActive: true });

        console.log(`[Cron] Found ${unverifiedUsers.length} unverified, ${expiring7d.length} exp in 7d, ${expiring3d.length} exp in 3d, ${expiring1d.length} exp in 1d.`);

        // 3. Send Emails
        const results = {
            verificationSent: 0,
            remindersSent: 0
        };

        // Resend Verification (Only once after 24h if still not verified)
        // We could track "verificationReminded" to avoid spam, but here we just do a simple check.

        for (const u of expiring7d) {
            await sendExpiryReminderEmail(u.email, u.name || "Creator", 7);
            results.remindersSent++;
        }
        for (const u of expiring3d) {
            await sendExpiryReminderEmail(u.email, u.name || "Creator", 3);
            results.remindersSent++;
        }
        for (const u of expiring1d) {
            await sendExpiryReminderEmail(u.email, u.name || "Creator", 1);
            results.remindersSent++;
        }

        return NextResponse.json({
            success: true,
            stats: {
                unverified: unverifiedUsers.length,
                expiring7d: expiring7d.length,
                expiring3d: expiring3d.length,
                expiring1d: expiring1d.length,
                emailsSent: results
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
