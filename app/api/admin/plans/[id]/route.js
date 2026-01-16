import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req, { params }) {
    const { id } = await params;
    try {
        const response = await restClient.get(BACKEND_ENDPOINTS.ADMIN.PLAN_BY_ID(id));
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch plan details" },
            { status: error.response?.status || 500 }
        );
    }
}

export async function PUT(req, { params }) {
    const { id } = await params;
    try {
        const body = await req.json();
        const response = await restClient.put(BACKEND_ENDPOINTS.ADMIN.PLAN_BY_ID(id), body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to update plan" },
            { status: error.response?.status || 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        const response = await restClient.delete(BACKEND_ENDPOINTS.ADMIN.PLAN_BY_ID(id));
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete plan" },
            { status: error.response?.status || 500 }
        );
    }
}
