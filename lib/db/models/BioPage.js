import mongoose from "mongoose";

const BioPageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    ownerId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        default: 'My LinkPeak'
    },
    bio: {
        type: String,
        default: ''
    },
    themeConfig: {
        name: {
            type: String,
            enum: ["minimal", "creator", "professional"],
            default: "creator",
        },
        backgroundColor: {
            type: String,
            default: '#FFFFFF'
        },
        textColor: {
            type: String,
            default: '#1e293b'
        },
        buttonColor: {
            type: String,
            default: '#4f46e5'
        }
    },
    views: {
        type: Number,
        default: 0
    },
    avatarUrl: {
        type: String
    },
}, { timestamps: true });

const BioPage = mongoose.models.BioPage || mongoose.model("BioPage", BioPageSchema);
export default BioPage;
