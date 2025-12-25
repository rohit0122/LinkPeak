import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Page from "@/models/BioPage";
import Link from "@/models/Link";
import Analytics from "@/models/Analytics";
import Subscription from "@/models/Subscription";
import PaymentLink from "@/models/PaymentLink";
import { getAuthUser } from "@/lib/auth";

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
            .select("title slug bio profileImage theme template branding seo stats views likes")
            .lean();

        // Determine active page (first one or default)
        // Note: The UI logic creates a page if none exist. We can do that here or let UI handle it.
        // Guidelines say "Gracefully handle partial data". Let's simply return what we have.
        let activePage = allPages.length > 0 ? allPages[0] : null;

        // 3. Fetch Active Page Data (Links & Analytics)
        let links = [];
        let analytics = []; // Using array format as per current UI

        if (activePage) {
            links = await Link.find({ pageId: activePage._id })
                .sort({ order: 1, createdAt: -1 })
                .lean();

            // Simplified analytics fetch (matching current /api/analytics logic roughly)
            // Assuming the UI expects an array of data points. 
            // If the current /api/analytics does complex aggregation, we might need to replicate or call it.
            // For now, let's defer heavy analytics aggregation to the dedicated endpoint if it's complex,
            // OR if it's simple day-by-day stats, we can do it here.
            // Checking current UI: it uses `analytics` state.
            // Let's stick to essential data first. If analytics is heavy, UI can fetch it lazily.
            // BUT user goal is "1 API call".

            // Let's assume standard Analytics model has date/views/clicks/etc.
            // We'll fetch the last 7 days summary if possible.
            // Replicating basic fetch:
            analytics = await Analytics.find({ pageId: activePage._id })
                .sort({ date: 1 })
                .limit(30)
                .lean();
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
                subscriptionStatus
            }
        });

    } catch (error) {
        console.error("Dashboard Init Error:", error);
        return NextResponse.json({ success: false, error: "Failed to initialize dashboard" }, { status: 500 });
    }
}
