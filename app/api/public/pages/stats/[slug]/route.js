import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;
        const response = await restClient.get(BACKEND_ENDPOINTS.PUBLIC.GET_PAGE_STATS(slug));
        return NextResponse.json({ success: true, data: response.data, message: "Page stats fetched successfully" }, {
            status: 200
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to get page stats" },
            { status: error.response?.status || 500 }
        );
    }
}
