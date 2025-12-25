import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PaymentLink from "@/models/PaymentLink";
import Subscription from "@/models/Subscription";

/**
 * Mock endpoint to simulate successful payment
 * In production, this would be triggered by actual Razorpay webhook
 */
export async function POST(req) {
    try {
        await dbConnect();

        const { paymentLinkId } = await req.json();

        if (!paymentLinkId) {
            return NextResponse.json(
                { success: false, error: "paymentLinkId is required" },
                { status: 400 }
            );
        }

        // Find payment link
        const paymentLink = await PaymentLink.findOne({ providerPaymentLinkId: paymentLinkId });

        if (!paymentLink) {
            return NextResponse.json({ success: false, error: "Payment link not found" }, { status: 404 });
        }

        if (paymentLink.status === "paid") {
            return NextResponse.json({ success: true, message: "Payment already processed" });
        }

        // Update payment link status
        paymentLink.status = "paid";
        await paymentLink.save();

        // Create or update subscription
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1); // Monthly subscription

        // Check for existing active subscription
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
        } else {
            // Create new subscription
            await Subscription.create({
                userId: paymentLink.userId,
                planId: paymentLink.planId,
                status: "active",
                startDate,
                endDate,
                billingCycle: "monthly",
            });
        }

        // Trigger mock webhook event
        const webhookPayload = {
            event: "payment_link.paid",
            payload: {
                payment_link: {
                    id: paymentLinkId,
                    status: "paid",
                    amount: paymentLink.amount,
                    currency: paymentLink.currency,
                    user_id: paymentLink.userId.toString(),
                    reference_id: paymentLink.metadata?.referenceId,
                },
            },
        };

        return NextResponse.json({
            success: true,
            message: "Payment successful",
            webhook: webhookPayload,
        });
    } catch (error) {
        console.error("Mock payment success error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
