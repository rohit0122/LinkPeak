import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendExpiryReminderEmail, sendSuspensionEmail } from "@/lib/mailer";

// Vercel Cron or GitHub Actions Secret Protection
// Set CRON_SECRET in your environment variables
export async function GET(req) {
    const authHeader = req.headers.get('authorization');
    const isProduction = process.env.NODE_ENV === 'production';

    // Security check
    if (isProduction && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        await dbConnect();

        // Helper to get date window for specific day offset
        const getDayWindow = (daysOffset) => {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            start.setDate(start.getDate() + daysOffset);

            const end = new Date(start);
            end.setHours(23, 59, 59, 999);

            return { $gte: start, $lte: end };
        };

        const results = {
            reminders: { d7: 0, d3: 0, d1: 0 },
            suspended: 0,
            errors: []
        };

        // 1. Send Reminders (7, 3, 1 days)
        const reminderOffsets = [7, 3, 1];
        for (const days of reminderOffsets) {
            const users = await User.find({
                planExpiresAt: getDayWindow(days),
                isActive: true,
                role: "user", // CRITICAL: Exclude admins
                plan: { $ne: "FREE" }
            });

            for (const user of users) {
                try {
                    await sendExpiryReminderEmail(user.email, user.name, days);
                    results.reminders[`d${days}`]++;
                } catch (err) {
                    console.error(`[Cron Email Error] ${user.email}:`, err);
                    results.errors.push(`Email error (Reminder ${days}d) for ${user.email}: ${err.message}`);
                }
            }
        }

        // 2. Handle Suspensions (ExpiresAt in the past)
        const now = new Date();
        const expiredUsers = await User.find({
            planExpiresAt: { $lt: now },
            isActive: true,
            role: "user", // CRITICAL: Exclude admins
            plan: { $ne: "FREE" }
        });

        for (const user of expiredUsers) {
            try {
                // Deactivate user
                user.isActive = false;
                await user.save();

                // Send suspension email
                await sendSuspensionEmail(user.email, user.name, "Your subscription has expired.");
                results.suspended++;
            } catch (err) {
                results.errors.push(`Suspension error for ${user.email}: ${err.message}`);
            }
        }

        console.log(`[Cron] Executed: ${results.suspended} suspended, reminders: ${JSON.stringify(results.reminders)}`);

        return NextResponse.json({
            success: true,
            executionTime: now.toISOString(),
            results
        });

    } catch (error) {
        console.error("[Cron Error]:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
