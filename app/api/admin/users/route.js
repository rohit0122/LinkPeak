import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req) {
    try {
        // Pass query params (pagination etc)
        const { search } = new URL(req.url);
        const response = await restClient.get(`${BACKEND_ENDPOINTS.ADMIN.USERS}${search}`);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: error.response?.status || 500 }
        );
    }
}
