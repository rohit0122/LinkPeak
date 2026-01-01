import { CONFIG } from "@/constants/config";

export default function UsageMetrics({ currentUser, links = [], pages = [] }) {
    const planLimits = CONFIG.PLAN_LIMITS[currentUser?.plan] || CONFIG.PLAN_LIMITS.FREE;

    const metrics = [
        {
            label: "Links",
            current: links.length,
            max: planLimits.links,
            color: "primary",
            icon: "🔗"
        },
        {
            label: "Bio Pages",
            current: pages.length,
            max: planLimits.pages,
            color: "secondary",
            icon: "📄"
        }
    ];

    return (
        <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
                <h3 className="card-title text-sm">Plan Usage</h3>
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
                                        {metric.current} / {metric.max === Infinity ? '∞' : metric.max}
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

                {currentUser?.plan === 'FREE' && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-xs font-semibold text-primary mb-2">
                            🚀 Upgrade to unlock more
                        </p>
                        <ul className="text-xs space-y-1 opacity-80">
                            <li>✅ Unlimited links</li>
                            <li>✅ Advanced analytics</li>
                            <li>✅ Custom themes</li>
                        </ul>
                        <a href="/#pricing" className="btn btn-primary btn-sm w-full mt-3">
                            View Plans
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
