import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();
        const response = await restClient.post(BACKEND_ENDPOINTS.TRACK.LIKE, body);
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error("Track Like Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
