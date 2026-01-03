import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function checkAdmin(req) {
    const lpkSiteToken = req.cookies.get("lpkSiteToken")?.value;
    if (!lpkSiteToken) return null;
    try {
        const { payload } = await jwtVerify(lpkSiteToken, secret);
        return payload.role === "admin" ? payload : null;
    } catch {
        return null;
    }
}

export async function GET(req) {
    try {
        if (!(await checkAdmin(req))) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const query = search ? {
            $and: [
                { role: { $ne: "admin" } },
                {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } }
                    ]
                }
            ]
        } : { role: { $ne: "admin" } };

        const [users, total] = await Promise.all([
            User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query)
        ]);

        return NextResponse.json({
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        if (!(await checkAdmin(req))) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { userId, updates } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
        }

        // Prevent admin from deactivating themselves or changing their own role
        const admin = await checkAdmin(req);
        if (admin.id === userId && (updates.isActive === false || updates.role)) {
            return NextResponse.json({ success: false, error: "You cannot deactivate or Downgrade yourself" }, { status: 400 });
        }

        // Prevent promoting anyone to admin
        if (updates.role === 'admin') {
            return NextResponse.json({ success: false, error: "You cannot promote users to Admin" }, { status: 403 });
        }

        const currentUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        return NextResponse.json({ success: true, data: currentUser });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
