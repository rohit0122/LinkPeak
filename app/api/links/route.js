import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Link from "@/models/Link";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        //console.log('session api links,  ', session)
        const { searchParams } = new URL(req.url);
        const pageId = searchParams.get("pageId");
        if (!pageId) return NextResponse.json({ success: false, error: "Page ID required" }, { status: 400 });

        await dbConnect();
        const links = await Link.find({ pageId, userId: session.id }).sort({ order: 1 });

        // --- Plan-Based Link Filtering (Handle Downgrades) ---
        const User = (await import("@/models/User")).default;
        const { CONFIG } = await import("@/constants/config");
        const user = await User.findById(session.id);
        const planLimit = CONFIG.PLAN_LIMITS[user?.plan || "FREE"].links;

        // Return only allowed number of links (preserves excess in DB)
        const filteredLinks = links.slice(0, planLimit);
        // -------------------------------------------------------

        return NextResponse.json({ success: true, data: filteredLinks });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getAuthUser();
        if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { pageId, title, url, icon } = await req.json();

        // Plan Limit Check
        const User = (await import("@/models/User")).default;
        const { CONFIG } = await import("@/constants/config");

        const user = await User.findById(session.id);
        const planLimit = CONFIG.PLAN_LIMITS[user.plan || "FREE"].links;
        const currentCount = await Link.countDocuments({ pageId, userId: session.id });

        if (currentCount >= planLimit) {
            return NextResponse.json({
                success: false,
                error: `Limit reached! Your ${user.plan} plan allows up to ${planLimit} links. Please upgrade for more.`
            }, { status: 403 });
        }

        const link = await Link.create({
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

        await dbConnect();
        const { id, ...updates } = await req.json();

        const link = await Link.findOneAndUpdate(
            { _id: id, userId: session.id },
            updates,
            { new: true }
        );

        if (!link) {
            return NextResponse.json({ success: false, error: "Link not found" }, { status: 404 });
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

        await dbConnect();
        const link = await Link.findOneAndDelete({ _id: id, userId: session.id });

        if (!link) {
            return NextResponse.json({ success: false, error: "Link not found" }, { status: 404 });
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

        await dbConnect();
        const { links } = await req.json(); // Array of { id, order }

        const bulkOps = links.map((link) => ({
            updateOne: {
                filter: { _id: link.id, userId: session.id },
                update: { order: link.order },
            },
        }));

        await Link.bulkWrite(bulkOps);

        return NextResponse.json({ success: true, message: "Links reordered" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
