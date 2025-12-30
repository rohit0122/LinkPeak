import { NextResponse } from "next/server";
import UserRepository from "@/lib/repositories/UserRepository";
import BioPageRepository from "@/lib/repositories/BioPageRepository";
import LinkRepository from "@/lib/repositories/LinkRepository";
import AnalyticsRepository from "@/lib/repositories/AnalyticsRepository";
import SubscriptionRepository from "@/lib/repositories/SubscriptionRepository";
import PaymentLinkRepository from "@/lib/repositories/PaymentLinkRepository";
import { getAuthUser } from "@/lib/auth";
import { activateScheduledSubscriptions } from "@/lib/subscriptionHelper";
import { CONFIG } from "@/constants/config";
import { subDays, startOfDay } from "date-fns";

export async function GET(req) {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Activate any scheduled subscriptions that are due
        await activateScheduledSubscriptions(session.id);

        // 1. Fetch User
        const user = await UserRepository.findById(session.id);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // 2. Fetch Pages
        const allPages = await BioPageRepository.findByUserId(session.id);
        let activePage = allPages.length > 0 ? allPages[0] : null;

        // 3. Fetch Active Page Data (Links & Analytics)
        let links = [];
        let analytics = [];
        let lifetime = { totalViews: 0, totalClicks: 0, totalLikes: 0 };

        if (activePage) {
            links = await LinkRepository.findByPageId(activePage._id, session.id);

            // Fetch Date Range Analytics (SKIP FOR PERFORMANCE - Fetched on demand)
            analytics = [];

            // Fetch Lifetime Sum (KEEP THIS for Preview Phone Badge)
            lifetime = await AnalyticsRepository.getLifetimeSum(activePage._id, session.id);
        }

        // 4. Fetch Subscription Status
        const trialEndsAt = new Date(user.createdAt);
        trialEndsAt.setHours(trialEndsAt.getHours() + 24);
        const now = new Date();
        const isInTrial = now < trialEndsAt;

        const subscription = await SubscriptionRepository.findRecentByStatus(session.id, ["trial", "active", "scheduled"]);
        const pendingPaymentLink = await PaymentLinkRepository.findPendingByUserId(session.id);

        // Renewal logic
        let inRenewalWindow = false;
        let daysUntilExpiry = null;
        if (subscription && subscription.endDate) {
            const daysRemaining = Math.ceil((new Date(subscription.endDate) - now) / (1000 * 60 * 60 * 24));
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
                // user: user, // OPTIMIZATION: Removed redundant User object (frontend uses /me)
                pages: allPages,
                activePageId: activePage?._id, // OPTIMIZATION: Send ID only (object is in pages array)
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
