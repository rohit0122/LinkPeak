import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAuthUser } from "@/lib/auth";

/**
 * POST /api/upload/profile
 * Client-optimized profile image upload endpoint
 * - Receives pre-processed base64 from client
 * - Generates hash for caching
 * - No server-side image processing needed
 */
export async function POST(req) {
    try {
        const session = await getAuthUser();
        if (!session) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { dataURI } = body;

        if (!dataURI || !dataURI.startsWith("data:image/")) {
            return NextResponse.json(
                { success: false, error: "Invalid image data" },
                { status: 400 }
            );
        }

        // Extract base64 data
        const base64Data = dataURI.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        // Generate hash for cache validation
        const hash = crypto
            .createHash("md5")
            .update(buffer)
            .digest("hex")
            .substring(0, 16);

        // Calculate size
        const sizeKB = (buffer.length / 1024).toFixed(2);

        console.log(`Profile image uploaded: ${sizeKB}KB, hash: ${hash}`);

        return NextResponse.json({
            success: true,
            data: {
                url: dataURI,
                hash: hash,
                size: buffer.length,
                sizeKB: sizeKB
            }
        });

    } catch (error) {
        console.error("Profile upload error:", error);
        return NextResponse.json(
            { success: false, error: "Image processing failed" },
            { status: 500 }
        );
    }
}
