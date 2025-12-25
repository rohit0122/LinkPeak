import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        planId: {
            type: String,
            enum: ["FREE", "PRO", "AGENCY"],
            required: true,
        },
        status: {
            type: String,
            enum: ["trial", "active", "expired", "scheduled"],
            required: true,
            default: "trial",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        billingCycle: {
            type: String,
            enum: ["monthly"],
            required: true,
            default: "monthly",
        },
    },
    { timestamps: true }
);

// Index for fast lookups
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ endDate: 1 }); // For finding expiring subscriptions

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
