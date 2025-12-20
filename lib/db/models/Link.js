import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BioPage",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: "default",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    priorityScore: {
        type: Number,
        default: 0,
    },
    visibleFrom: {
        type: Date,
    },
    visibleUntil: {
        type: Date,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    qrClicks: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Link = mongoose.models.Link || mongoose.model("Link", LinkSchema);
export default Link;
