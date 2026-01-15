import { useAuthStore } from "@/stores/useAuthStore";
import { RiSparklingLine } from "react-icons/ri";

export default function SubscriptionDetails() {
    const { currentSubscription } = useAuthStore(
        (state) => state
    );
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
                                {currentSubscription?.expiry_date || "N/A"}
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="alert alert-info flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <RiSparklingLine className="text-2xl shrink-0" />

                    <div className="flex-1 space-y-1">
                        <p className="font-bold">Trial Access Active</p>

                        <p className="text-sm leading-relaxed">
                            Your trial access is active until{" "}
                            <span className="font-semibold">
                                {currentSubscription?.expiry_date || "N/A"}
                            </span>.
                        </p>

                        {currentSubscription?.is_paid && (
                            <span className="badge badge-warning badge-sm italic w-fit">
                                Auto-charge & activation after trial expiry
                            </span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};