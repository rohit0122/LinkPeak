import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BioPage from "@/models/BioPage";
import Link from "@/models/Link";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
    try {
        await dbConnect();

        // Admin check (Double defense in addition to middleware)
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "admin") {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        const [totalUsers, totalViews, totalLinks, totalLikes, planDistribution] = await Promise.all([
            User.countDocuments(),
            BioPage.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
            Link.countDocuments(),
            BioPage.aggregate([{ $group: { _id: null, total: { $sum: "$likes" } } }]),
            User.aggregate([{ $group: { _id: "$plan", count: { $sum: 1 } } }])
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                totalViews: totalViews[0]?.total || 0,
                totalLinks,
                totalLikes: totalLikes[0]?.total || 0,
                planDistribution
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
