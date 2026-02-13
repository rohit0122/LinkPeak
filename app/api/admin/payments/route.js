import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req) {
    try {
        const { search } = new URL(req.url);
        const response = await restClient.get(`${BACKEND_ENDPOINTS.ADMIN.PAYMENTS}${search}`);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch payments" },
            { status: error.response?.status || 500 }
        );
    }
}
