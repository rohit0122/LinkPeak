import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
    {
        pageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BioPage",
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        clicks: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Unique index on pageId and date (without time)
AnalyticsSchema.index({ pageId: 1, date: 1 }, { unique: true });

export default mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);
