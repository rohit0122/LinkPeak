import { useAuthStore } from "@/stores/useAuthStore";
import { RiSparklingLine } from "react-icons/ri";
import { formatDate } from "@/lib/dateUtils";

export default function SubscriptionDetails() {
    const { currentSubscription } = useAuthStore(
        (state) => state
    );
    const isFreePlan = currentSubscription?.plan_name === "FREE";
    const isPaidTrialPlan = currentSubscription?.plan_name != "FREE" && (currentSubscription?.is_trial || currentSubscription?.status === "trial");
    const isActivePaidPlan = currentSubscription?.plan_name != "FREE" && !currentSubscription?.is_trial && currentSubscription?.status === "active";
    const isSubscribedButPendingPayment = currentSubscription?.plan_name != "FREE" && !currentSubscription?.is_trial && currentSubscription?.status !== "trial" && currentSubscription?.status !== "active";

    return (
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
                            <div className={`text-lg font-bold uppercase ${currentSubscription?.formatted_status === "Active"
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
                        {currentSubscription?.status === 'trial' && <p className="font-bold italic border border-warning-content text-warning-content bg-warning/10 p-2 text-xs"><div>If you renew during the trial, your plan will start immediately and <span className="font-extrabold">30 days will be added to your remaining trial period</span>. There are no automatic charges.</div></p>}
                        {/*currentSubscription?.status != 'trial' && (
                            <span className="badge badge-warning badge-sm italic w-fit">
                                Automatic billing starts after your trial ends
                            </span>
                        )*/}
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
                        {currentSubscription?.status != 'trial' && (
                            <span className="badge badge-warning badge-sm italic w-fit">
                                No Automatic billing enabled. you have to pay manually to continue using the service, at the end of your current plan expiry date.
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

            </div>
        </div>
    );
};