import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
// Assuming Subscription verification is handled via callback
export async function GET(req) {
    try {
        // Proxy to Backend Verify
        const response = await restClient.get(BACKEND_ENDPOINTS.PAYMENT.GET_STATUS);
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Payment status check failed" },
            { status: error.response?.status || 500 }
        );
    }
}
