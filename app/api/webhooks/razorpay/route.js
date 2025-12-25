import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PaymentLink from "@/models/PaymentLink";
import Subscription from "@/models/Subscription";
import User from "@/models/User";
import { getPaymentProvider } from "@/lib/payment";

/**
 * POST /api/webhooks/razorpay
 * Handles Razorpay webhook events (and mock events)
 */
export async function POST(req) {
    try {
        await dbConnect();

        const signature = req.headers.get("x-razorpay-signature") || req.headers.get("x-mock-signature");
        const payload = await req.json();

        // Get payment provider to validate webhook
        const provider = getPaymentProvider();

        let webhookData;
        try {
            webhookData = await provider.handleWebhook(payload, signature);
        } catch (error) {
            console.error("Webhook validation failed:", error);
            return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 401 });
        }

        const { event, paymentLinkId, status } = webhookData;

        console.log(`Webhook received: ${event} for payment link ${paymentLinkId}`);

        // Handle different webhook events
        switch (event) {
            case "payment_link.paid":
                await handlePaymentSuccess(paymentLinkId, webhookData);
                break;

            case "payment_link.expired":
                await handlePaymentExpired(paymentLinkId);
                break;

            case "payment.failed":
                await handlePaymentFailed(paymentLinkId);
                break;

            default:
                console.log(`Unhandled webhook event: ${event}`);
        }

        return NextResponse.json({ success: true, message: "Webhook processed" });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

/**
 * Handle successful payment
 * Creates or updates subscription (idempotent)
 */
async function handlePaymentSuccess(paymentLinkId, webhookData) {
    // Find payment link
    const paymentLink = await PaymentLink.findOne({ providerPaymentLinkId: paymentLinkId });

    if (!paymentLink) {
        console.error(`Payment link not found: ${paymentLinkId}`);
        return;
    }

    // Idempotency check - if already processed, skip
    if (paymentLink.status === "paid") {
        console.log(`Payment link already processed: ${paymentLinkId}`);
        return;
    }

    // Update payment link status
    paymentLink.status = "paid";
    await paymentLink.save();

    // Create or update subscription
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Monthly billing

    // Check for existing active subscription (idempotency)
    const existingSubscription = await Subscription.findOne({
        userId: paymentLink.userId,
        status: { $in: ["trial", "active"] },
    });

    if (existingSubscription) {
        // Update existing subscription
        existingSubscription.planId = paymentLink.planId;
        existingSubscription.status = "active";
        existingSubscription.startDate = startDate;
        existingSubscription.endDate = endDate;
        await existingSubscription.save();
        console.log(`Updated subscription ${existingSubscription._id} for user ${paymentLink.userId}`);
    } else {
        // Create new subscription
        const newSubscription = await Subscription.create({
            userId: paymentLink.userId,
            planId: paymentLink.planId,
            status: "active",
            startDate,
            endDate,
            billingCycle: "monthly",
        });
        console.log(`Created subscription ${newSubscription._id} for user ${paymentLink.userId}`);
    }

    // Update user's plan field (for backward compatibility with existing features)
    await User.findByIdAndUpdate(paymentLink.userId, {
        plan: paymentLink.planId,
        planExpiresAt: endDate,
    });

    console.log(`Payment success processed for ${paymentLinkId}`);
}

/**
 * Handle expired payment link
 */
async function handlePaymentExpired(paymentLinkId) {
    const paymentLink = await PaymentLink.findOne({ providerPaymentLinkId: paymentLinkId });

    if (!paymentLink) {
        console.error(`Payment link not found: ${paymentLinkId}`);
        return;
    }

    if (paymentLink.status !== "created") {
        console.log(`Payment link already processed: ${paymentLinkId}`);
        return;
    }

    paymentLink.status = "expired";
    await paymentLink.save();

    console.log(`Payment link expired: ${paymentLinkId}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentLinkId) {
    const paymentLink = await PaymentLink.findOne({ providerPaymentLinkId: paymentLinkId });

    if (!paymentLink) {
        console.error(`Payment link not found: ${paymentLinkId}`);
        return;
    }

    if (paymentLink.status !== "created") {
        console.log(`Payment link already processed: ${paymentLinkId}`);
        return;
    }

    paymentLink.status = "failed";
    await paymentLink.save();

    console.log(`Payment failed: ${paymentLinkId}`);
}
