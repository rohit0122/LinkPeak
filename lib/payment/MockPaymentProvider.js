import PaymentProvider from "./PaymentProvider.js";
import crypto from "crypto";

/**
 * Mock Payment Provider for testing
 * Simulates Razorpay API responses without actual payment processing
 */
class MockPaymentProvider extends PaymentProvider {
    constructor() {
        super();
        this.baseUrl = process.env.MOCK_PAYMENT_BASE_URL || "http://localhost:3000/mock-payment";
    }

    /**
     * Generate a mock payment link ID
     */
    generatePaymentLinkId() {
        return `plink_mock_${crypto.randomBytes(16).toString("hex")}`;
    }

    /**
     * Create a mock payment link
     */
    async createPaymentLink({ userId, planId, amount, currency = "INR", description }) {
        const paymentLinkId = this.generatePaymentLinkId();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Mock Razorpay payment link response structure
        return {
            id: paymentLinkId,
            short_url: `${this.baseUrl}/${paymentLinkId}`,
            amount: amount,
            currency: currency,
            description: description,
            expire_by: Math.floor(expiresAt.getTime() / 1000),
            status: "created",
            user_id: userId,
            reference_id: `${userId}_${planId}_${Date.now()}`,
            created_at: Math.floor(Date.now() / 1000),
        };
    }

    /**
     * Verify a mock payment
     */
    async verifyPayment(paymentLinkId) {
        // In mock mode, we trust the webhook events
        // Real Razorpay would verify signature here
        return {
            verified: true,
            paymentLinkId,
        };
    }

    /**
     * Handle mock webhook event
     */
    async handleWebhook(payload, signature) {
        // Mock signature validation (always passes)
        const isValid = this.validateWebhookSignature(payload, signature);

        if (!isValid) {
            throw new Error("Invalid webhook signature");
        }

        // Extract event data (Razorpay format)
        const event = payload.event;
        const paymentLinkData = payload.payload?.payment_link || {};

        return {
            event,
            paymentLinkId: paymentLinkData.id,
            status: paymentLinkData.status,
            amount: paymentLinkData.amount,
            currency: paymentLinkData.currency,
            userId: paymentLinkData.user_id,
            referenceId: paymentLinkData.reference_id,
        };
    }

    /**
     * Validate webhook signature (mock implementation)
     */
    validateWebhookSignature(payload, signature) {
        // In mock mode, we accept any signature
        // Real implementation would use HMAC SHA256 with webhook secret
        const mockSecret = process.env.MOCK_WEBHOOK_SECRET || "mock_webhook_secret";

        if (!signature) {
            return true; // Allow unsigned webhooks in mock mode
        }

        // Simple validation for mock
        const expectedSignature = crypto
            .createHmac("sha256", mockSecret)
            .update(JSON.stringify(payload))
            .digest("hex");

        return signature === expectedSignature;
    }

    /**
     * Get payment link status
     */
    async getPaymentLinkStatus(paymentLinkId) {
        // Mock implementation - would call Razorpay API in production
        return {
            id: paymentLinkId,
            status: "created", // Default status
            amount: 0,
            currency: "INR",
        };
    }
}

export default MockPaymentProvider;
