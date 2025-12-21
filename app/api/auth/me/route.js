import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { verifyToken, getAuthToken } from "@/lib/auth/jwt";

export async function GET() {
    try {
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        await connectDB();
        const user = await User.findById(payload.userId).select("-password");

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                planStatus: user.planStatus,
                imageUrl: user.imageUrl,
            },
        });
    } catch (error) {
        console.error("Me error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
