import { NextResponse } from "next/server";
import { getAuthToken, verifyToken } from "@/lib/auth/jwt";
import connectDB from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req) {
    try {
        const token = await getAuthToken();
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: "Invalid session" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${payload.userId}-${Date.now()}${path.extname(file.name)}`;
        const publicPath = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(publicPath, filename);

        // Ensure directory exists
        try {
            await mkdir(publicPath, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }

        await writeFile(filePath, buffer);

        const imageUrl = `/uploads/${filename}`;

        await connectDB();
        await User.findByIdAndUpdate(payload.userId, { imageUrl });

        return NextResponse.json({
            success: true,
            imageUrl,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
