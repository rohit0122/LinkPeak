/**
 * Base Payment Provider Interface
 * All payment providers (Mock, Razorpay) must implement this interface
 */
class PaymentProvider {
    /**
     * Create a payment link for a subscription
     * @param {Object} params - Payment link parameters
     * @param {string} params.userId - User ID
     * @param {string} params.planId - Plan ID (FREE/PRO/AGENCY)
     * @param {number} params.amount - Amount in smallest currency unit (paise for INR)
     * @param {string} params.currency - Currency code (default: INR)
     * @param {string} params.description - Payment description
     * @returns {Promise<Object>} Payment link details
     */
    async createPaymentLink({ userId, planId, amount, currency = "INR", description }) {
        throw new Error("createPaymentLink must be implemented by subclass");
    }

    /**
     * Verify a payment
     * @param {string} paymentLinkId - Provider's payment link ID
     * @returns {Promise<Object>} Payment verification result
     */
    async verifyPayment(paymentLinkId) {
        throw new Error("verifyPayment must be implemented by subclass");
    }

    /**
     * Handle webhook event
     * @param {Object} payload - Webhook payload
     * @param {string} signature - Webhook signature for verification
     * @returns {Promise<Object>} Processed webhook data
     */
    async handleWebhook(payload, signature) {
        throw new Error("handleWebhook must be implemented by subclass");
    }

    /**
     * Get payment link status
     * @param {string} paymentLinkId - Provider's payment link ID
     * @returns {Promise<Object>} Payment link status
     */
    async getPaymentLinkStatus(paymentLinkId) {
        throw new Error("getPaymentLinkStatus must be implemented by subclass");
    }
}

export default PaymentProvider;
