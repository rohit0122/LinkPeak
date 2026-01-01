import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createToken(payload) {
    //console.log('payload ', payload.id.toString())
    return await new SignJWT({
        ...payload, id: payload.id.toString()
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(secret);
}

export async function verifyToken(lpkSiteToken) {
    try {
        const { payload } = await jwtVerify(lpkSiteToken, secret);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getAuthUser() {
    const cookieStore = await cookies();
    const lpkSiteToken = cookieStore.get("lpkSiteToken")?.value;

    if (!lpkSiteToken) return null;

    const payload = await verifyToken(lpkSiteToken);
    return payload;
}
