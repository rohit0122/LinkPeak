import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PaymentLink from "@/models/PaymentLink";

/**
 * Mock endpoint to simulate failed payment
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

        // Update payment link status
        paymentLink.status = "failed";
        await paymentLink.save();

        // Trigger mock webhook event
        const webhookPayload = {
            event: "payment.failed",
            payload: {
                payment_link: {
                    id: paymentLinkId,
                    status: "failed",
                    amount: paymentLink.amount,
                    currency: paymentLink.currency,
                    user_id: paymentLink.userId.toString(),
                    reference_id: paymentLink.metadata?.referenceId,
                },
            },
        };

        return NextResponse.json({
            success: true,
            message: "Payment failed",
            webhook: webhookPayload,
        });
    } catch (error) {
        console.error("Mock payment failed error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
