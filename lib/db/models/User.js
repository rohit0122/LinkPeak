import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['FREE_USER', 'PRO_USER', 'ADMIN_USER'],
        default: 'FREE_USER',
    },
    planStatus: {
        type: String,
        enum: ['active', 'past_due', 'canceled'],
        default: 'active',
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
    },
    bio: {
        type: String,
        default: "",
    },
    imageUrl: {
        type: String,
    },
    views: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent model recompilation error in development
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
