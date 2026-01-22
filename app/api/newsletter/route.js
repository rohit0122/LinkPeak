import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req) {
    try {
        const response = await restClient.get(BACKEND_ENDPOINTS.ADMIN.NEWSLETTER);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: error.response?.data?.message || "Failed to fetch subscribers" },
            { status: error.response?.status || 500 }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const response = await restClient.post(BACKEND_ENDPOINTS.PUBLIC.NEWSLETTER_SUBSCRIBE, body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: error.response?.data?.message || "Subscription failed" },
            { status: error.response?.status || 500 }
        );
    }
}
