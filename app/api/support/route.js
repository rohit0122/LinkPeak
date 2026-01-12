import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req) {
  try {
    console.log(
      "BACKEND_ENDPOINTS.SUPPORT.BASE ",
      BACKEND_ENDPOINTS.SUPPORT.BASE
    );
    const response = await restClient.get(BACKEND_ENDPOINTS.SUPPORT.BASE);
    console.log("response.dataresponse.dataresponse.data ", response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch tickets" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await restClient.post(
      BACKEND_ENDPOINTS.SUPPORT.BASE,
      body
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create ticket" },
      { status: error.response?.status || 500 }
    );
  }
}
