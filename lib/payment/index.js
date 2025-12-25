import MockPaymentProvider from "./MockPaymentProvider.js";
import RazorpayProvider from "./RazorpayProvider.js";

/**
 * Payment Provider Factory
 * Returns the appropriate payment provider based on environment configuration
 */
export function getPaymentProvider() {
    const provider = process.env.PAYMENT_PROVIDER || "mock";

    switch (provider.toLowerCase()) {
        case "razorpay":
            return new RazorpayProvider();
        case "mock":
        default:
            return new MockPaymentProvider();
    }
}

export { MockPaymentProvider, RazorpayProvider };
