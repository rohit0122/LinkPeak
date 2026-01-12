import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function GET(req, { params }) {
    try {
        const { id } = await params;

        // Proxy to backend QR code generation
        // Note: The backend returns an SVG image with Content-Type: image/svg+xml
        const response = await restClient.get(BACKEND_ENDPOINTS.PUBLIC.QR_CODE(id), {
            responseType: 'text' // We expect SVG text/xml
        });

        return new NextResponse(response.data, {
            status: 200,
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "public, max-age=86400"
            }
        });

    } catch (error) {
        console.error("QR Code Proxy Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to generate QR code" },
            { status: error.response?.status || 500 }
        );
    }
}
