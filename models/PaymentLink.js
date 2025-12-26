import mongoose from "mongoose";

const PaymentLinkSchema = new mongoose.Schema(
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
        subscriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
            required: false,
        },
        provider: {
            type: String,
            enum: ["mock", "razorpay"],
            required: true,
            default: "mock",
        },
        providerPaymentLinkId: {
            type: String,
            required: true,
            unique: true,
        },
        url: {
            type: String,
            required: false,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            default: "USD",
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["created", "paid", "expired", "failed"],
            required: true,
            default: "created",
        },
        metadata: {
            type: Object,
            default: {},
        },
    },
    { timestamps: true }
);

// Indexes for fast lookups
PaymentLinkSchema.index({ userId: 1, status: 1 });
PaymentLinkSchema.index({ expiresAt: 1 }); // For cleanup jobs

export default mongoose.models.PaymentLink || mongoose.model("PaymentLink", PaymentLinkSchema);
