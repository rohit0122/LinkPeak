import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/db/connect";
import BioPage from "@/lib/db/models/BioPage";

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const userId = payload.userId;

        console.log("API_BIO_CREATE: Connecting DB...");
        await connectDB();
        console.log("API_BIO_CREATE: DB Connected.");
        console.log("API_BIO_CREATE: DB Connected.");

        const formData = await req.formData();
        const slug = formData.get("slug");
        const title = formData.get("title");
        const bio = formData.get("bio");

        console.log("API_BIO_CREATE: Body received:", { slug });

        // Check if slug is taken
        const existing = await BioPage.findOne({ slug: slug.toLowerCase() });
        if (existing) {
            return NextResponse.json({ error: "URL is already taken" }, { status: 400 });
        }

        await BioPage.create({
            ownerId: userId,
            slug: slug.toLowerCase(),
            title,
            bio
        });

        return NextResponse.redirect(new URL('/dashboard/links', req.url));
    } catch (error) {
        console.error("BIO_CREATE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
