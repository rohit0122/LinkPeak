import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import { getPlanIdByName } from "@/constants/config";
// Assuming Subscription verification is handled via callback
export async function POST(req) {
    try {
        const body = await req.json();
        const realPlanId = 33333;//await getPlanIdByName(body.planId);
        // Proxy to Backend Verify
        const response = await restClient.post(BACKEND_ENDPOINTS.PAYMENT.GET_PAYMENT_URL, { plan_id: realPlanId });
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Payment link generation failed" },
            { status: error.response?.status || 500 }
        );
    }
}
