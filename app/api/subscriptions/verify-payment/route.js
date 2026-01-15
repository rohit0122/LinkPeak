import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();
        /**
         * {
            "razorpay_payment_id": "pay_...",
            "razorpay_subscription_id": "sub_...",
            "razorpay_signature": "..."
        }
         */
        const response = await restClient.post(BACKEND_ENDPOINTS.SUBSCRIPTION.VERIFY_PAYMENT, {
            razorpay_payment_id: body.razorpay_payment_id,
            razorpay_subscription_id: body.razorpay_subscription_id,
            razorpay_signature: body.razorpay_signature
        });
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to verify payment" },
            { status: error.response?.status || 500 }
        );
    }
}
