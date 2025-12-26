import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { createToken } from "@/lib/auth";

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const user = await User.findOne({ email }).select("+password");
        //console.log('user ============= ', user);
        if (!user) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ success: false, error: "Please verify your email first" }, { status: 403 });
        }

        // Check if account is active (suspended)
        if (user.isActive === false) {
            return NextResponse.json({
                success: false,
                error: "Account suspended. Please contact support to reactivate."
            }, { status: 403 });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        }

        //console.log('user 222==========', user);

        const token = await createToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name,
            plan: user.plan,
            isActive: user.isActive,
        });

        const response = NextResponse.json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                role: user.role,
                plan: user.plan,
            },
        });

        /* response.cookies.set("token", token, {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: "strict",
             maxAge: 30 * 24 * 60 * 60, // 30 days
             path: "/",
         });*/

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
