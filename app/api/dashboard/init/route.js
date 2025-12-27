import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Page from "@/models/BioPage";
import Link from "@/models/Link";
import Analytics from "@/models/Analytics";
import Subscription from "@/models/Subscription";
import PaymentLink from "@/models/PaymentLink";
import { getAuthUser } from "@/lib/auth";
import { activateScheduledSubscriptions } from "@/lib/subscriptionHelper";

/**
 * GET /api/dashboard/init
 * Aggregated endpoint for dashboard initialization.
 * Follows API_MERGER.md guidelines:
 * - Aggregates user, pages, active page data, and subscription.
 * - Optimized with field selection.
 * - Backward compatible (strictly read-only aggregation).
 */
export async function GET(req) {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Activate any scheduled subscriptions that are due
        await activateScheduledSubscriptions(session.id);

        // 1. Fetch User (Optimized fields)
        const user = await User.findById(session.id)
            .select("name email role plan createdAt profileImage bio")
            .lean();

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // 2. Fetch Pages (Optimized fields)
        // We fetching all pages to populate the selector
        const allPages = await Page.find({ userId: session.id })
            .sort({ createdAt: -1 })
            .select("title slug bio profileImage profileImageHash theme template branding seo socialLinks stats views likes")
            .lean();

        // Determine active page (first one or default)
        // Note: The UI logic creates a page if none exist. We can do that here or let UI handle it.
        // Guidelines say "Gracefully handle partial data". Let's simply return what we have.
        let activePage = allPages.length > 0 ? allPages[0] : null;

        // 3. Fetch Active Page Data (Links & Analytics)
        let links = [];
        let analytics = []; // Using array format as per current UI
        let lifetime = { totalViews: 0, totalClicks: 0, totalLikes: 0 };

        if (activePage) {
            links = await Link.find({ pageId: activePage._id })
                .sort({ order: 1, createdAt: -1 })
                .lean();

            // --- Optimized Analytics Strategy (Matching /api/analytics) ---
            const { CONFIG } = await import("@/constants/config");
            const { subDays, startOfDay } = await import("date-fns");
            const mongoose = (await import("mongoose")).default;

            let maxDays = CONFIG.PLAN_LIMITS[user.plan || "FREE"].analyticsDays;
            if (user.plan === "PRO") maxDays = CONFIG.PLAN_LIMITS.PRO.analyticsDays;
            if (user.plan === "AGENCY") maxDays = 36500;

            const startDate = startOfDay(subDays(new Date(), maxDays));

            // Fetch time-series data
            analytics = await Analytics.find({
                pageId: activePage._id,
                date: { $gte: startDate }
            }).sort({ date: 1 }).lean();

            // Fetch Lifetime Sum
            const lifetimeSum = await Analytics.aggregate([
                { $match: { pageId: new mongoose.Types.ObjectId(activePage._id) } },
                {
                    $group: {
                        _id: null,
                        totalViews: { $sum: "$views" },
                        totalClicks: { $sum: "$clicks" },
                        totalLikes: { $sum: "$likes" }
                    }
                }
            ]);
            lifetime = lifetimeSum[0] || { totalViews: 0, totalClicks: 0, totalLikes: 0 };
        }

        // 4. Fetch Subscription Status (Replicating logic from /api/subscriptions)
        // Logic: Trial (24h), Subscription (Active), PaymentLink (Pending)

        const trialEndsAt = new Date(user.createdAt);
        trialEndsAt.setHours(trialEndsAt.getHours() + 24);
        const now = new Date();
        const isInTrial = now < trialEndsAt;

        const subscription = await Subscription.findOne({
            userId: session.id,
            status: { $in: ["trial", "active", "scheduled"] },
        }).sort({ createdAt: -1 }).lean();

        const pendingPaymentLink = await PaymentLink.findOne({
            userId: session.id,
            status: "created",
            expiresAt: { $gt: now },
        }).sort({ createdAt: -1 }).lean();

        // Renewal logic
        let inRenewalWindow = false;
        let daysUntilExpiry = null;
        if (subscription && subscription.endDate) {
            const daysRemaining = Math.ceil((subscription.endDate - now) / (1000 * 60 * 60 * 24));
            daysUntilExpiry = daysRemaining;
            inRenewalWindow = daysRemaining <= 7 && daysRemaining > 0;
        }

        const subscriptionStatus = {
            trial: {
                active: isInTrial,
                endsAt: trialEndsAt,
            },
            subscription: subscription ? {
                id: subscription._id,
                planId: subscription.planId,
                status: subscription.status,
                startDate: subscription.startDate,
                endDate: subscription.endDate,
                billingCycle: subscription.billingCycle,
            } : null,
            renewalWindow: {
                active: inRenewalWindow,
                daysUntilExpiry,
            },
            pendingPaymentLink: pendingPaymentLink ? {
                id: pendingPaymentLink._id,
                planId: pendingPaymentLink.planId,
                amount: pendingPaymentLink.amount,
                expiresAt: pendingPaymentLink.expiresAt,
                url: pendingPaymentLink.url || (
                    pendingPaymentLink.provider === "mock"
                        ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/mock-payment/${pendingPaymentLink.providerPaymentLinkId}`
                        : "#"
                ),
            } : null,
        };


        return NextResponse.json({
            success: true,
            data: {
                user,
                pages: allPages,
                activePage,
                links,
                analytics,
                lifetime,
                subscriptionStatus
            }
        });

    } catch (error) {
        console.error("Dashboard Init Error:", error);
        return NextResponse.json({ success: false, error: "Failed to initialize dashboard" }, { status: 500 });
    }
}
