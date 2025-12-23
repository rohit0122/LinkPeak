import mongoose from "mongoose";

const BioPageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        title: {
            type: String,
            default: "My Bio",
        },
        bio: {
            type: String,
            default: "Welcome to my link-in-bio page!",
        },
        profileImage: {
            type: String,
        },
        theme: {
            type: String,
            default: "light",
        },
        template: {
            type: String,
            enum: ["classic", "grid", "hero", "social", "modern"],
            default: "classic",
        },
        socialLinks: {
            instagram: String,
            twitter: String,
            facebook: String,
            linkedin: String,
            github: String,
            youtube: String,
            tiktok: String,
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        seo: {
            title: String,
            description: String,
            keywords: String,
        },
        branding: {
            removeWatermark: { type: Boolean, default: false },
            customText: String,
            customUrl: String,
            // customLogo/Favicon could be added later if needed, starting with text/link
        },
    },
    { timestamps: true }
);

export default mongoose.models.BioPage || mongoose.model("BioPage", BioPageSchema);
