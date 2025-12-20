import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db/connect";
import BioPage from "@/lib/db/models/BioPage";

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        console.log("API_BIO_CREATE: Connecting DB...");
        await connectDB();
        console.log("API_BIO_CREATE: DB Connected.");
        const { slug, title, bio } = await req.json();
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
