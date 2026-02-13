import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const response = await restClient.post(BACKEND_ENDPOINTS.ADMIN.OVERRIDE_PLAN(id), body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to override plan" },
            { status: error.response?.status || 500 }
        );
    }
}
