import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
        }

        await dbConnect();
        //console.log('session ', session);
        const currentUser = await User.findById(session.id);
        // console.log('currentUser ', currentUser);
        if (!currentUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: currentUser._id.toString(),
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                plan: currentUser.plan,
                isVerified: currentUser.isVerified,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
