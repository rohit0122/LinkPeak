import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();
        const response = await restClient.post(BACKEND_ENDPOINTS.SUBSCRIPTION.CHANGE_PLAN, { plan_slug: body.new_plan });
        //console.log('response.data ', response.data);
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        // console.log('error ', error);
        return NextResponse.json(
            { success: false, error: error.response?.data?.message || "Failed to change plan" },
            { status: error.response?.status || 500 }
        );
    }
}