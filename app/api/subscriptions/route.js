import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subscription from "@/models/Subscription";
import PaymentLink from "@/models/PaymentLink";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

/**
 * GET /api/subscriptions
 * Returns current currentUser's subscription status, trial info, and renewal window
 */
export async function GET(req) {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Calculate trial end (createdAt + 24 hours)
        // Note: We're using existing createdAt field, not adding trialEndsAt
        const currentUser = await User.findById(session.id);
        if (!currentUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const trialEndsAt = new Date(currentUser.createdAt);
        trialEndsAt.setHours(trialEndsAt.getHours() + 24);

        const now = new Date();
        const isInTrial = now < trialEndsAt;

        // Find active or scheduled subscription
        const subscription = await Subscription.findOne({
            userId: session.id,
            status: { $in: ["trial", "active", "scheduled"] },
        }).sort({ createdAt: -1 });

        // Check for pending payment links
        const pendingPaymentLink = await PaymentLink.findOne({
            userId: session.id,
            status: "created",
            expiresAt: { $gt: now },
        }).sort({ createdAt: -1 });

        // Calculate renewal window (7 days before expiry)
        let inRenewalWindow = false;
        let daysUntilExpiry = null;

        if (subscription && subscription.endDate) {
            const daysRemaining = Math.ceil((subscription.endDate - now) / (1000 * 60 * 60 * 24));
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
