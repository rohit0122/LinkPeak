import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Call Laravel Backend
    console.log("sdasfsdf ", {
      ...body,
      password_confirmation: body.password,
    });
    const response = await restClient.post(BACKEND_ENDPOINTS.AUTH.REGISTER, {
      ...body,
      password_confirmation: body.password,
    });
    const { data, status } = response;
    // 2. Handle Errors
    if (status >= 400 || !data.success) {
      return NextResponse.json(data, { status: status });
    }

    // 3. Create Next.js Response
    const nextResponse = NextResponse.json(data, { status: 200 });

    // 4. Set HTTP-Only Cookie (if token provided on register)
    /*const token = data.data?.token || data.token;
        if (token) {
            nextResponse.cookies.set("lpkSiteToken", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // 30 Days
            });
        }*/

    return nextResponse;
  } catch (error) {
    console.error("Register Proxy Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
