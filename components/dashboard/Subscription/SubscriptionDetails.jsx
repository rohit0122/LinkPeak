import { useAuthStore } from "@/stores/useAuthStore";
import { RiSparklingLine, RiCalendarLine, RiShieldLine, RiInformationLine } from "react-icons/ri";
import { formatDate } from "@/lib/dateUtils";

export default function SubscriptionDetails() {
    const { currentSubscription } = useAuthStore((state) => state);

    if (!currentSubscription) return null;

    const isFreePlan = currentSubscription?.plan_name === "FREE";
    const isPaidTrialPlan =
        currentSubscription?.plan_name !== "FREE" &&
        (currentSubscription?.is_trial || currentSubscription?.status === "trial");
    const isActivePaidPlan =
        currentSubscription?.plan_name !== "FREE" &&
        !currentSubscription?.is_trial &&
        currentSubscription?.status === "active";
    const isSubscribedButPendingPayment =
        currentSubscription?.plan_name !== "FREE" &&
        !currentSubscription?.is_trial &&
        currentSubscription?.status !== "trial" &&
        currentSubscription?.status !== "active";

    const getStatusColor = () => {
        if (isActivePaidPlan) return "text-success";
        if (isPaidTrialPlan || isSubscribedButPendingPayment) return "text-warning";
        return "text-info";
    };

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
            <div className="card-body p-6 md:p-8 space-y-8">
                {/* Header Section */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 mb-2">
                        <div className="p-2 rounded-lg bg-secondary/10">
                            <RiSparklingLine className="text-secondary text-2xl" />
                        </div>
                        Subscription Details
                    </h2>
                    <p className="text-sm font-medium text-base-content/50 ml-12">
                        Manage and review your current plan status and billing information.
                    </p>
                </div>

                {/* Primary Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Plan Block */}
                    <div className="bg-base-200/40 p-5 rounded-2xl border border-base-200/60 transition-all hover:bg-base-200/60">
                        <div className="flex items-center gap-2 mb-3">
                            <RiShieldLine className="text-primary opacity-70" />
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Current Plan</span>
                        </div>
                        <div className="text-2xl font-bold text-primary flex items-baseline gap-1">
                            {currentSubscription?.plan_name || "FREE"}
                        </div>
                    </div>

                    {/* Status Block */}
                    <div className="bg-base-200/40 p-5 rounded-2xl border border-base-200/60 transition-all hover:bg-base-200/60">
                        <div className="flex items-center gap-2 mb-3">
                            <RiInformationLine className="text-accent opacity-70" />
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Account Status</span>
                        </div>
                        <div className={`text-lg font-extrabold uppercase tracking-tight flex items-center gap-2 ${getStatusColor()}`}>
                            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                            {currentSubscription?.formatted_status || "Inactive"}
                        </div>
                        <div className="text-[10px] font-bold opacity-40 mt-1 ml-4 italic">
                            ({currentSubscription?.status})
                        </div>
                    </div>

                    {/* Expiry Block */}
                    {(currentSubscription?.expiry_date || isFreePlan) && (
                        <div className="bg-base-200/40 p-5 rounded-2xl border border-base-200/60 transition-all hover:bg-base-200/60">
                            <div className="flex items-center gap-2 mb-3">
                                <RiCalendarLine className="text-info opacity-70" />
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                                    {isFreePlan ? "Availability" : "Renews / Expires"}
                                </span>
                            </div>
                            <div className="text-lg font-bold opacity-80 mt-1">
                                {isFreePlan ? "Lifetime" : formatDate(currentSubscription?.expiry_date)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status-Driven Messaging */}
                <div className="space-y-4">
                    {currentSubscription?.pending_plan && (
                        <div className="p-4 bg-warning/5 border-l-4 border-warning rounded-r-xl flex gap-4 items-start animate-in fade-in slide-in-from-left-2 duration-500">
                            <RiInformationLine className="text-warning text-xl shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-warning">Plan Change Scheduled</h4>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    Your <strong>{currentSubscription.pending_plan.name}</strong> access starts automatically after <strong>{formatDate(currentSubscription.expiry_date)}</strong>, once your current {currentSubscription.plan_name} access ends.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="p-5 bg-base-200/30 rounded-2xl border border-base-200/50 flex flex-col md:flex-row gap-5 items-start md:items-center">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <RiInformationLine className="text-2xl" />
                        </div>

                        <div className="flex-1 space-y-2">
                            {isPaidTrialPlan && (
                                <>
                                    <h4 className="font-bold text-base">Trial Access Active</h4>
                                    <p className="text-sm text-base-content/70 leading-relaxed">
                                        Your trial access is active until <strong>{formatDate(currentSubscription?.expiry_date)}</strong>.
                                    </p>
                                    {currentSubscription?.status === 'trial' && !currentSubscription?.pending_plan && (
                                        <p className="text-xs bg-warning/10 text-warning-content p-3 rounded-lg border border-warning/20 italic font-medium">
                                            If you upgrade during the trial, your new 30 days will be added to your remaining trial days. You keep your full trial period + your new 30 days. No automatic charges ever.
                                        </p>
                                    )}
                                </>
                            )}

                            {isActivePaidPlan && (
                                <>
                                    <h4 className="font-bold text-base">{currentSubscription?.plan_name} Active</h4>
                                    <p className="text-sm text-base-content/70 leading-relaxed">
                                        Your plan is active until <strong>{formatDate(currentSubscription?.expiry_date)}</strong>.
                                    </p>
                                    <p className="text-xs bg-success/5 text-success font-semibold italic p-2 rounded-lg">
                                        Manual one-time payment plan. There are no automatic charges. Simply renew whenever you need more access.
                                    </p>
                                </>
                            )}

                            {isSubscribedButPendingPayment && !currentSubscription?.pending_plan && (
                                <>
                                    <h4 className="font-bold text-base underline decoration-warning decoration-2">Pending Payment: {currentSubscription?.plan_name}</h4>
                                    <p className="text-sm text-base-content/70 leading-relaxed">
                                        Your subscription remains active while payment is currently pending. Please ensure you complete the payment manually to maintain uninterrupted service.
                                    </p>
                                </>
                            )}

                            {isFreePlan && !currentSubscription?.pending_plan && (
                                <>
                                    <h4 className="font-bold text-base">Free Plan Activated 🎉</h4>
                                    <p className="text-sm text-base-content/70 leading-relaxed">
                                        You&apos;re on the forever-free plan. Enjoy the basic features or upgrade anytime for advanced analytics and customization.
                                    </p>
                                    <p className="text-[10px] font-bold uppercase text-secondary tracking-widest bg-secondary/5 w-fit px-3 py-1 rounded-none border border-secondary/20">
                                        Upgrade anytime for pro features
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
