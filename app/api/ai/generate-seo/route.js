import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
  try {
    const body = await req.json();
    const url = `${BACKEND_ENDPOINTS.AI.GENERATE_SEO}`;
    const response = await restClient.post(url, body);
    return NextResponse.json({ ...response.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "AI generation failed" },
      { status: error.response?.status || 500 }
    );
  }
}
