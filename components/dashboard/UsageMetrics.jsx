import { useState } from "react";
import { CONFIG, getPlanIdByName } from "@/constants/config";
import { useAuthStore } from "@/stores/useAuthStore";
import { RiPieChartLine, RiCheckLine } from "react-icons/ri";
import UpgradePlanModal from "./Subscription/UpgradePlanModal";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";

export default function UsageMetrics() {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const { currentUser, currentBioPage, allBioPages, currentSubscription } = useAuthStore();
    const planLimits = CONFIG.PLAN_LIMITS[currentUser?.plan] || CONFIG.PLAN_LIMITS.FREE;
    const isShowUpgradeButton = (
        currentUser?.plan === 'FREE' ||
        currentSubscription?.status === 'trial' ||
        currentSubscription?.status === 'expired' ||
        currentSubscription?.is_renewal_window_open
    );
    const metrics = [
        {
            label: "Links",
            current: currentBioPage?.links?.length || 0,
            max: planLimits.links,
            color: "primary",
            icon: "🔗"
        },
        {
            label: "Bio Pages",
            current: allBioPages?.length || 0,
            max: planLimits.pages,
            color: "secondary",
            icon: "📄"
        }
    ];

    const onSelectPlan = async (plan) => {
        console.log('plan ==== ', plan, getPlanIdByName(plan));
        console.log('planId ==== ', ENDPOINTS.PAYMENT.GET_PAYMENT_URL);
        const response = await axios.post(ENDPOINTS.PAYMENT.GET_PAYMENT_URL, {
            planId: getPlanIdByName(plan)
        });
        console.log('response ==== ', response);
        if (response.data.success) {
            window.location.href = response.data.data.payment_url;
        } else {
            toast.error(response.data.message);
        }
        setShowUpgradeModal(false);
    };

    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
                <h2 className="card-title text-xl font-bold tracking-tight flex items-center gap-2 mb-1">
                    <RiPieChartLine className="text-warning" />
                    Plan Usage
                </h2>
                <div className="space-y-4">
                    {metrics.map((metric) => {
                        const percentage = (metric.current / metric.max) * 100;
                        const isNearLimit = percentage >= 80;
                        const isAtLimit = metric.current >= metric.max;

                        return (
                            <div key={metric.label}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium flex items-center gap-1">
                                        <span>{metric.icon}</span>
                                        {metric.label}
                                    </span>
                                    <span className={`text-xs font-bold ${isAtLimit ? 'text-error' : isNearLimit ? 'text-warning' : ''}`}>
                                        {metric.current} / {metric.max > 999 ? 'Unlimited' : metric.max}
                                    </span>
                                </div>
                                <div className="w-full bg-base-300 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${isAtLimit ? 'bg-error' :
                                            isNearLimit ? 'bg-warning' :
                                                `bg-${metric.color}`
                                            }`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                </div>
                                {isNearLimit && !isAtLimit && (
                                    <p className="text-xs text-warning mt-1">
                                        ⚠️ Almost at your limit
                                    </p>
                                )}
                                {isAtLimit && (
                                    <p className="text-xs text-error mt-1">
                                        🚫 Limit reached - Upgrade to add more
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {(isShowUpgradeButton) && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs font-semibold text-primary mb-2">
                            🚀 Upgrade to unlock more
                        </p>
                        <ul className="text-xs space-y-1 opacity-80">
                            <li className="flex items-center gap-1"><RiCheckLine className="text-primary" /> Unlimited links</li>
                            <li className="flex items-center gap-1"><RiCheckLine className="text-primary" /> Advanced analytics</li>
                            <li className="flex items-center gap-1"><RiCheckLine className="text-primary" /> Custom themes</li>
                        </ul>
                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="btn btn-primary btn-sm w-full mt-3"
                        >
                            View Upgrade Plans
                        </button>
                    </div>
                )}
            </div>

            <UpgradePlanModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                onSelectPlan={onSelectPlan}
            />
        </div>
    );
}
