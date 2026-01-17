"use client";

import { useState, useCallback } from "react";
import { loadRazorpay } from "@/lib/razorpayClient";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import { CONFIG } from "@/constants/config";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Custom hook for Razorpay payment integration
 * Handles plan upgrades and subscription renewals
 */
export function useRazorpay() {
    const [isProcessing, setIsProcessing] = useState(false);
    const { currentUser, currentSubscription, updateCurrentSubscriptionSession } = useAuthStore();

    /**
     * Upgrade to a new plan
     * @param {string} planName - Plan name (PRO, AGENCY)
     * @param {object} options - Optional configuration
     * @param {function} options.onSuccess - Callback after successful payment
     * @param {string} options.redirectUrl - URL to redirect after success
     */
    const upgradePlan = useCallback(async (planName, options = {}) => {
        const { onSuccess, redirectUrl = '/dashboard' } = options;

        // Load Razorpay SDK
        const sdkLoaded = await loadRazorpay();
        if (!sdkLoaded) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        setIsProcessing(true);
        const toastId = toast.loading(`Initiating ${planName} upgrade...`);

        try {
            // Call backend to create subscription
            const response = await axios.post(ENDPOINTS.SUBSCRIPTION.CHANGE_PLAN, {
                new_plan: planName,
            });

            if (!response.data.success) {
                toast.error(response.data.message || "Failed to initiate subscription.", { id: toastId });
                setIsProcessing(false);
                return;
            }
            const apiData = response.data.data.subscription || response.data.subscription;
            const { razorpay_subscription_id, plan_name, prefill } = apiData;
            if (apiData) {
                updateCurrentSubscriptionSession(apiData);
            }
            if (!razorpay_subscription_id) {
                toast.error("Failed to initiate subscription.", { id: toastId });
                setIsProcessing(false);
                return;
            }

            // Configure Razorpay checkout
            const razorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                subscription_id: razorpay_subscription_id,
                name: CONFIG.SITE_NAME,
                description: `Upgrade to ${plan_name} Plan`,
                image: `${CONFIG.SITE_URL}/linkpeakk-logo.webp`,
                handler: function (paymentResponse) {
                    toast.success("Plan changed successfully! Payment verified.", { id: toastId });

                    // Execute custom success callback if provided
                    if (onSuccess) {
                        onSuccess(paymentResponse);
                    }

                    // Redirect after success
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 2000);
                },
                prefill: {
                    name: prefill?.name || currentUser?.name,
                    email: prefill?.email || currentUser?.email
                },
                theme: {
                    color: "#422AD5",
                },
                modal: {
                    ondismiss: function () {
                        toast.dismiss(toastId);
                        setIsProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(razorpayOptions);
            razorpay.open();
            toast.dismiss(toastId);

        } catch (error) {
            console.error("Upgrade error:", error);
            toast.error(error?.data?.message || "Error changing plan!", { id: toastId });
            setIsProcessing(false);
        }
    }, [currentUser]);

    /**
     * Renew/Extend existing subscription
     * @param {string} razorpaySubscriptionId - Razorpay subscription ID
     * @param {object} options - Optional configuration
     * @param {function} options.onSuccess - Callback after successful payment
     */
    const renewSubscription = useCallback(async (razorpaySubscriptionId, options = {}) => {
        const { onSuccess } = options;

        if (!razorpaySubscriptionId) {
            toast.error("No active subscription ID found for renewal.");
            return;
        }

        // Load Razorpay SDK
        const sdkLoaded = await loadRazorpay();
        if (!sdkLoaded) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        setIsProcessing(true);

        try {
            const razorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
                subscription_id: razorpaySubscriptionId,
                name: CONFIG.SITE_NAME,
                description: `Extend / Renew ${currentSubscription?.plan_name} Plan`,
                image: `${CONFIG.SITE_URL}/linkpeakk-logo.webp`,
                handler: async function (paymentResponse) {
                    try {
                        // Verify payment with backend
                        const verifyResponse = await axios.post(ENDPOINTS.SUBSCRIPTION.VERIFY_PAYMENT, {
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_subscription_id: paymentResponse.razorpay_subscription_id,
                            razorpay_signature: paymentResponse.razorpay_signature
                        });

                        // Update subscription in store
                        if (verifyResponse.data?.data?.subscription) {
                            updateCurrentSubscriptionSession(verifyResponse.data.data.subscription);
                        }

                        toast.success("Subscription extended successfully!");

                        // Execute custom success callback if provided
                        if (onSuccess) {
                            onSuccess(paymentResponse);
                        }

                    } catch (error) {
                        toast.error(error?.response?.data?.message || "Error extending subscription!");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: currentSubscription?.prefill?.name || currentUser?.name,
                    email: currentSubscription?.prefill?.email || currentUser?.email,
                },
                theme: {
                    color: "#422AD5",
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(razorpayOptions);
            razorpay.open();

        } catch (error) {
            console.error("Renewal error:", error);
            toast.error("Failed to initiate renewal");
            setIsProcessing(false);
        }
    }, [currentSubscription, currentUser, updateCurrentSubscriptionSession]);

    return {
        upgradePlan,
        renewSubscription,
        isProcessing
    };
}
