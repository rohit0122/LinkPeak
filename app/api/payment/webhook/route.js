import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import { RazorpayProvider } from "@/lib/payment";

export async function POST(req) {
    try {
        const signature = req.headers.get("x-razorpay-signature");
        const payload = await req.json();

        const provider = new RazorpayProvider();
        const data = await provider.handleWebhook(payload, signature);

        // Map Razorpay event to our logic
        const { event, paymentLinkId, status: payStatus, userId, planId } = data;

        if (event === "payment_link.paid") {
            await dbConnect();

            // 🛑 Overlap & Idempotency Check
            const activeSub = await Subscription.findOne({
                userId,
                status: "active",
                endDate: { $gt: new Date() }
            }).sort({ endDate: -1 });

            let startDate = new Date();
            let endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            let status = "active";

            if (activeSub) {
                if (activeSub.planId === planId) {
                    activeSub.endDate = new Date(activeSub.endDate.getTime() + (30 * 24 * 60 * 60 * 1000));
                    activeSub.updatedAt = new Date();
                    await activeSub.save();
                    console.log(`Webhook: Extended subscription for currentUser ${userId}`);
                    return NextResponse.json({ success: true });
                } else {
                    startDate = activeSub.endDate;
                    endDate = new Date(startDate.getTime());
                    endDate.setMonth(endDate.getMonth() + 1);
                    status = "scheduled";
                }
            }

            // Activate User immediately if no active sub or matching plan
            if (status === "active") {
                await User.findByIdAndUpdate(userId, {
                    plan: planId,
                    isActive: true,
                    updatedAt: new Date(),
                });
            }

            // Create Subscription
            await Subscription.create({
                userId,
                planId,
                status: status,
                billingCycle: "monthly",
                startDate,
                endDate,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log(`Webhook: Processed ${event} for currentUser ${userId} (${status})`);
        } else if (event === "payment_link.expired" || event === "payment_link.cancelled") {
            console.log(`Webhook: Payment link ${paymentLinkId} ${event} for currentUser ${userId}`);
        }

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("Webhook error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
