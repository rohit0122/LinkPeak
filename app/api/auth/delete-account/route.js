import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function DELETE() {
    try {
        const response = await restClient.delete(
            BACKEND_ENDPOINTS.AUTH.DELETE_ACCOUNT
        );

        // Create response
        const res = NextResponse.json(response.data, {
            status: response.status,
        });

        // Safely delete cookie
        res.cookies.set("lpkSiteToken", "", {
            path: "/",
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete account" },
            { status: error?.response?.status || 500 }
        );
    }
}
