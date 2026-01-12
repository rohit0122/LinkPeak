import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const response = await restClient.post(
      BACKEND_ENDPOINTS.SUPPORT.REPLY(id),
      body
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to send reply" },
      { status: error.response?.status || 500 }
    );
  }
}
