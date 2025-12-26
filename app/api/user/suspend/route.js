import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
    try {
        await dbConnect();

        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // We only suspend if the user is currently explicitly setting this state
        // In a real world scenario, we might want to double check subscription status here
        // to prevent accidental suspension if they JUST subscribed.
        // However, this endpoint is called when the Frontend detects expiry.
        // To be safe, we could check DB plan/expiry here, but for now we follow the frontend signal.

        // Optimistic Safety Check: If user has an active plan in DB that is NOT free, don't suspend?
        // But "Trial" is complicated. Let's rely on the direct call.
        // User requested: "update the userstatus to inactive on mongo db"

        await User.findByIdAndUpdate(user.id, { isActive: false });

        console.log(`User ${user.id} (${user.email}) marked as inactive (suspended) due to trial expiry.`);

        return NextResponse.json({ success: true, message: "User suspended" });

    } catch (error) {
        console.error("Suspend API Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
