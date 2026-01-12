import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function DELETE(req) {
    try {
        const response = await restClient.delete(BACKEND_ENDPOINTS.AUTH.DELETE_ACCOUNT);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete account" },
            { status: error.response?.status || 500 }
        );
    }
}
