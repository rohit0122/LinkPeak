import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req) {
    try {
        const response = await restClient.get(BACKEND_ENDPOINTS.SUBSCRIPTION.STATUS);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to fetch subscription status" },
            { status: error.response?.status || 500 }
        );
    }
}
