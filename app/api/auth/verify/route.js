import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        if (!token) {
            return NextResponse.json({ success: false, error: "No token provided" }, { status: 400 });
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 400 });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.isActive = true;
        await user.save();
        return NextResponse.json({
            success: true,
            message: "Email verified successfully. You can now log in.",
        });
    } catch (error) {
        //console.log(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
