import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const response = await restClient.post(BACKEND_ENDPOINTS.SUBSCRIPTION.SYNC_STATUS);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to sync subscription status" },
            { status: error.response?.status || 500 }
        );
    }
}
