import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        // 1. Call Laravel Backend (Optional: to invalidate token on server)
        // We attempt it, but even if it fails, we should clear the cookie on our end.
        try {
            await restClient.post(BACKEND_ENDPOINTS.AUTH.LOGOUT);
        } catch (backendError) {
            console.warn("Backend logout failed, clearing cookie anyway:", backendError.message);
        }

        // 2. Create Response
        const response = NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );

        // 3. Clear HTTP-Only Cookie
        response.cookies.delete("lpkSiteToken");

        return response;

    } catch (error) {
        console.error("Logout Proxy Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
