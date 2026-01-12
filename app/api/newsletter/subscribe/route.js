import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();
        // Proxy to Laravel Backend
        // Ensure BACKEND_ENDPOINTS.NEWSLETTER is defined, or use configured path
        // In endpoints.js I had NEWSLETTER.SUBSCRIBE.
        // I need to be sure the path matches NEW_API.md: POST /newsletter/subscribe

        const response = await restClient.post(BACKEND_ENDPOINTS.NEWSLETTER.SUBSCRIBE, body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: error.response?.data?.message || "Subscription failed" },
            { status: error.response?.status || 500 }
        );
    }
}
