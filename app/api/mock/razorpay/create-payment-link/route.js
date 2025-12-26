import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PaymentLink from "@/models/PaymentLink";
import { getAuthUser } from "@/lib/auth";
import { getPaymentProvider } from "@/lib/payment";

export async function POST(req) {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { planId, amount, description } = await req.json();

        if (!planId || !amount) {
            return NextResponse.json(
                { success: false, error: "planId and amount are required" },
                { status: 400 }
            );
        }

        // Get payment provider (mock or razorpay based on env)
        const provider = getPaymentProvider();

        // Create payment link via provider
        const paymentLinkData = await provider.createPaymentLink({
            userId: session.id,
            userEmail: session.email,
            planId,
            amount,
            currency: "USD",
            description: description || `Subscription to ${planId} plan`,
        });

        // Store payment link in database
        const paymentLink = await PaymentLink.create({
            userId: session.id,
            userEmail: session.email,
            planId,
            provider: process.env.PAYMENT_PROVIDER || "mock",
            providerPaymentLinkId: paymentLinkData.id,
            amount,
            currency: "USD",
            expiresAt: new Date(paymentLinkData.expire_by * 1000),
            status: "created",
            metadata: {
                description,
                referenceId: paymentLinkData.reference_id,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                paymentLinkId: paymentLink._id,
                url: paymentLinkData.short_url,
                expiresAt: paymentLink.expiresAt,
            },
        });
    } catch (error) {
        console.error("Create payment link error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
