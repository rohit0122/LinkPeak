import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req) {
    try {
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

export async function PATCH(req) {
    try {
        const body = await req.json();
        const response = await restClient.patch(BACKEND_ENDPOINTS.ADMIN.USERS, body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to update user" },
            { status: error.response?.status || 500 }
        );
    }
}
