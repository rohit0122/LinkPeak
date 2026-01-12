import { useAuthStore } from "@/stores/useAuthStore";
import { RiSparklingLine } from "react-icons/ri";

export default function SubscriptionDetails() {
    const { currentSubscription } = useAuthStore(
        (state) => state
    );
    return (
        <div className="card-body p-8 lg:p-10 bg-info/5 border border-info/20 shadow-sm">
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-xl font-medium tracking-tight flex items-center gap-2 mb-1">
                        <RiSparklingLine className="text-secondary" />
                        Subscription Details
                    </h2>
                    <p className="text-xs font-medium opacity-50">
                        Overview of your current plan and status.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Plan Name */}
                    <div className="bg-base-200/50 p-4 rounded-xl border border-base-300">
                        <div className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1">
                            Current Plan
                        </div>
                        <div className="text-lg font-bold text-primary">
                            {currentSubscription?.plan_name || "FREE"}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-base-200/50 p-4 rounded-xl border border-base-300">
                        <div className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1">
                            Status
                        </div>
                        <div className={`text-lg font-bold ${useAuthStore.getState().currentSubscription?.formatted_status === "Active"
                            ? "text-success"
                            : "text-warning"
                            }`}>
                            {useAuthStore.getState().currentSubscription?.formatted_status || "Inactive"}
                        </div>
                    </div>

                    {/* Expiry Date */}
                    <div className="bg-base-200/50 p-4 rounded-xl border border-base-300">
                        <div className="text-xs uppercase font-bold tracking-wider opacity-60 mb-1">
                            Renews / Expires On
                        </div>
                        <div className="text-lg font-medium">
                            {currentSubscription?.expiry_date || "N/A"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};