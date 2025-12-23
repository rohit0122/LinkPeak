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
        const user = await User.findById(session.id);
        // console.log('user ', user);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                plan: user.plan,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
