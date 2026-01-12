import { NextResponse } from "next/server";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";

// GET: List links for a page
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const pageId = searchParams.get("pageId");

        const url = pageId
            ? `${BACKEND_ENDPOINTS.LINKS.BASE}?pageId=${pageId}`
            : BACKEND_ENDPOINTS.LINKS.BASE;

        const response = await restClient.get(url);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch links" },
            { status: error.response?.status || 500 }
        );
    }
}

// POST: Create a new link
export async function POST(req) {
    try {
        const body = await req.json();
        const response = await restClient.post(BACKEND_ENDPOINTS.LINKS.BASE, body);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to create link" },
            { status: error.response?.status || 500 }
        );
    }
}

// PATCH: Update a single link (Proxies to Backend PUT /links/{id})
export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) return NextResponse.json({ success: false, error: "Link ID required" }, { status: 400 });

        const response = await restClient.put(BACKEND_ENDPOINTS.LINKS.BY_ID(id), updates);
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to update link" },
            { status: error.response?.status || 500 }
        );
    }
}

// PUT: Bulk Reorder
export async function PUT(req) {
    try {
        const body = await req.json();

        // Check if it's a reorder request (contains 'links' array)
        if (body.links && Array.isArray(body.links)) {
            const response = await restClient.put(BACKEND_ENDPOINTS.LINKS.BULK_REORDER, body);
            return NextResponse.json(response.data, { status: response.status });
        }

        return NextResponse.json({ success: false, error: "Invalid request format" }, { status: 400 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to reorder links" },
            { status: error.response?.status || 500 }
        );
    }
}

// DELETE: Delete a link
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ success: false, error: "Link ID required" }, { status: 400 });

        // Backend expects DELETE /links/{id}
        const response = await restClient.delete(BACKEND_ENDPOINTS.LINKS.BY_ID(id));
        return NextResponse.json(response.data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to delete link" },
            { status: error.response?.status || 500 }
        );
    }
}
