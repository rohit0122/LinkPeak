"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "@/lib/axios";
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

export default function SubscriptionStatusDiv({
    currentUser,
    initialData,
    redirectOnExpire = false
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [subscriptionData, setSubscriptionData] = useState(initialData || null);
    const [loading, setLoading] = useState(!initialData);
    const [creatingLink, setCreatingLink] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(currentUser?.plan);

    useEffect(() => {
        if (!initialData) fetchSubscriptionStatus();
        else {
            setSubscriptionData(initialData);
            setLoading(false);
        }
    }, [initialData]);

    /* 🔒 Trial expiry redirect — UNCHANGED */
    useEffect(() => {
        if (pathname === "/suspended") return;
        if (loading || !subscriptionData || !redirectOnExpire) return;

        const { trial, subscription } = subscriptionData;
        const isExpired =
            !trial?.active &&
            (!subscription || subscription.status !== "active") && currentPlan !== "FREE";

        if (isExpired) {
            axios.post(ENDPOINTS.USER.SUSPEND).catch(() => { });
            toast.error(
                "Trial expired! Redirecting to suspended page...",
                { duration: 3000 }
            );

            const t = setTimeout(() => {
                router.replace("/suspended");
            }, 3000);

            return () => clearTimeout(t);
        }
    }, [subscriptionData, loading, redirectOnExpire, router, pathname]);

    const fetchSubscriptionStatus = async () => {
        try {
            const { data } = await axios.get(ENDPOINTS.PAYMENT.SUBSCRIPTIONS);
            if (data.success) setSubscriptionData(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePaymentLink = async (planId) => {
        setCreatingLink(true);
        try {
            const { data } = await axios.post(
                ENDPOINTS.PAYMENT.CREATE_PAYMENT_LINK,
                { planId }
            );
            if (data.success) {
                toast.success("Payment link created");
                window.open(data.data.url, "_blank");
                await fetchSubscriptionStatus();
            }
        } catch (err) {
            toast.error(
                err.response?.data?.error || "Failed to create payment link"
            );
        } finally {
            setCreatingLink(false);
        }
    };

    if (loading || !subscriptionData) return null;

    const { trial, subscription, renewalWindow, pendingPaymentLink } =
        subscriptionData;

    const isExpired =
        !trial.active &&
        (!subscription || subscription.status !== "active") && currentPlan !== "FREE";

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
                "All Premium Themes",
                "Priority Support"
            ],
            price: `${CONFIG.PRICING.AGENCY.currency}${CONFIG.PRICING.AGENCY.price}/mo`
        }
    };
    return (
        (currentUser?.plan === "FREE" || subscription?.status !== "active" || renewalWindow?.active) && (
            <div className="card bg-base-100 border border-base-200 shadow-sm mb-2">
                <div className="card-body p-4 md:p-5">

                    {/* ───────── Header ───────── */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-60">
                            Subscription Status
                        </h3>
                        <span className={`badge badge-${currentUser?.plan !== "FREE" && subscription?.status === "active" ? "success" : "warning"} badge-sm gap-1`}>
                            <RiCheckboxCircleLine /> {subscription?.planId || currentUser?.plan} PLAN
                        </span>

                    </div>

                    {/* ───────── Trial Info ───────── */}
                    {currentUser?.plan !== "FREE" && trial?.active && subscription?.status !== "active" && (
                        <div className="alert alert-info shadow-sm my-1 text-info-content">
                            <RiTimeLine className="text-lg" />
                            <div>
                                <div className="font-bold text-sm">
                                    {currentUser?.plan} PLAN Trial Access Active
                                </div>
                                <div className="text-xs ">
                                    Full access until{" "}
                                    {new Date(trial?.endsAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ───────── Suspended ───────── */}
                    {isExpired && (
                        <div className="alert alert-error shadow-sm my-1">
                            <RiErrorWarningLine className="text-lg" />
                            <div>
                                <div className="font-bold text-sm">
                                    Account Suspended
                                </div>
                                <div className="text-xs opacity-80">
                                    Trial expired. Subscribe below to reactivate.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ───────── Renewal Window ───────── */}
                    {renewalWindow.active && (
                        <div className="alert alert-warning shadow-sm my-1">
                            <RiAlertLine className="text-lg" />
                            <div>
                                <div className="font-bold text-sm">
                                    Plan Expiring Soon
                                </div>
                                <div className="text-xs opacity-80">
                                    {renewalWindow.daysUntilExpiry} days remaining
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ───────── Pending Payment ───────── */}
                    {pendingPaymentLink && (
                        <div className="alert bg-base-200 border-base-300 my-1">
                            <RiExternalLinkLine className="text-lg" />
                            <div className="flex-1">
                                <div className="font-bold text-sm">
                                    Pending Payment
                                </div>
                                <div className="text-xs opacity-70">
                                    Awaiting verification
                                </div>
                            </div>
                            <a
                                href={pendingPaymentLink?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-primary"
                            >
                                Complete
                            </a>
                        </div>
                    )}

                    {/* ───────── Accordion: Plans ───────── */}
                    {!pendingPaymentLink && (currentPlan === "FREE" || subscription?.status !== "active" || renewalWindow?.active) && (
                        <div className="collapse collapse-arrow border border-base-200 rounded-lg my-1">
                            <input type="checkbox" />
                            <div className="collapse-title text-sm font-bold">
                                Upgrade / Renew Subscription
                            </div>

                            <div className="collapse-content">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {(currentPlan === "FREE" ||
                                        currentPlan === "PRO") && (
                                            <PlanCard
                                                plan={PLAN_DETAILS.PRO}
                                                active={currentPlan === "PRO"}
                                                onClick={handleCreatePaymentLink}
                                                loading={creatingLink}
                                            />
                                        )}

                                    <PlanCard
                                        plan={PLAN_DETAILS.AGENCY}
                                        active={currentPlan === "AGENCY"}
                                        onClick={handleCreatePaymentLink}
                                        loading={creatingLink}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ───────── Footer ───────── */}
                    {!pendingPaymentLink && (currentPlan === "FREE" || subscription?.status !== "active" || renewalWindow?.active) && (
                        <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-[10px] opacity-60">
                            <div className="flex items-center gap-1 font-bold uppercase">
                                <RiSecurePaymentLine /> SSL Secure
                            </div>
                            <span>Renew on time for uninterrupted service.</span>
                        </div>
                    )}
                </div>
            </div>)
    );
}

/* ───────── Plan Card ───────── */
function PlanCard({ plan, active, onClick, loading }) {
    return (
        <div
            className={`card border-2 p-4 ${active
                ? `border-${plan.color} bg-${plan.color}/5`
                : "border-base-200"
                }`}
        >
            <div className="flex justify-between mb-3">
                <div>
                    <h4 className="font-bold">{plan.id}</h4>
                    <p className={`text-xl font-black text-${plan.color}`}>
                        {plan.price}
                    </p>
                </div>
                {active && (
                    <span
                        className={`badge badge-${plan.color} text-[10px]`}
                    >
                        My Plan
                    </span>
                )}
            </div>

            <ul className="space-y-1 text-xs mb-4">
                {plan.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <RiCheckLine className={`text-${plan.color}`} />
                        {b}
                    </li>
                ))}
            </ul>

            <button
                onClick={() => onClick(plan.id)}
                disabled={loading}
                className={`btn btn-sm w-full font-bold ${active
                    ? `btn-${plan.color}`
                    : `btn-outline border-${plan.color} text-${plan.color}`
                    }`}
            >
                {loading ? (
                    <span className="loading loading-spinner loading-xs" />
                ) : active ? (
                    "RENEW"
                ) : (
                    "UPGRADE"
                )}
            </button>
        </div>
    );
}
