import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("body", body);
    const url = `${BACKEND_ENDPOINTS.AI.GENERATE_SEO}`;
    console.log("url", url);
    const response = await restClient.post(url, body);
    console.log("response", response.data);
    return NextResponse.json({ ...response.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "AI generation failed" },
      { status: error.response?.status || 500 }
    );
  }
}
