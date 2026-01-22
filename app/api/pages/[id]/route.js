import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import restClient from "@/lib/restClient";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const pageId = await params;
  try {
    const response = await restClient.get(
      BACKEND_ENDPOINTS.PAGES.BY_ID(pageId.id)
    );
    //console.log('response ', response.data)
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Failed to fetch pages",
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(req, { params }) {
  const pageId = await params;
  const body = await req.json();
  try {
    const response = await restClient.put(
      BACKEND_ENDPOINTS.PAGES.BY_ID(pageId.id),
      body
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Failed to fetch pages",
      },
      { status: 200 }
    );
  }
}
