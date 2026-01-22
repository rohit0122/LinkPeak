import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

export async function POST(req) {
    try {
        // 1️⃣ Parse body safely
        let body;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON payload" },
                { status: 400 }
            );
        }

        const { name, email, subject = "", message } = body ?? {};
        // 2️⃣ Strong validation
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return NextResponse.json(
                { error: "Name, email, and message are required." },
                { status: 400 }
            );
        }

        // 3️⃣ Basic email sanity check (lightweight)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address." },
                { status: 400 }
            );
        }

        // 4️⃣ Call backend (single responsibility)
        const response = await restClient.post(
            BACKEND_ENDPOINTS.PUBLIC.CONTACT_US,
            { name, email, subject, message },
            { timeout: 8000 } // prevents hanging requests
        );
        return NextResponse.json(
            { ...response.data },
            { status: response.status }
        );

    } catch (error) {
        // 5️⃣ Normalize backend / axios errors
        const status =
            error?.response?.status >= 400 && error?.response?.status < 600
                ? error.response.status
                : 500;

        console.error("Contact API Error:", {
            status,
            message: error?.message,
        });

        return NextResponse.json(
            { error: "Failed to send message. Please try again later." },
            { status }
        );
    }
}
