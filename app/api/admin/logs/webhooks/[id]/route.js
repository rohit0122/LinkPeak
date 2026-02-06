import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const response = await restClient.get(BACKEND_ENDPOINTS.ADMIN.AUDIT_LOGS.WEBHOOK_BY_ID(id));
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch webhook log details" },
            { status: error.response?.status || 500 }
        );
    }
}
