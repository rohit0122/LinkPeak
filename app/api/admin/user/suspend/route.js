import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();
        const response = await restClient.post(BACKEND_ENDPOINTS.ADMIN.SUSPEND, body); // Assuming endpoints.js has SUSPEND defined in ADMIN
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to suspend user" },
            { status: error.response?.status || 500 }
        );
    }
}
