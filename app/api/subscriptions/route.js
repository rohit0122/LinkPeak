import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req) {
    try {
        const response = await restClient.get(BACKEND_ENDPOINTS.PAYMENT.SUBSCRIPTIONS);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch plans" },
            { status: error.response?.status || 500 }
        );
    }
}
