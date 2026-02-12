import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log('body ', body)
        const response = await restClient.post(BACKEND_ENDPOINTS.TRACK.CLICK, body);
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error("Track Click Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
