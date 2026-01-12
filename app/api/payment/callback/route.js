import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
// Assuming Subscription verification is handled via callback
export async function POST(req) {
    try {
        const body = await req.json();
        // Proxy to Backend Verify
        const response = await restClient.post('/subscriptions/verify', body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Payment verification failed" },
            { status: error.response?.status || 500 }
        );
    }
}
