import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { verifyToken, getAuthToken } from "@/lib/auth/jwt";

export async function PATCH(req) {
    try {
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        await connectDB();
        const { name, email, imageUrl } = await req.json();

        // Optional: Check if email is being changed and if it's already taken
        if (email) {
            const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: payload.userId } });
            if (existingUser) {
                return NextResponse.json({ error: "Email already in use" }, { status: 400 });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            payload.userId,
            {
                ...(name && { name }),
                ...(email && { email: email.toLowerCase() }),
                ...(imageUrl !== undefined && { imageUrl })
            },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                name: updatedUser.name,
                role: updatedUser.role,
                imageUrl: updatedUser.imageUrl,
            },
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
