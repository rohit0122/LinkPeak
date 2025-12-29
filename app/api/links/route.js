import { NextResponse } from "next/server";
import LinkRepository from "@/lib/repositories/LinkRepository";
import UserRepository from "@/lib/repositories/UserRepository";
import { getAuthUser } from "@/lib/auth";
import { CONFIG } from "@/constants/config";

export async function GET(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const pageId = searchParams.get("pageId");
        if (!pageId) return NextResponse.json({ success: false, error: "Page ID required" }, { status: 400 });

        const links = await LinkRepository.findByPageId(pageId, session.id);

        // Plan-Based Link Filtering
        const user = await UserRepository.findById(session.id);
        const planLimit = CONFIG.PLAN_LIMITS[user?.plan || "FREE"].links;
        const filteredLinks = links.slice(0, planLimit);

        return NextResponse.json({ success: true, data: filteredLinks });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { pageId, title, url, icon } = await req.json();

        // Plan Limit Check
        const user = await UserRepository.findById(session.id);
        const planLimit = CONFIG.PLAN_LIMITS[user.plan || "FREE"].links;
        const currentCount = await LinkRepository.countByPageId(pageId, session.id);

        if (currentCount >= planLimit) {
            return NextResponse.json({
                success: false,
                error: `Limit reached! Your ${user.plan} plan allows up to ${planLimit} links. Please upgrade for more.`
            }, { status: 403 });
        }

        const link = await LinkRepository.create({
            userId: session.id,
            pageId,
            title,
            url,
            icon,
            order: currentCount,
        });

        return NextResponse.json({ success: true, data: link });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { id, ...updates } = await req.json();
        const link = await LinkRepository.update(id, session.id, updates);

        if (!link) {
            return NextResponse.json({ success: false, error: "Link not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: link });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "Link ID required" }, { status: 400 });

        const link = await LinkRepository.delete(id, session.id);

        if (!link) {
            return NextResponse.json({ success: false, error: "Link not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Link deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { links } = await req.json(); // Array of { id, order }
        await LinkRepository.reorder(links, session.id);

        return NextResponse.json({ success: true, message: "Links reordered" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
