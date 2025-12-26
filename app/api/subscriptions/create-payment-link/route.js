import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subscription from "@/models/Subscription";
import PaymentLink from "@/models/PaymentLink";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import { getPaymentProvider } from "@/lib/payment";

/**
 * POST /api/subscriptions/create-payment-link
 * Creates a payment link for subscription (new or renewal)
 */
export async function POST(req) {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { planId } = await req.json();

        if (!planId || !["FREE", "PRO", "AGENCY"].includes(planId)) {
            return NextResponse.json(
                { success: false, error: "Valid planId (FREE/PRO/AGENCY) is required" },
                { status: 400 }
            );
        }

        // Get user for trial calculation
        const user = await User.findById(session.id);
        const trialEndsAt = new Date(user.createdAt);
        trialEndsAt.setHours(trialEndsAt.getHours() + 24);
        const now = new Date();
        const isInTrial = now < trialEndsAt;

        // Check for active subscription
        const activeSubscription = await Subscription.findOne({
            userId: session.id,
            status: { $in: ["active", "scheduled"] },
        });

        // Determine if user is eligible to create payment link
        let isEligible = false;
        let reason = "";

        if (isInTrial && !activeSubscription) {
            // User in trial, no active subscription - can subscribe
            isEligible = true;
            reason = "trial_subscription";
        } else if (activeSubscription) {
            // Check renewal window (7 days before expiry)
            const daysRemaining = Math.ceil((activeSubscription.endDate - now) / (1000 * 60 * 60 * 24));
            if (daysRemaining <= 7 && daysRemaining > 0) {
                isEligible = true;
                reason = "renewal_window";
            } else {
                return NextResponse.json(
                    { success: false, error: "Renewal window not yet open. Available 7 days before expiry." },
                    { status: 403 }
                );
            }
        } else {
            // Trial expired, no active subscription - can subscribe
            isEligible = true;
            reason = "expired_trial";
        }

        if (!isEligible) {
            return NextResponse.json(
                { success: false, error: "Not eligible to create payment link at this time" },
                { status: 403 }
            );
        }

        // Check for existing pending payment link
        const existingLink = await PaymentLink.findOne({
            userId: session.id,
            status: "created",
            expiresAt: { $gt: now },
        });

        if (existingLink) {
            return NextResponse.json(
                { success: false, error: "You already have a pending payment link. Please complete or wait for it to expire." },
                { status: 400 }
            );
        }

        // Define plan amounts (in paise for USD)
        const planAmounts = {
            FREE: 0,
            PRO: 49900, // ₹499
            AGENCY: 99900, // ₹999
        };

        const amount = planAmounts[planId];

        // Get payment provider
        const provider = getPaymentProvider();

        // Create payment link
        const paymentLinkData = await provider.createPaymentLink({
            userId: session.id,
            planId,
            amount,
            currency: "USD",
            description: `${planId} Plan - Monthly Subscription`,
        });

        // Store in database
        const paymentLink = await PaymentLink.create({
            userId: session.id,
            planId,
            provider: process.env.PAYMENT_PROVIDER || "mock",
            providerPaymentLinkId: paymentLinkData.id,
            url: paymentLinkData.short_url,
            amount,
            currency: "USD",
            expiresAt: new Date(paymentLinkData.expire_by * 1000),
            status: "created",
            metadata: {
                reason,
                description: paymentLinkData.description,
                referenceId: paymentLinkData.reference_id,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                paymentLinkId: paymentLink._id,
                providerPaymentLinkId: paymentLink.providerPaymentLinkId,
                url: paymentLinkData.short_url,
                amount: paymentLink.amount,
                currency: paymentLink.currency,
                expiresAt: paymentLink.expiresAt,
                planId: paymentLink.planId,
            },
        });
    } catch (error) {
        console.error("Create payment link error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
