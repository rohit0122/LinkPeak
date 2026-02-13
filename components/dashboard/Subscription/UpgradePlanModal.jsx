import { RiFlashlightFill, RiStarFill, RiCheckLine } from "react-icons/ri";
import { pricingPlans } from "@/constants/config";
import { useAuthStore } from "@/stores/useAuthStore";

export default function UpgradePlanModal({
    isOpen,
    onClose,
    onSelectPlan,
}) {
    const currentPlan = useAuthStore((state) => state.currentSubscription.plan_name);
    if (!isOpen) return null;

    // Filter for upgradeable plans (exclude Free)
    const upgradePlans = pricingPlans.filter(p => p.price > 0);

    const getPlanIcon = (name) => {
        switch (name.toUpperCase()) {
            case "PRO": return <RiFlashlightFill className="text-primary text-xl" />;
            case "AGENCY": return <RiStarFill className="text-secondary text-xl" />;
            default: return null;
        }
    };

    const getPlanColor = (name) => {
        switch (name.toUpperCase()) {
            case "PRO": return "primary";
            case "AGENCY": return "secondary";
            default: return "neutral";
        }
    };

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-xl p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h3 className="font-bold text-xl sm:text-2xl">
                        Upgrade Your Plan
                    </h3>
                    <p className="text-base-content/70 text-sm mt-1">
                        Choose a plan that fits your growth needs
                    </p>
                </div>

                {/* Plans */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {upgradePlans.map((plan) => {
                        const name = plan.name.toUpperCase();
                        const color = getPlanColor(name);

                        return (
                            <div className="indicator" key={plan.name}>
                                {currentPlan === name && (
                                    <span className="indicator-item indicator-top indicator-center badge badge-xs badge-info font-bold uppercase">Current Plan</span>
                                )}
                                <button

                                    onClick={() => onSelectPlan(name)}
                                    className={`group border rounded-xl p-5 text-left transition-all
                                    hover:border-${color} hover:bg-${color}/5 hover:scale-[1.02] active:scale-95`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        {getPlanIcon(name)}
                                        <h4 className="font-semibold text-lg uppercase">{plan.name}</h4>
                                    </div>

                                    <div className="text-xs text-base-content/70 mb-4 space-y-1.5 min-h-[60px]">
                                        {plan.features.slice(0, 5).map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-1">
                                                <RiCheckLine className={`text-${color} shrink-0 mt-0.5`} />
                                                <span className="line-clamp-2">{feature.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-baseline gap-1">
                                        <div className="font-bold text-2xl">${plan.price}</div>
                                        <div className="text-xs opacity-50 font-medium">/ 30 days</div>
                                    </div>
                                    <div className="text-[10px] text-primary font-bold mt-1 opacity-80 uppercase tracking-tighter">
                                        *Days stack if renewed early
                                    </div>

                                    <div className="mt-4">
                                        <span className={`btn btn-${color} btn-sm w-full`}>
                                            Choose {plan.name}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="modal-action mt-6">
                    <button
                        className="btn btn-neutral btn-outline btn-sm"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
