import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/db/connect";
import Link from "@/lib/db/models/Link";
import BioPage from "@/lib/db/models/BioPage";

// GET all links for a user's page
export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = payload.userId;

        await connectDB();
        const page = await BioPage.findOne({ ownerId: userId });
        if (!page) return NextResponse.json([]);

        const links = await Link.find({ pageId: page._id }).sort({ priorityScore: -1 });
        return NextResponse.json(links);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// POST new link
export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = payload.userId;

        const { title, url, pageId } = await req.json();

        await connectDB();

        // Verify ownership of the page
        const page = await BioPage.findOne({ _id: pageId, ownerId: userId });
        if (!page) return new NextResponse("Forbidden", { status: 403 });

        const newLink = await Link.create({
            pageId,
            title,
            url,
            isActive: true,
            priorityScore: 0
        });

        return NextResponse.json(newLink);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// PATCH update link
export async function PATCH(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = payload.userId;

        const { id, ...updates } = await req.json();

        await connectDB();
        const link = await Link.findById(id).populate('pageId');
        if (!link || link.pageId.ownerId !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const updatedLink = await Link.findByIdAndUpdate(id, updates, { new: true });
        return NextResponse.json(updatedLink);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// DELETE link
export async function DELETE(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = payload.userId;

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        await connectDB();
        const link = await Link.findById(id).populate('pageId');
        if (!link || link.pageId.ownerId !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await Link.findByIdAndDelete(id);
        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
