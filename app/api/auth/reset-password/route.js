import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();

        // 1. Call Laravel Backend
        const response = await restClient.post(BACKEND_ENDPOINTS.AUTH.RESET_PASSWORD, body);
        const { data, status } = response;

        return NextResponse.json(data, { status: status || 200 });

    } catch (error) {
        console.error("Reset Password Proxy Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
