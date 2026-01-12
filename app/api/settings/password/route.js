import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function PUT(req) {
    try {
        const body = await req.json();
        const response = await restClient.put(BACKEND_ENDPOINTS.SETTINGS.PASSWORD, body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.response?.data?.error || "Password update failed" },
            { status: error.response?.status || 500 }
        );
    }
}
