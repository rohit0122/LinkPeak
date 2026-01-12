import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const response = await restClient.get(BACKEND_ENDPOINTS.LEADS(id));
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch leads" },
            { status: error.response?.status || 500 }
        );
    }
}
