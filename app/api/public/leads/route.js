import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();
        // Public endpoint, restClient handles logic (no auth header if no cookie)
        const response = await restClient.post(BACKEND_ENDPOINTS.PUBLIC.LEADS, body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to submit lead" },
            { status: error.response?.status || 500 }
        );
    }
}
