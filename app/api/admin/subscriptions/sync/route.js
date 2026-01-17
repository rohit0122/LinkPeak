import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const { search } = new URL(req.url);
        const response = await restClient.post(`${BACKEND_ENDPOINTS.ADMIN.SUBSCRIPTION_SYNC}${search}`);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to sync subscriptions" },
            { status: error.response?.status || 500 }
        );
    }
}
