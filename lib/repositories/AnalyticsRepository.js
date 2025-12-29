import Analytics from "@/models/Analytics";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

class AnalyticsRepository {
    async connect() {
        await dbConnect();
    }

    async findByPageIdWithDateRange(pageId, startDate, userId) {
        await this.connect();
        return Analytics.find({
            pageId,
            userId,
            date: { $gte: startDate }
        })
            .sort({ date: 1 })
            .select("-__v -pageId -createdAt -updatedAt")
            .lean();
    }

    async getLifetimeSum(pageId, userId) {
        await this.connect();
        const lifetimeSum = await Analytics.aggregate([
            {
                $match: {
                    pageId: new mongoose.Types.ObjectId(pageId),
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                    totalClicks: { $sum: "$clicks" },
                    totalLikes: { $sum: "$likes" }
                }
            }
        ]);
        return lifetimeSum[0] || { totalViews: 0, totalClicks: 0, totalLikes: 0 };
    }
}

export default new AnalyticsRepository();
