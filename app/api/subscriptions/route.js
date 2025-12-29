import { NextResponse } from "next/server";
import SubscriptionRepository from "@/lib/repositories/SubscriptionRepository";
import PaymentLinkRepository from "@/lib/repositories/PaymentLinkRepository";
import UserRepository from "@/lib/repositories/UserRepository";
import { getAuthUser } from "@/lib/auth";

/**
 * GET /api/subscriptions
 * Returns current user's subscription status, trial info, and renewal window
 */
export async function GET(req) {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Calculate trial end (createdAt + 24 hours)
        const user = await UserRepository.findById(session.id);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const trialEndsAt = new Date(user.createdAt);
        trialEndsAt.setHours(trialEndsAt.getHours() + 24);

        const now = new Date();
        const isInTrial = now < trialEndsAt;

        // Find active or scheduled subscription
        const subscription = await SubscriptionRepository.findRecentByStatus(session.id, ["trial", "active", "scheduled"]);

        // Check for pending payment links
        const pendingPaymentLink = await PaymentLinkRepository.findPendingByUserId(session.id);

        // Calculate renewal window (7 days before expiry)
        let inRenewalWindow = false;
        let daysUntilExpiry = null;

        if (subscription && subscription.endDate) {
            const daysRemaining = Math.ceil((new Date(subscription.endDate) - now) / (1000 * 60 * 60 * 24));
            daysUntilExpiry = daysRemaining;
            inRenewalWindow = daysRemaining <= 7 && daysRemaining > 0;
        }

        return NextResponse.json({
            success: true,
            data: {
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
                        // Fallback for mock provider if URL wasn't saved
                        pendingPaymentLink.provider === "mock"
                            ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/mock-payment/${pendingPaymentLink.providerPaymentLinkId}`
                            : "#"
                    ),
                } : null,
            },
        });
    } catch (error) {
        console.error("Get subscription error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
