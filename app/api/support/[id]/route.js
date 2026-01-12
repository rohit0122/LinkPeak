import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const response = await restClient.get(BACKEND_ENDPOINTS.SUPPORT.BY_ID(id));
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch ticket details" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const response = await restClient.put(
      BACKEND_ENDPOINTS.SUPPORT.BY_ID(id),
      body
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update ticket" },
      { status: error.response?.status || 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const response = await restClient.delete(
      BACKEND_ENDPOINTS.SUPPORT.BY_ID(id)
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete ticket" },
      { status: error.response?.status || 500 }
    );
  }
}
