import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { RiSparklingLine, RiFileList3Line, RiDownloadLine, RiLoader4Line, RiCloseLine } from "react-icons/ri";
import { formatDate } from "@/lib/dateUtils";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function SubscriptionDetails() {
    const { currentSubscription, syncSubscriptionStatus, loading } = useAuthStore(
        (state) => state
    );
    const [invoices, setInvoices] = useState(null);
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    const [showInvoices, setShowInvoices] = useState(false);
    const [cancelingSubscription, setCancelingSubscription] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [syncingStatus, setSyncingStatus] = useState(false);

    const status = (currentSubscription?.status || "free").toLowerCase();
    const planName = (currentSubscription?.plan_name || "FREE").toUpperCase();
    const expiryDate = currentSubscription?.expiry_date || currentSubscription?.current_period_end || currentSubscription?.trial_ends_at;

    const isFree = status === "free" || planName === "FREE";
    const isPending = status === "pending" && !isFree;
    const isTrial = status === "trial" && !isFree;
    const isActive = status === "active" && !isFree;
    const isExpired = status === "expired" && !isFree;
    const isCancelled = status === "cancelled" && !isFree;

    // Sub-states for Active
    const isVerifiedTrial = isActive && currentSubscription?.is_trial === true;
    const isPaidPeriod = isActive && !isVerifiedTrial;

    const fetchInvoices = async () => {
        if (showInvoices) {
            setShowInvoices(false);
            return;
        }

        if (invoices !== null) {
            setShowInvoices(true);
            return;
        }

        setLoadingInvoices(true);
        try {
            const { data } = await axios.get(ENDPOINTS.SUBSCRIPTION.INVOICES);
            if (data.success) {
                setInvoices(data.data || []);
                setShowInvoices(true);
            } else {
                toast.error("Failed to load invoices");
            }
        } catch (error) {
            toast.error("Error fetching invoices");
        } finally {
            setLoadingInvoices(false);
        }
    };

    const handleCancelSubscription = async () => {
        setCancelingSubscription(true);
        try {
            const { data } = await axios.post(ENDPOINTS.SUBSCRIPTION.CANCEL);
            if (data.success) {
                toast.success("Subscription canceled successfully");
                // Refresh status instead of reload
                await syncSubscriptionStatus();
            } else {
                toast.error(data.message || "Failed to cancel subscription");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error canceling subscription");
        } finally {
            setCancelingSubscription(false);
            setShowCancelModal(false);
        }
    };

    const handleSyncStatus = async () => {
        setSyncingStatus(true);
        await syncSubscriptionStatus();
        setSyncingStatus(false);
    };

    return (
        <>
            <ConfirmationModal
                isOpen={showCancelModal}
                title="Cancel Subscription?"
                message="Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your billing period."
                confirmText="Yes, Cancel Subscription"
                cancelText="Keep Subscription"
                isDestructive={true}
                onConfirm={handleCancelSubscription}
                onCancel={() => setShowCancelModal(false)}
            />

            <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="card-title text-xl font-bold tracking-tight flex items-center gap-2 mb-1">
                                    <RiSparklingLine className="text-secondary" />
                                    Subscription Details
                                </h2>
                                <p className="text-xs font-bold opacity-50 ml-7">
                                    Overview of your current plan and status.
                                </p>
                            </div>
                            {(isPending || isExpired) && (
                                <button
                                    onClick={handleSyncStatus}
                                    disabled={syncingStatus || loading}
                                    className="btn btn-neutral btn-outline btn-xs gap-1 opacity-70 hover:opacity-100"
                                >
                                    <RiLoader4Line className={syncingStatus ? "animate-spin" : ""} />
                                    Sync Status
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Plan Name */}
                            <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                                <div className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1">
                                    Current Plan
                                </div>
                                <div className="text-lg font-extrabold text-primary">
                                    {planName}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                                <div className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1">
                                    Status
                                </div>
                                <div className={`text-lg font-bold capitalize ${status === "active" || status === "trial"
                                    ? "text-success"
                                    : status === "pending" || status === "cancelled"
                                        ? "text-warning"
                                        : isFree
                                            ? "text-primary"
                                            : "text-error"
                                    }`}>
                                    {status}
                                </div>
                            </div>

                            {/* Expiry Date */}
                            {(isTrial || isActive || isCancelled) && expiryDate && (
                                <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                                    <div className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1">
                                        {isCancelled ? "Access Ends On" : "Renews / Expires On"}
                                    </div>
                                    <div className="text-lg font-bold opacity-80">
                                        {formatDate(expiryDate)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`alert ${isPending ? 'alert-warning' : isExpired ? 'alert-error' : 'alert-info'} flex flex-col sm:flex-row gap-3 items-start sm:items-center`}>
                        <RiSparklingLine className="text-2xl shrink-0" />

                        {isFree && (
                            <div className="flex-1 space-y-1">
                                <p className="font-bold">Free Plan Active 🎉</p>
                                <p className="text-sm leading-relaxed text-info-content font-semibold">
                                    Your free plan is currently active, giving you access to all free features.
                                </p>
                                <p className="font-bold italic badge badge-warning text-warning-content badge-sm">Upgrade anytime for more advanced features.</p>
                            </div>
                        )}

                        {isPending && (
                            <div className="flex-1 space-y-1">
                                <p className="font-bold">Payment Processing...</p>
                                <p className="text-sm leading-relaxed">
                                    We are waiting for Razorpay to confirm your subscription. This usually takes a few minutes.
                                </p>
                                <p className="font-bold italic badge badge-warning badge-outline text-warning-content badge-sm">Click &quot;Sync Status&quot; if this persists.</p>
                            </div>
                        )}

                        {isTrial && (
                            <div className="flex-1 space-y-1">
                                <p className="font-bold">7 Days Free (No card)</p>
                                <p className="text-sm leading-relaxed">
                                    Your 7-day free trial for {planName} is active until <span className="font-semibold">{formatDate(expiryDate)}</span>.
                                </p>
                                <span className="badge badge-warning badge-sm italic font-bold">
                                    No credit card required for this trial.
                                </span>
                            </div>
                        )}

                        {isVerifiedTrial && (
                            <div className="flex-1 space-y-1">
                                <p className="font-bold">7 Days Free (Payment Verified)</p>
                                <p className="text-sm leading-relaxed">
                                    Your Free trial for {planName} is active until <span className="font-semibold">{formatDate(expiryDate)}</span>.
                                </p>
                                <span className="badge badge-warning badge-sm italic font-bold">
                                    Automatic billing starts after your trial ends.
                                </span>
                            </div>
                        )}

                        {isPaidPeriod && (
                            <div className="flex-1 space-y-1">
                                <p className="font-bold">{planName} Active: Fully Paid Period</p>
                                <p className="text-sm leading-relaxed">
                                    Your subscription is active until <span className="font-semibold">{formatDate(expiryDate)}</span>.
                                </p>
                                <span className="badge badge-success badge-sm italic w-fit text-white">
                                    Automatic billing enabled.
                                </span>
                            </div>
                        )}

                        {isExpired && (
                            <div className="flex-1 space-y-1">
                                <p className="font-bold">Plan Expired</p>
                                <p className="text-sm leading-relaxed">
                                    Your {planName} plan has expired. Please renew to regain access to premium features.
                                </p>
                                <p className="font-bold italic badge badge-error badge-outline text-error-content badge-sm">Account currently in read-only mode.</p>
                            </div>
                        )}

                        {isCancelled && (
                            <div className="flex-1 space-y-1">
                                <p className="font-bold">Subscription Cancelled</p>
                                <p className="text-sm leading-relaxed">
                                    Your premium access will end on <span className="font-semibold">{formatDate(expiryDate)}</span>.
                                </p>
                                <p className="font-bold italic badge badge-warning badge-outline text-warning-content badge-sm">You can resume your plan anytime before it ends.</p>
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        {!isFree && (
                            <button
                                onClick={fetchInvoices}
                                className="btn btn-outline btn-sm gap-2"
                                disabled={loadingInvoices}
                            >
                                {loadingInvoices ? (
                                    <RiLoader4Line className="animate-spin" />
                                ) : (
                                    <RiFileList3Line />
                                )}
                                {showInvoices ? "Hide Invoices" : "View Invoices"}
                            </button>
                        )}

                        {(isActive || isTrial) && !isFree && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="btn btn-error btn-outline btn-sm gap-2"
                                disabled={cancelingSubscription}
                            >
                                {cancelingSubscription ? (
                                    <RiLoader4Line className="animate-spin" />
                                ) : (
                                    <RiCloseLine />
                                )}
                                Cancel Subscription
                            </button>
                        )}

                        {/*(isFree || isExpired || isCancelled) && (
                            <button
                                onClick={() => window.location.href = "#plans"} // Or routing logic
                                className="btn btn-primary btn-sm gap-2"
                            >
                                <RiSparklingLine />
                                {isCancelled ? "Resume Subscription" : isExpired ? "Renew Plan" : "Upgrade to Pro"}
                            </button>
                        )*/}
                    </div>

                    {showInvoices && (
                        <div className="mt-4 overflow-x-auto">
                            <table className="table table-zebra w-full border border-base-200 rounded-lg">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th className="font-bold">Date</th>
                                        <th className="font-bold">Invoice ID</th>
                                        <th className="font-bold">Amount</th>
                                        <th className="font-bold">Status</th>
                                        <th className="font-bold">Download</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices && invoices.length > 0 ? (
                                        invoices.map((inv) => (
                                            <tr key={inv.id}>
                                                <td className="text-sm font-medium">
                                                    {new Date(inv.created_at * 1000).toLocaleDateString()}
                                                </td>
                                                <td className="text-xs font-mono opacity-70">
                                                    {inv.id}
                                                </td>
                                                <td className="font-bold">
                                                    {(inv.amount / 100).toLocaleString("en-IN", {
                                                        style: "currency",
                                                        currency: inv.currency,
                                                    })}
                                                </td>
                                                <td>
                                                    <span className={`badge badge-sm font-bold ${inv.status === "paid" ? "badge-success text-white" : "badge-warning"}`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {inv.short_url && (
                                                        <a
                                                            href={inv.short_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-ghost btn-xs text-primary"
                                                        >
                                                            <RiDownloadLine className="text-base" />
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-sm opacity-50">
                                                No invoices found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </>
    );
};