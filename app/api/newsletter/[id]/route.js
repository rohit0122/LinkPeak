import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const response = await restClient.delete(BACKEND_ENDPOINTS.ADMIN.NEWSLETTER_BY_ID(id));
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { error: error.response?.data?.message || "Failed to delete subscriber" },
            { status: error.response?.status || 500 }
        );
    }
}
