import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function checkAdmin(req) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, secret);
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

        const query = search ? {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        } : {};

        const users = await User.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: users });
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

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
