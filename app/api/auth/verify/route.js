import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Call Laravel Backend
    const response = await restClient.post(BACKEND_ENDPOINTS.AUTH.VERIFY, {
      token: body.lpkVerifyToken,
    });
    const { data, status } = response;
    return NextResponse.json(data, { status: status || 200 });
  } catch (error) {
    console.error("Verification Proxy Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
