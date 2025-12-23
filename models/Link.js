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

export default mongoose.models.Link || mongoose.model("Link", LinkSchema);
