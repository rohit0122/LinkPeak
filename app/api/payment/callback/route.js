import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import { RazorpayProvider } from "@/lib/payment";

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            razorpay_payment_id,
            razorpay_payment_link_id,
            razorpay_signature,
            userId,
            planId,
        } = body;

        if (!razorpay_payment_id || !razorpay_payment_link_id || !razorpay_signature) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        /* const provider = new RazorpayProvider();
 
         const isValid = provider.verifyCallbackSignature({
             paymentId: razorpay_payment_id,
             paymentLinkId: razorpay_payment_link_id,
             signature: razorpay_signature,
         });
 
         if (!isValid) {
             return NextResponse.json({ success: false }, { status: 401 });
         }*/

        await dbConnect();

        // 🛑 Idempotency check
        const existing = await Subscription.findOne({
            userId,
            status: "active",
            planId,
        });

        if (existing) {
            return NextResponse.json({ success: true });
        }

        // Activate plan
        await User.findByIdAndUpdate(userId, {
            plan: planId,
            updatedAt: new Date(),
            isActive: true,
        });

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        await Subscription.create({
            userId,
            planId,
            status: "active",
            billingCycle: "monthly",
            startDate,
            endDate,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("Payment callback error:", err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
