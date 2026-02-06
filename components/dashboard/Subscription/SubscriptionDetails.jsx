import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { RiSparklingLine, RiFileList3Line, RiDownloadLine, RiLoader4Line, RiCloseLine } from "react-icons/ri";
import { formatDate } from "@/lib/dateUtils";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

export default function SubscriptionDetails() {
    const { currentSubscription } = useAuthStore(
        (state) => state
    );
    const [invoices, setInvoices] = useState(null);
    const [loadingInvoices, setLoadingInvoices] = useState(false);
    const [showInvoices, setShowInvoices] = useState(false);
    const [cancelingSubscription, setCancelingSubscription] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const isFreePlan = currentSubscription?.plan_name === "FREE";
    const isPaidTrialPlan = currentSubscription?.plan_name != "FREE" && (currentSubscription?.is_trial || currentSubscription?.status === "trialing");
    const isActivePaidPlan = currentSubscription?.plan_name != "FREE" && !currentSubscription?.is_trial && currentSubscription?.status === "active";
    const isSubscribedButPendingPayment = currentSubscription?.plan_name != "FREE" && !currentSubscription?.is_trial && currentSubscription?.status !== "trialing" && currentSubscription?.status !== "active";

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
                // Refresh the page or update the subscription state
                window.location.reload();
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
                        <div>
                            <h2 className="card-title text-xl font-bold tracking-tight flex items-center gap-2 mb-1">
                                <RiSparklingLine className="text-secondary" />
                                Subscription Details
                            </h2>
                            <p className="text-xs font-bold opacity-50 ml-7">
                                Overview of your current plan and status.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Plan Name */}
                            <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                                <div className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1">
                                    Current Plan
                                </div>
                                <div className="text-lg font-extrabold text-primary">
                                    {currentSubscription?.plan_name || "FREE"}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                                <div className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1">
                                    Status: Account(Payment)
                                </div>
                                <div className={`text-lg font-bold ${currentSubscription?.formatted_status === "Active"
                                    ? "text-success"
                                    : "text-warning"
                                    }`}>
                                    {currentSubscription?.formatted_status || "Inactive"} ({currentSubscription?.status})
                                </div>
                            </div>

                            {/* Expiry Date */}
                            {currentSubscription?.is_trial && <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
                                <div className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1">
                                    Renews / Expires On
                                </div>
                                <div className="text-lg font-bold opacity-80">
                                    {formatDate(currentSubscription?.expiry_date)}
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="alert alert-info flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <RiSparklingLine className="text-2xl shrink-0" />

                        {(isPaidTrialPlan) && <div className="flex-1 space-y-1">
                            <p className="font-bold">Trial Access Active</p>
                            <p className="text-sm leading-relaxed">
                                Your trial access is active until{" "}
                                <span className="font-semibold">
                                    {formatDate(currentSubscription?.expiry_date)}
                                </span>.
                                {" "}
                            </p>
                            {currentSubscription?.status === 'trialing' && <p className="font-bold italic badge badge-info badge-outline text-info-content badge-sm">If you choose to subscribe during the trial, payment will be charged automatically after the trial ends.</p>}
                            {currentSubscription?.status != 'trialing' && (
                                <span className="badge badge-warning badge-sm italic w-fit">
                                    Automatic billing starts after your trial ends
                                </span>
                            )}
                        </div>}
                        {(isActivePaidPlan) && <div className="flex-1 space-y-1">
                            <p className="font-bold"> {currentSubscription?.plan_name} Active</p>
                            <p className="text-sm leading-relaxed">
                                Your plan is active until{" "}
                                <span className="font-semibold">
                                    {formatDate(currentSubscription?.expiry_date)}
                                </span>.
                                {" "}
                            </p>
                            {currentSubscription?.status != 'trialing' && (
                                <span className="badge badge-warning badge-sm italic w-fit">
                                    Automatic billing enabled.
                                </span>
                            )}
                        </div>}
                        {isSubscribedButPendingPayment && <div className="flex-1 space-y-1">
                            <p className="font-bold">Pending Payment: {currentSubscription?.plan_name}</p>
                            <p className="text-sm leading-relaxed">
                                Your subscription remains active while payment is currently pending. If you have an active recurring subscription, the charge will be processed automatically after {" "}
                                <span className="font-semibold">
                                    {formatDate(currentSubscription?.expiry_date)}
                                </span>.
                                {" "}
                            </p>
                        </div>}

                        {(isFreePlan && <div className="flex-1 space-y-1">
                            <p className="font-bold">Free plan activated 🎉</p>

                            <p className="text-sm leading-relaxed">
                                Your free plan is currently active, giving you access to all free features.
                                {" "}
                            </p>
                            <p className="font-bold italic badge badge-info badge-outline text-info-content badge-sm">Upgrade anytime for more advance features.</p>

                        </div>)}
                    </div>

                    {/* View Invoices Section */}
                    <div className="mt-4 flex flex-wrap gap-2">
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

                        {!isFreePlan && (
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