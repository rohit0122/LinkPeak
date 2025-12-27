import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        pageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BioPage",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        icon: {
            type: String, // String identifier for react-icons
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        clicks: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Indexes for fast lookups (Optimization)
LinkSchema.index({ pageId: 1, order: 1 });
LinkSchema.index({ userId: 1 });
LinkSchema.index({ pageId: 1, isActive: 1, order: 1 }); // For fetching active links

export default mongoose.models.Link || mongoose.model("Link", LinkSchema);

