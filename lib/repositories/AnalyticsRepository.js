import Analytics from "@/models/Analytics";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

class AnalyticsRepository {
    async connect() {
        await dbConnect();
    }

    async findByPageIdWithDateRange(pageId, startDate) {
        await this.connect();
        return Analytics.find({
            pageId,
            date: { $gte: startDate }
        })
            .sort({ date: 1 })
            .select("-__v -pageId -createdAt -updatedAt")
            .lean();
    }

    async getLifetimeSum(pageId) {
        await this.connect();
        const lifetimeSum = await Analytics.aggregate([
            {
                $match: {
                    pageId: new mongoose.Types.ObjectId(pageId)
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
