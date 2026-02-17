"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
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
import { formatDateTime } from "@/lib/dateUtils";

export default function SubscriptionStatusDiv({
    redirectOnExpire = false
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { currentUser, currentSubscription } = useAuthStore();

    const sub = currentSubscription;
    const isFreePlan = sub?.plan_name === "FREE";
    const isPaidTrialPlan = sub?.plan_name !== "FREE" && (sub?.is_trial || sub?.status === "trial");
    const isActivePaidPlan = sub?.plan_name !== "FREE" && !sub?.is_trial && sub?.status === "active";
    const isSubscribedButPendingPayment = sub?.plan_name !== "FREE" && !sub?.is_trial && sub?.status !== "trial" && sub?.status !== "active";
    const isExpired = !isFreePlan && !isPaidTrialPlan && !isActivePaidPlan;


    /* 🔒 Trial expiry redirect — UNCHANGED */
    useEffect(() => {
        if (pathname === "/suspended") return;
        if (!sub || !redirectOnExpire) return;

        if (isExpired) {
            axios.post(ENDPOINTS.USER.SUSPEND).catch(() => { });
            toast.error(
                "Access expired! Redirecting to suspended page...",
                { duration: 3000 }
            );

            const t = setTimeout(() => {
                router.replace("/suspended");
            }, 3000);

            return () => clearTimeout(t);
        }
    }, [sub, isExpired, redirectOnExpire, router, pathname]);

    if (!sub) return null;

    return (
        (isFreePlan || isExpired || sub?.is_renewal_window_open) && (
            <div className="card bg-base-100 border border-base-200 shadow-sm mb-2">
                <div className="card-body p-4 md:p-5">

                    {/* ───────── Header ───────── */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-60">
                            Plan Status
                        </h3>
                        <span className={`badge badge-${isActivePaidPlan ? "success" : "warning"} badge-sm gap-1`}>
                            <RiCheckboxCircleLine /> {sub?.plan_name || "FREE"} PLAN
                        </span>
                    </div>

                    {/* ───────── Trial Info ───────── */}
                    {isPaidTrialPlan && (
                        <div className="alert alert-info shadow-sm my-1 text-info-content">
                            <RiTimeLine className="text-lg" />
                            <div>
                                <div className="font-bold text-sm">
                                    {sub?.plan_name} Trial Access Active
                                </div>
                                <div className="text-xs ">
                                    Full access until{" "}
                                    {formatDateTime(sub?.expiry_date)}
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
                                    Access Suspended
                                </div>
                                <div className="text-xs opacity-80">
                                    Your plan has expired. Reactivate from the account section.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ───────── Expiring Soon (Replacement for Renewal Window) ───────── */}
                    {isActivePaidPlan && sub?.is_renewal_window_open && (
                        <div className="alert alert-warning shadow-sm my-1">
                            <RiAlertLine className="text-lg" />
                            <div>
                                <div className="font-bold text-sm">
                                    Plan Expiring Soon
                                </div>
                                <div className="text-xs opacity-80">
                                    Ends on {formatDateTime(sub?.expiry_date)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ───────── Pending Payment ───────── */}
                    {isSubscribedButPendingPayment && sub?.pending_payment_link && (
                        <div className="alert bg-base-200 border-base-300 my-1">
                            <RiExternalLinkLine className="text-lg" />
                            <div className="flex-1">
                                <div className="font-bold text-sm">
                                    Pending Payment
                                </div>
                                <div className="text-xs opacity-70">
                                    Waiting for confirmation
                                </div>
                            </div>
                            <a
                                href={sub?.pending_payment_link?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-primary"
                            >
                                Complete
                            </a>
                        </div>
                    )}

                    {/* ───────── Account Section Link ───────── */}
                    {(!sub?.pending_payment_link && (isFreePlan || isExpired || sub?.is_renewal_window_open)) && (
                        <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-bold text-primary mb-1 uppercase tracking-tight">
                                    Plan Action Required
                                </p>
                                <p className="text-[11px] opacity-70 mb-3 leading-relaxed">
                                    To reactivate, renew, or upgrade your plan, please visit the <span className="text-primary font-bold">Account Section</span> in your dashboard.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => router.push('/dashboard?tab=account')}
                                        className="btn btn-primary btn-sm font-bold uppercase tracking-wider"
                                    >
                                        Go to Account Tab
                                    </button>
                                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-primary/10">
                                        <RiSecurePaymentLine className="text-xs opacity-40" />
                                        <Link
                                            href="/contact-us"
                                            className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity underline"
                                        >
                                            Contact Support for help
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>)
    );
}

