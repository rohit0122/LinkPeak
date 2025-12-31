/*import Analytics from "@/models/Analytics";
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
*/

import Analytics from "@/models/Analytics";
import Link from "@/models/Link";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import {
    eachDayOfInterval,
    format,
    startOfDay,
    subDays
} from "date-fns";

class AnalyticsRepository {
    async connect() {
        await dbConnect();
    }

    /**
     * MAIN ENTRY
     * Returns chart-ready data ONLY
     */
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

    async getChartReadyAnalytics({
        pageId,
        plan = "FREE",
        range = "7d"
    }) {
        await this.connect();

        const RANGE_MAP = {
            FREE: [7],
            PRO: [7, 15, 30, 90],
            AGENCY: [7, 15, 30, 90, 180, "lifetime"]
        };

        const allowedRanges = RANGE_MAP[plan] || RANGE_MAP.FREE;
        if (!allowedRanges.includes(range)) {
            range = allowedRanges[0];
        }

        const isLifetime = range === "lifetime";
        const days = isLifetime ? null : Number(range);

        const startDate = isLifetime
            ? null
            : startOfDay(subDays(new Date(), days - 1));

        const groupType = this.getGroupType(range);

        return this.aggregateCharts({
            pageId,
            startDate,
            groupType,
            isLifetime
        });
    }

    /**
     * Decide aggregation level
     */
    getGroupType(range) {
        if (range === "lifetime" || range >= 180) return "month";
        if (range === 90) return "week";
        return "day";
    }

    /**
     * Mongo Aggregation
     */
    async aggregateCharts({ pageId, startDate, groupType, isLifetime }) {
        const match = {
            pageId: new mongoose.Types.ObjectId(pageId)
        };

        if (!isLifetime) {
            match.createdAt = { $gte: startDate };
        }

        const dateGroup =
            groupType === "day"
                ? { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                : groupType === "week"
                    ? {
                        $concat: [
                            { $toString: { $isoWeekYear: "$createdAt" } },
                            "-W",
                            { $toString: { $isoWeek: "$createdAt" } }
                        ]
                    }
                    : { $dateToString: { format: "%Y-%m", date: "$createdAt" } };

        const rows = await Analytics.aggregate([
            { $match: match },
            {
                $project: {
                    views: 1,
                    clicks: 1,
                    linkStats: 1,
                    bucket: dateGroup
                }
            },
            {
                $group: {
                    _id: "$bucket",
                    views: { $sum: "$views" },
                    clicks: { $sum: "$clicks" },
                    linkStats: { $push: "$linkStats" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return this.buildCharts(rows, groupType, startDate, pageId);
    }

    /**
     * Build Recharts-Ready Output
     */
    async buildCharts(rows, groupType, startDate, pageId) {
        // Fetch active links for label mapping
        const links = await Link.find({ isActive: true, pageId }).lean();
        const linkMap = {};
        links.forEach(l => (linkMap[l._id.toString()] = l.title));

        const summaryChart = [];
        const detailedLinksChart = [];

        // Date axis (for zero-fill)
        let axis = [];
        if (groupType === "day" && startDate) {
            axis = eachDayOfInterval({
                start: startDate,
                end: new Date()
            }).map(d => format(d, "yyyy-MM-dd"));
        }

        const rowMap = {};
        rows.forEach(r => (rowMap[r._id] = r));

        const finalAxis = axis.length ? axis : Object.keys(rowMap);

        for (const key of finalAxis) {
            const row = rowMap[key] || {
                views: 0,
                clicks: 0,
                linkStats: []
            };

            // Summary chart
            summaryChart.push({
                label: this.formatLabel(key, groupType),
                views: row.views || 0,
                clicks: row.clicks || 0
            });

            // Detailed links chart (flattened)
            const linkRow = { label: this.formatLabel(key, groupType) };

            links.forEach(link => {
                linkRow[link.title] = 0;
            });

            row.linkStats.flat().forEach(stat => {
                const id = stat.linkId?.toString();
                if (id && linkMap[id]) {
                    linkRow[linkMap[id]] += stat.clicks || 0;
                }
            });

            detailedLinksChart.push(linkRow);
        }

        return { summaryChart, detailedLinksChart };
    }

    formatLabel(key, type) {
        if (type === "day") {
            return format(new Date(key), "MMM dd");
        }
        if (type === "month") {
            return format(new Date(`${key}-01`), "MMM yyyy");
        }
        return key; // week
    }
}

export default new AnalyticsRepository();
