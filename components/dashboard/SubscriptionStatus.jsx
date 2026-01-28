"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "@/lib/httpClient";
import toast from "react-hot-toast";
import { CONFIG } from "@/constants/config";
import { ENDPOINTS } from "@/constants/endpoints";
import {
    RiTimeLine,
    RiCheckboxCircleLine,
    RiAlertLine,
    RiExternalLinkLine,
    RiErrorWarningLine,
    RiCheckLine,
    RiSecurePaymentLine
} from "react-icons/ri";
import { formatDate } from "@/lib/dateUtils";

export default function SubscriptionStatus({ currentUser, initialData, redirectOnExpire = false }) {
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
            axios.post(ENDPOINTS.USER.SUSPEND).catch(err => console.error("Suspension error:", err));
            toast.error("Trial expired! Redirecting to suspended page in few seconds...", {
                duration: 3000,
                icon: "⏳"
            });
            const timer = setTimeout(() => {
                router.replace("/suspended");
            }, 3000);


            return () => clearTimeout(timer);
        }
    }, [subscriptionData, loading, redirectOnExpire, router, pathname]);

    const fetchSubscriptionStatus = async () => {
        try {
            const { data } = await axios.get(ENDPOINTS.PAYMENT.SUBSCRIPTIONS);
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
            const { data } = await axios.post(ENDPOINTS.PAYMENT.CREATE_PAYMENT_LINK, { planId });
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

    // Action Logic
    const currentPlan = currentUser?.plan || "FREE";
    const isExpired = !trial.active && (!subscription || subscription.status !== "active");

    const PLAN_DETAILS = {
        PRO: {
            id: "PRO",
            color: "primary",
            benefits: [
                "Unlimited Link Creation",
                "90-Day Advanced Analytics",
                "Custom QR Code Generator",
                "Premium Page Templates"
            ],
            price: `${CONFIG.PRICING.PRO.currency}${CONFIG.PRICING.PRO.price}/mo`
        },
        AGENCY: {
            id: "AGENCY",
            color: "secondary",
            benefits: [
                "Manage Up to 10 Bio Pages",
                "Lifetime Data Retention",
                "All Premium Themes Unlocked",
                "Priority Support Access"
            ],
            price: `${CONFIG.PRICING.AGENCY.currency}${CONFIG.PRICING.AGENCY.price}/mo`
        }
    };

    return (
        <div className="hidden card bg-base-100 border border-base-200 shadow-sm mb-2">
            <div className="card-body p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">Subscription Status</h3>
                    {subscription?.status === "active" && (
                        <div className="badge badge-success badge-sm font-bold gap-1 px-3 py-2">
                            <RiCheckboxCircleLine /> {subscription.planId} ACTIVE
                        </div>
                    )}
                </div>

                {/* Trial Status */}
                {trial.active && subscription?.status !== "active" && (
                    <div className="alert alert-info shadow-sm mb-4">
                        <RiTimeLine className="text-xl" />
                        <div className="flex-1">
                            <div className="font-bold text-sm">Trial Access Active</div>
                            <div className="text-xs opacity-80">
                                Your full feature access expires on {formatDate(trial.endsAt)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Account Suspended Alert */}
                {isExpired && (
                    <div className="alert alert-error shadow-sm mb-4">
                        <RiErrorWarningLine className="text-xl" />
                        <div className="flex-1">
                            <div className="font-bold text-sm text-white">Account Suspended</div>
                            <div className="text-xs text-white/80">
                                Your trial has expired. Subscribe below to reactivate your bio page instantly.
                            </div>
                        </div>
                    </div>
                )}

                {/* Renewal Window */}
                {renewalWindow.active && (
                    <div className="alert alert-warning shadow-sm mb-4">
                        <RiAlertLine className="text-xl" />
                        <div className="flex-1">
                            <div className="font-bold text-sm">Plan Expiring Soon</div>
                            <div className="text-xs opacity-80">
                                {renewalWindow.daysUntilExpiry} days remaining. Renew now to avoid service interruption.
                            </div>
                        </div>
                    </div>
                )}

                {/* Pending Payment Link */}
                {pendingPaymentLink && (
                    <div className="alert bg-base-200 border-base-300 mb-6">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <RiExternalLinkLine className="text-xl" />
                            </div>
                            <div>
                                <div className="font-bold text-sm">Active Payment Request</div>
                                <div className="text-[10px] opacity-50 uppercase tracking-widest">Awaiting Verification</div>
                            </div>
                        </div>
                        <a
                            href={pendingPaymentLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary font-bold shadow-lg shadow-primary/20"
                        >
                            Complete Payment
                        </a>
                    </div>
                )}

                {/* Plan Selection / Renewal Cards */}
                {!pendingPaymentLink && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        {/* PRO CARD - Visible to FREE and PRO */}
                        {(currentPlan === "FREE" || currentPlan === "PRO") && (
                            <div className={`card border-2 p-4 md:p-5 transition-all ${currentPlan === 'PRO' ? 'border-primary bg-primary/5' : 'border-base-200'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg">PRO Plan</h4>
                                        <p className="text-2xl font-extrabold text-primary">{PLAN_DETAILS.PRO.price}</p>
                                    </div>
                                    {currentPlan === "PRO" && (
                                        <span className="badge badge-primary font-bold text-[10px] uppercase">My Plan</span>
                                    )}
                                </div>
                                <ul className="space-y-2 mb-6 flex-1">
                                    {PLAN_DETAILS.PRO.benefits.map((b, i) => (
                                        <li key={i} className="text-xs flex items-center gap-2 font-medium">
                                            <RiCheckLine className="text-primary flex-shrink-0" /> {b}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleCreatePaymentLink("PRO")}
                                    disabled={creatingLink}
                                    className={`btn btn-sm w-full font-bold ${currentPlan === 'PRO' ? 'btn-primary shadow-lg shadow-primary/20' : 'btn-outline border-primary text-primary hover:bg-primary hover:text-white'}`}
                                >
                                    {creatingLink ? <span className="loading loading-spinner loading-xs"></span> : (currentPlan === "PRO" ? "RENEW PRO ACCESS" : "UPGRADE TO PRO")}
                                </button>
                            </div>
                        )}

                        {/* AGENCY CARD - Visible to Everyone */}
                        <div className={`card border-2 p-4 md:p-5 transition-all ${currentPlan === 'AGENCY' ? 'border-secondary bg-secondary/5' : 'border-base-200'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg">AGENCY Plan</h4>
                                    <p className="text-2xl font-extrabold text-secondary">{PLAN_DETAILS.AGENCY.price}</p>
                                </div>
                                {currentPlan === "AGENCY" && (
                                    <span className="badge badge-secondary font-bold text-[10px] uppercase">My Plan</span>
                                )}
                            </div>
                            <ul className="space-y-2 mb-6 flex-1">
                                {PLAN_DETAILS.AGENCY.benefits.map((b, i) => (
                                    <li key={i} className="text-xs flex items-center gap-2 font-medium">
                                        <RiCheckLine className="text-secondary flex-shrink-0" /> {b}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCreatePaymentLink("AGENCY")}
                                disabled={creatingLink}
                                className={`btn btn-sm w-full font-bold ${currentPlan === 'AGENCY' ? 'btn-secondary shadow-lg shadow-secondary/20' : 'btn-outline border-secondary text-secondary hover:bg-secondary hover:text-white'}`}
                            >
                                {creatingLink ? <span className="loading loading-spinner loading-xs"></span> : (currentPlan === "AGENCY" ? "RENEW AGENCY ACCESS" : "UPGRADE TO AGENCY")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Secure Payment Footer */}
                <div className="mt-6 pt-4 border-t border-base-200 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        <RiSecurePaymentLine className="text-lg" /> 256-Bit SSL Secure
                    </div>
                    <div className="text-[10px] font-medium italic">Cancel or switch anytime</div>
                </div>
            </div>
        </div>
    );
}
