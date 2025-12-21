import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import BioPage from "@/lib/db/models/BioPage";
import { verifyToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export async function PATCH(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const userId = payload.userId;
        const { theme } = await req.json();

        await connectDB();

        const page = await BioPage.findOneAndUpdate(
            { ownerId: userId },
            {
                $set: {
                    "themeConfig.name": theme
                }
            },
            { new: true }
        );

        if (!page) {
            return NextResponse.json({ error: "Bio page not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, theme: page.themeConfig.name });

    } catch (error) {
        console.error("BIO_UPDATE_ERROR", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
