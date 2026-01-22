import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId");
    const range = searchParams.get("range") || "7d";

    const url = `${BACKEND_ENDPOINTS.ANALYTICS.CHARTS}?pageId=${pageId}&range=${range}`;
    const response = await restClient.get(url);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to load charts" },
      { status: error.response?.status || 500 }
    );
  }
}
