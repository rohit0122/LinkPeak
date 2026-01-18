import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();
        const response = await restClient.post(BACKEND_ENDPOINTS.SUBSCRIPTION.RETRY_INIT, {
        });
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to retry init subscription" },
            { status: error.response?.data?.status || 500 }
        );
    }
}
