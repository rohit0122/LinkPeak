import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const pageId = searchParams.get("pageId");

        const url = `${BACKEND_ENDPOINTS.ANALYTICS.STATS}?pageId=${pageId}`;
        const response = await restClient.get(url);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to load analytics" },
            { status: error.response?.status || 500 }
        );
    }
}
