"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { CONFIG } from "@/constants/config";
import { RiTimeLine, RiCheckboxCircleLine, RiAlertLine, RiExternalLinkLine, RiErrorWarningLine } from "react-icons/ri";

export default function SubscriptionStatus({ user, initialData, redirectOnExpire = false }) {
    const router = useRouter();
    const [subscriptionData, setSubscriptionData] = useState(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [creatingLink, setCreatingLink] = useState(false);

    useEffect(() => {
        if (!initialData) {
            fetchSubscriptionStatus();
        } else {
            setSubscriptionData(initialData);
            setLoading(false);
        }
    }, [initialData]);

    const pathname = usePathname();
    // Handle Trial Expiry Redirect
    useEffect(() => {
        if (pathname === "/suspended") return; // ✅ STOP HERE

        if (loading || !subscriptionData || !redirectOnExpire) return;

        const { trial, subscription } = subscriptionData;

        // Check if trial expired AND no active subscription
        // Note: subscription object exists even if cancelled/expired, so check status
        //const isExpired = !trial?.active && (!subscription || subscription.status !== 'active');
        const isExpired = !trial?.active && (!subscription || subscription.status !== "active");


        if (isExpired) {
            // First, protectively suspend the user in the backend
            // strict: true used to prevent loops or race conditions, but simple post is fine
            axios.post("/user/suspend").catch(err => console.error("Suspension error:", err));
            toast.error("Trial expired! Redirecting to suspended page in few seconds...", {
                duration: 3000,
                icon: "⏳"
            });
            console.log('I am here dfdfdfdf')
            const timer = setTimeout(() => {
                console.log('I am here')
                router.replace("/suspended");
            }, 3000);


            return () => clearTimeout(timer);
        }
    }, [subscriptionData, loading, redirectOnExpire, router, pathname]);

    const fetchSubscriptionStatus = async () => {
        try {
            const { data } = await axios.get("/subscriptions");
            if (data.success) {
                setSubscriptionData(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch subscription:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePaymentLink = async (planId) => {
        setCreatingLink(true);
        try {
            const { data } = await axios.post("/subscriptions/create-payment-link", { planId });
            if (data.success) {
                toast.success("Payment link created!");
                // Open payment link in new tab
                window.open(data.data.url, "_blank");
                // Refresh subscription status
                await fetchSubscriptionStatus();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create payment link");
        } finally {
            setCreatingLink(false);
        }
    };

    if (loading) {
        return null;
    }

    if (!subscriptionData) return null;

    const { trial, subscription, renewalWindow, pendingPaymentLink } = subscriptionData;

    // Determine what to show
    //const showSubscribeButton = trial.active && !subscription;
    const showSubscribeButton = !subscription || subscription.status !== "active";

    const showRenewButton = renewalWindow.active && subscription;

    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm mb-2">
            <div className="card-body">
                <h3 className="card-title text-sm font-semibold">Subscription Status</h3>

                {/* Trial Status */}
                {trial.active && subscription?.status !== "active" && (
                    <div className="alert alert-info">
                        <RiTimeLine className="text-lg" />
                        <div className="flex-1">
                            <div className="font-medium text-sm">Free Trial Active</div>
                            <div className="text-xs opacity-70">
                                Expires: {new Date(trial.endsAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Subscription */}
                {subscription && subscription.status === "active" && (
                    <div className="alert alert-info alert-outline">
                        <RiCheckboxCircleLine className="text-lg" />
                        <div className="flex-1">
                            <div className="font-medium text-sm">{subscription.planId} Plan Active</div>
                            <div className="text-xs">
                                Renews: {new Date(subscription.endDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                )}

                {/* Renewal Window */}
                {renewalWindow.active && (
                    <div className="alert alert-warning">
                        <RiAlertLine className="text-lg" />
                        <div className="flex-1">
                            <div className="font-medium text-sm">Renewal Available</div>
                            <div className="text-xs opacity-70">
                                {renewalWindow.daysUntilExpiry} days until expiry
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending Payment Link */}
                {pendingPaymentLink && (
                    <div className="alert">
                        <RiExternalLinkLine className="text-lg" />
                        <div className="flex-1">
                            <div className="font-medium text-sm">Payment Link Active</div>
                            <div className="text-xs opacity-70">
                                Expires: {new Date(pendingPaymentLink.expiresAt).toLocaleString()}
                            </div>
                        </div>
                        <a
                            href={pendingPaymentLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-ghost border-base-300"
                        >
                            Pay Now <RiExternalLinkLine />
                        </a>
                    </div>
                )}

                {/* Action Buttons */}
                {(showSubscribeButton || showRenewButton) && !pendingPaymentLink && (
                    <div className="card-actions mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                            {/* PRO Plan */}
                            <button
                                onClick={() => handleCreatePaymentLink("PRO")}
                                disabled={creatingLink}
                                className="btn btn-primary btn-sm"
                            >
                                {creatingLink ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <>
                                        {showRenewButton ? "Renew" : "Subscribe"} PRO
                                        <span className="text-xs opacity-70">
                                            {CONFIG.PRICING.PRO.currency}{CONFIG.PRICING.PRO.price}/mo
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* AGENCY Plan */}
                            <button
                                onClick={() => handleCreatePaymentLink("AGENCY")}
                                disabled={creatingLink}
                                className="btn btn-secondary btn-sm"
                            >
                                {creatingLink ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <>
                                        {showRenewButton ? "Renew" : "Subscribe"} AGENCY
                                        <span className="text-xs opacity-70">
                                            {CONFIG.PRICING.AGENCY.currency}{CONFIG.PRICING.AGENCY.price}/mo
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Suspended / Expired */}
                {!trial.active && (!subscription || subscription.status !== "active") && (
                    <div className="alert alert-error">
                        <RiErrorWarningLine className="text-lg" />
                        <div className="flex-1">
                            <div className="font-medium text-sm">Account Suspended</div>
                            <div className="text-xs opacity-80">
                                Your trial has expired and no active subscription was found.
                            </div>
                        </div>
                    </div>
                )}


                {/* Help Text */}
                {!trial.active && !subscription && (
                    <div className="text-xs opacity-60 mt-2">
                        Your trial has expired. Subscribe to continue using premium features.
                    </div>
                )}
            </div>
        </div>
    );
}
