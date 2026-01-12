import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

// GET: List all pages
export async function GET(req) {
    try {
        const response = await restClient.get(BACKEND_ENDPOINTS.PAGES.BASE);
        
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to fetch pages" },
            { status: error.response?.status || 500 }
        );
    }
}

// POST: Create a new page
export async function POST(req) {
    try {
        const body = await req.json();
        const response = await restClient.post(BACKEND_ENDPOINTS.PAGES.BASE, body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.response?.data?.message || "Failed to create page" },
            { status: error.response?.status || 500 }
        );
    }
}

// PATCH: Update a page (Proxies to Backend PUT /pages/{id})
export async function PATCH(req) {
    try {
        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const id = formData.get("id");

            if (!id) {
                return NextResponse.json({ success: false, error: "Page ID is required" }, { status: 400 });
            }

            // Laravel often struggles with PUT multipart, so we use POST with _method spoofing
            // formData.append("_method", "PUT");

            // We must create a new axios request for multipart
            // Note: axios with FormData in Node environment might require specific headers
            // But restClient is configured. We just need to post to the ID URL.
            // Actually, we should post to the resource URL? No, PUT is to /pages/{id}
            // But if we use POST with _method, we post to /pages/{id}
            //console.log('formData ', formData);
            //console.log('PUT URL ', BACKEND_ENDPOINTS.PAGES.BY_ID(id))
            const response = await restClient.post(BACKEND_ENDPOINTS.PAGES.BY_ID(id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            //console.log('response.data ', response.data);
            return NextResponse.json(response.data, { status: response.status });

        } else {
            // JSON fallback
            const body = await req.json();
            const { id, ...updates } = body;

            if (!id) {
                return NextResponse.json({ success: false, error: "Page ID is required" }, { status: 400 });
            }

            const response = await restClient.put(BACKEND_ENDPOINTS.PAGES.BY_ID(id), updates);
            return NextResponse.json(response.data, { status: response.status });
        }

    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.response?.data?.message || "Failed to update page" },
            { status: error.response?.status || 500 }
        );
    }
}
