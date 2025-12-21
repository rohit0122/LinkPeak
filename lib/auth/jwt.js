import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback_secret_change_me_in_production"
);

export async function signToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        // Ensure userId is a string to avoid Mongoose CastErrors
        if (payload && payload.userId && typeof payload.userId !== "string") {
            payload.userId = payload.userId.toString();
            // If it's a serialized BSON object, toast might show it as [object Object]
            // but Mongoose usually handles the toString() of the buffer-heavy object 
            // if it follows the BSON spec. However, our error showed a specific shape.
        }
        return payload;
    } catch (error) {
        console.error("Token verification error:", error);
        return null;
    }
}

export async function setAuthCookie(token) {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });
}

export async function getAuthToken() {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value;
}
