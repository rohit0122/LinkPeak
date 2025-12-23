import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        await dbConnect();
        const adminEmail = "rohit.shrivastava22@outlook.com";

        console.log(`[SETUP-ADMIN] Searching for ${adminEmail}`);
        const user = await User.findOne({ email: adminEmail });

        if (!user) {
            console.log(`[SETUP-ADMIN] User not found.`);
            return NextResponse.json({
                success: false,
                message: `User ${adminEmail} not found. Please register first at /register`
            }, { status: 404 });
        }

        console.log(`[SETUP-ADMIN] User found. Current role: ${user.role}. Updating...`);
        user.role = "admin";
        user.plan = "AGENCY";
        user.isVerified = true;
        user.isActive = true;
        await user.save();

        console.log(`[SETUP-ADMIN] Update successful. New role: ${user.role}`);

        return NextResponse.json({
            success: true,
            message: `SUCCESS! ${adminEmail} is now an ADMIN. IMPORTANT: You must LOG OUT and LOG IN again for this to take effect!`,
            debug: {
                email: user.email,
                role: user.role,
                plan: user.plan,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error(`[SETUP-ADMIN] Error:`, error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
