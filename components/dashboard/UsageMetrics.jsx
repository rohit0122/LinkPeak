import { CONFIG, getPlanIdByName } from "@/constants/config";
import { useAuthStore } from "@/stores/useAuthStore";
import { RiPieChartLine, RiCheckLine, RiInformationLine } from "react-icons/ri";

export default function UsageMetrics() {
    const { currentUser, currentBioPage, allBioPages, currentSubscription } = useAuthStore();
    const planLimits = currentUser?.plan ? (CONFIG.PLAN_LIMITS[currentUser.plan] || CONFIG.PLAN_LIMITS.FREE) : CONFIG.PLAN_LIMITS.FREE;
    const isShowUpgradeInfo = (
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

    return (
        <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-6">
                <h2 className="card-title text-xl font-bold tracking-tight flex items-center gap-2 mb-4">
                    <RiPieChartLine className="text-warning" />
                    Plan Usage
                </h2>
                <div className="space-y-6">
                    {metrics.map((metric) => {
                        const percentage = (metric.current / metric.max) * 100;
                        const isNearLimit = percentage >= 80;
                        const isAtLimit = metric.current >= metric.max;

                        return (
                            <div key={metric.label}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold flex items-center gap-2 opacity-70">
                                        <span>{metric.icon}</span>
                                        {metric.label}
                                    </span>
                                    <span className={`text-xs font-black ${isAtLimit ? 'text-error' : isNearLimit ? 'text-warning' : 'opacity-50'}`}>
                                        {metric.current} / {metric.max > 999 ? 'Unlimited' : metric.max}
                                    </span>
                                </div>
                                <div className="w-full bg-base-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${isAtLimit ? 'bg-error' :
                                            isNearLimit ? 'bg-warning' :
                                                `bg-${metric.color}`
                                            }`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                </div>
                                {isAtLimit && (
                                    <p className="text-[10px] font-bold text-error mt-1.5 flex items-center gap-1 uppercase tracking-wider">
                                        🚫 Limit reached - Upgrade to add more
                                    </p>
                                )}
                                {isNearLimit && !isAtLimit && (
                                    <p className="text-[10px] font-bold text-warning mt-1.5 flex items-center gap-1 uppercase tracking-wider">
                                        ⚠️ Almost at your limit
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isShowUpgradeInfo && (
                    <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-2 mb-3">
                            <RiInformationLine className="text-primary" />
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">
                                Upgrade to unlock more
                            </p>
                        </div>
                        <ul className="text-[11px] space-y-2 opacity-70 font-medium">
                            <li className="flex items-center gap-2"><RiCheckLine className="text-primary shrink-0" /> Unlimited links & customization</li>
                            <li className="flex items-center gap-2"><RiCheckLine className="text-primary shrink-0" /> Advanced analytics per link</li>
                            <li className="flex items-center gap-2"><RiCheckLine className="text-primary shrink-0" /> Premium themes & branding</li>
                        </ul>
                        <div className="mt-4 pt-4 border-t border-primary/10">
                            <p className="text-[10px] text-center opacity-50 font-bold uppercase tracking-[0.1em]">
                                Visit the <span className="text-primary underline">Account Section</span> to upgrade
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
