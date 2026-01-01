import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BioPage from "@/models/BioPage";
import Link from "@/models/Link";
import Subscription from "@/models/Subscription";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req) {
    try {
        await dbConnect();

        // Admin check
        const lpkSiteToken = req.cookies.get("lpkSiteToken")?.value;
        if (!lpkSiteToken) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const { payload } = await jwtVerify(lpkSiteToken, secret);
        if (payload.role !== "admin") {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        // Plan pricing (update these to match your actual prices)
        const PLAN_PRICES = { FREE: 0, PRO: 9, AGENCY: 49 };

        // Get date ranges
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            totalViews,
            totalLinks,
            totalLikes,
            planDistribution,
            activeSubscriptions,
            recentUsers,
            userGrowth,
            subscriptionTrends
        ] = await Promise.all([
            // Basic stats (Excluding admins)
            User.countDocuments({ role: { $ne: "admin" } }),
            BioPage.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "currentUser"
                    }
                },
                { $unwind: "$currentUser" },
                { $match: { "currentUser.role": { $ne: "admin" } } },
                { $group: { _id: null, total: { $sum: "$views" } } }
            ]),
            Link.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "currentUser"
                    }
                },
                { $unwind: "$currentUser" },
                { $match: { "currentUser.role": { $ne: "admin" } } },
                { $count: "total" }
            ]),
            BioPage.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "currentUser"
                    }
                },
                { $unwind: "$currentUser" },
                { $match: { "currentUser.role": { $ne: "admin" } } },
                { $group: { _id: null, total: { $sum: "$likes" } } }
            ]),

            // Plan distribution (Excluding admins) with status
            User.aggregate([
                { $match: { role: { $ne: "admin" } } },
                {
                    $group: {
                        _id: { plan: "$plan", isActive: "$isActive" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$_id.plan",
                        active: {
                            $sum: { $cond: [{ $eq: ["$_id.isActive", true] }, "$count", 0] }
                        },
                        inactive: {
                            $sum: { $cond: [{ $eq: ["$_id.isActive", false] }, "$count", 0] }
                        },
                        total: { $sum: "$count" }
                    }
                }
            ]),

            // Active subscriptions (Excluding admins)
            Subscription.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "currentUser"
                    }
                },
                { $unwind: "$currentUser" },
                { $match: { "currentUser.role": { $ne: "admin" } } },
                {
                    $match: {
                        status: "active",
                        endDate: { $gt: now }
                    }
                },
                { $group: { _id: "$planId", count: { $sum: 1 } } }
            ]),

            // Recent users (last 30 days) (Excluding admins)
            User.countDocuments({ role: { $ne: "admin" }, createdAt: { $gte: last30Days } }),

            // User growth (last 7 days) (Excluding admins)
            User.countDocuments({ role: { $ne: "admin" }, createdAt: { $gte: last7Days } }),

            // Subscription trends (Excluding admins)
            Subscription.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "currentUser"
                    }
                },
                { $unwind: "$currentUser" },
                { $match: { "currentUser.role": { $ne: "admin" } } },
                {
                    $match: {
                        createdAt: { $gte: last30Days }
                    }
                },
                {
                    $group: {
                        _id: "$planId",
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Calculate MRR (Monthly Recurring Revenue)
        const mrr = activeSubscriptions.reduce((acc, curr) => {
            return acc + (PLAN_PRICES[curr._id] || 0) * curr.count;
        }, 0);

        // Calculate ARR (Annual Recurring Revenue)
        const arr = mrr * 12;

        // Calculate conversion rate
        const paidUsers = planDistribution
            .filter(p => p._id !== 'FREE')
            .reduce((acc, curr) => acc + curr.count, 0);
        const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(2) : 0;

        // Calculate growth rate
        const growthRate = totalUsers > 0 ? ((recentUsers / totalUsers) * 100).toFixed(2) : 0;

        return NextResponse.json({
            success: true,
            data: {
                // Basic metrics
                totalUsers,
                totalViews: totalViews[0]?.total || 0,
                totalLinks: totalLinks[0]?.total || 0,
                totalLikes: totalLikes[0]?.total || 0,

                // Revenue metrics
                mrr,
                arr,

                // Growth metrics
                recentUsers,
                userGrowth,
                growthRate,

                // Conversion metrics
                paidUsers,
                conversionRate,

                // Distribution
                planDistribution,
                activeSubscriptions,
                subscriptionTrends
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
