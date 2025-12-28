import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendSuspensionEmail } from "@/lib/mailer";

export async function POST(req) {
    try {
        await dbConnect();

        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch user data for name/email
        const dbUser = await User.findById(user.id);
        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await User.findByIdAndUpdate(user.id, { isActive: false });

        // Send Suspension Email
        try {
            await sendSuspensionEmail(dbUser.email, dbUser.name || "Creator", dbUser.plan === "FREE" ? "Trial" : "Subscription");
        } catch (mailError) {
            console.error("Suspension email failed:", mailError);
        }

        console.log(`User ${user.id} (${user.email}) marked as inactive (suspended) due to trial expiry.`);

        return NextResponse.json({ success: true, message: "User suspended" });

    } catch (error) {
        console.error("Suspend API Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
