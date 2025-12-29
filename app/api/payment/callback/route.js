import { NextResponse } from "next/server";
import UserRepository from "@/lib/repositories/UserRepository";
import SubscriptionRepository from "@/lib/repositories/SubscriptionRepository";
import { RazorpayProvider } from "@/lib/payment";

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            razorpay_payment_id,
            razorpay_payment_link_id,
            razorpay_payment_link_status,
            razorpay_payment_link_reference_id,
            razorpay_signature,
            userId,
            planId,
        } = body;

        if (!razorpay_payment_id || !razorpay_payment_link_id || !razorpay_signature) {
            return NextResponse.json({ success: false, error: "Missing required payment fields" }, { status: 400 });
        }

        const provider = new RazorpayProvider();

        // 1. Verify Signature (Security)
        const isValid = provider.verifyCallbackSignature({
            paymentId: razorpay_payment_id,
            paymentLinkId: razorpay_payment_link_id,
            paymentLinkStatus: razorpay_payment_link_status,
            paymentLinkReferenceId: razorpay_payment_link_reference_id,
            signature: razorpay_signature,
        });

        if (!isValid) {
            console.error("Invalid payment signature for:", razorpay_payment_link_id);
            return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 401 });
        }

        // 2. Extra Validation: Fetch real status from Razorpay
        const statusData = await provider.getPaymentLinkStatus(razorpay_payment_link_id);
        if (statusData.status !== "paid") {
            return NextResponse.json({
                success: false,
                error: `Payment link is ${statusData.status}. Status must be 'paid' to activate.`
            });
        }

        // 🛑 Idempotency & Overlap Check
        const activeSub = await SubscriptionRepository.findActiveByUserId(userId);

        let startDate = new Date();
        let endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        let status = "active";

        if (activeSub) {
            // If renewing SAME plan
            if (activeSub.planId === planId) {
                activeSub.endDate = new Date(activeSub.endDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                activeSub.updatedAt = new Date();
                await SubscriptionRepository.update(activeSub._id, activeSub);

                return NextResponse.json({ success: true, message: "Subscription extended" });
            } else {
                // Different plan (Upgrade/Downgrade scheduled after current)
                startDate = activeSub.endDate;
                endDate = new Date(startDate.getTime());
                endDate.setMonth(endDate.getMonth() + 1);
                status = "scheduled";
            }
        }

        // 3. Activate plan on User (Immediate if no active sub or if it matches active sub plan)
        if (status === "active") {
            await UserRepository.update(userId, {
                plan: planId,
                updatedAt: new Date(),
                isActive: true,
            });
        }

        // 4. Create Subscription record
        await SubscriptionRepository.create({
            userId,
            planId,
            status: status,
            billingCycle: "monthly",
            startDate,
            endDate,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("Payment callback error:", err);
        return NextResponse.json({ success: false, error: "Failed to process payment callback" }, { status: 500 });
    }
}
