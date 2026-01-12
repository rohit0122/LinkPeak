import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        const body = await req.json();

        // 1. Call Laravel Backend
        const response = await restClient.post(BACKEND_ENDPOINTS.AUTH.LOGIN, body);
        const { data, status } = response;

        // 2. Handle Errors
        if (status >= 400 || !data.success) {
            return NextResponse.json(data, { status });
        }
        // 3. Create Next.js Response
        const rawToken = data.data?.token || data.token;
        const token = rawToken?.split("|")[1];

        // Remove token from response body
        if (data.data?.token) {
            delete data.data.token;
        }

        if (data.token) {
            delete data.token;
        }

        const nextResponse = NextResponse.json(data, { status: 200 }); //unset token from response

        // 4. Set HTTP-Only Cookie
        if (token) {
            nextResponse.cookies.set("lpkSiteToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // 30 Days
            });
        }

        return nextResponse;

    } catch (error) {
        console.error("Login Proxy Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
