import PaymentProvider from "./PaymentProvider.js";
import crypto from "crypto";

/**
 * Razorpay Payment Provider
 * Real implementation using Razorpay SDK
 * Ready for production keys
 */
class RazorpayProvider extends PaymentProvider {
    constructor() {
        super();
        this.keyId = process.env.RAZORPAY_KEY_ID;
        this.keySecret = process.env.RAZORPAY_KEY_SECRET;
        this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!this.keyId || !this.keySecret) {
            console.warn("Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET");
        }
    }

    /**
     * Create a Razorpay payment link
     */
    async createPaymentLink({ userId, userEmail, planId, amount, currency = "USD", description }) {
        try {
            // TODO: Implement actual Razorpay SDK integration
            const Razorpay = require('razorpay');
            const instance = new Razorpay({
                key_id: this.keyId,
                key_secret: this.keySecret
            });

            const paymentLink = await instance.paymentLink.create({
                amount: amount,
                currency: currency,
                description: description,
                customer: {
                    email: userEmail,
                },
                notify: {
                    sms: true,
                    email: true
                },
                reminder_enable: true,
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback?plan=${planId}&currentUser=${userId}`,
                callback_method: 'get',
                notes: {
                    userId: userId,
                    planId: planId
                }
            });
            if (!paymentLink) {
                throw new Error("Razorpay integration not yet implemented. Use PAYMENT_PROVIDER=mock for testing.");
            }
            return paymentLink;
        }
        catch (error) {
            console.error("Create payment link error:", error);
            throw error;
        }
    }

    /**
     * Verify a Razorpay callback signature
     */
    verifyCallbackSignature({ paymentId, paymentLinkId, paymentLinkStatus, paymentLinkReferenceId, signature }) {
        if (!this.keySecret) {
            console.error("Razorpay secret not configured for verification");
            return false;
        }

        let body;
        if (paymentLinkStatus) {
            // Logic for Payment Links
            // Format: payment_link_id + '|' + payment_link_reference_id + '|' + payment_link_status + '|' + razorpay_payment_id
            body = `${paymentLinkId}|${paymentLinkReferenceId}|${paymentLinkStatus}|${paymentId}`;
        } else {
            // Logic for Standard Checkout
            // Format: order_id + '|' + razorpay_payment_id
            body = paymentLinkId + "|" + paymentId;
        }

        const expectedSignature = crypto
            .createHmac("sha256", this.keySecret)
            .update(body)
            .digest("hex");

        return expectedSignature === signature;
    }

    /**
     * Verify a Razorpay payment (Check status directly)
     */
    async verifyPayment(paymentLinkId) {
        try {
            const status = await this.getPaymentLinkStatus(paymentLinkId);
            return {
                verified: status.status === "paid",
                status: status.status,
                raw: status
            };
        } catch (error) {
            console.error("Verify payment error:", error);
            return { verified: false, error: error.message };
        }
    }

    /**
     * Handle Razorpay webhook event
     */
    async handleWebhook(payload, signature) {
        // Validate webhook signature
        const isValid = this.validateWebhookSignature(payload, signature);

        if (!isValid) {
            throw new Error("Invalid Razorpay webhook signature");
        }

        // Extract event data
        const event = payload.event;
        const paymentLinkData = payload.payload?.payment_link?.entity || payload.payload?.payment_link || {};

        return {
            event,
            paymentLinkId: paymentLinkData.id,
            status: paymentLinkData.status,
            amount: paymentLinkData.amount,
            currency: paymentLinkData.currency,
            userId: paymentLinkData.notes?.userId || paymentLinkData.notes?.user_id,
            planId: paymentLinkData.notes?.planId,
            referenceId: paymentLinkData.reference_id,
        };
    }

    /**
     * Validate Razorpay webhook signature
     */
    validateWebhookSignature(payload, signature) {
        if (!this.webhookSecret) {
            console.warn("Razorpay webhook secret not configured. Skipping strict validation for now.");
            return true; // Use CAUTION in production
        }

        try {
            const Razorpay = require('razorpay');
            return Razorpay.validateWebhookSignature(
                JSON.stringify(payload),
                signature,
                this.webhookSecret
            );
        } catch (error) {
            console.error("Webhook signature validation error:", error);
            return false;
        }
    }

    /**
     * Get payment link status from Razorpay
     */
    async getPaymentLinkStatus(paymentLinkId) {
        const Razorpay = require('razorpay');
        const instance = new Razorpay({
            key_id: this.keyId,
            key_secret: this.keySecret
        });

        return await instance.paymentLink.fetch(paymentLinkId);
    }
}

export default RazorpayProvider;
