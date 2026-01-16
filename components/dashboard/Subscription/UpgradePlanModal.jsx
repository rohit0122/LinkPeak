import { RiFlashlightFill, RiStarFill, RiCheckLine } from "react-icons/ri";
import { pricingPlans } from "@/constants/config";

export default function UpgradePlanModal({
    isOpen,
    onClose,
    onSelectPlan,
}) {
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
                            <button
                                key={plan.name}
                                onClick={() => onSelectPlan(name)}
                                className={`group border rounded-xl p-5 text-left transition-all
                                    hover:border-${color} hover:bg-${color}/5 hover:scale-[1.02] active:scale-95`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {getPlanIcon(name)}
                                    <h4 className="font-semibold text-lg">{plan.name}</h4>
                                </div>

                                <div className="text-xs text-base-content/70 mb-4 space-y-1.5 min-h-[60px]">
                                    {plan.features.slice(0, 3).map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-1">
                                            <RiCheckLine className={`text-${color} shrink-0 mt-0.5`} />
                                            <span className="line-clamp-2">{feature.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="font-bold text-2xl">${plan.price}/month</div>

                                <div className="mt-4">
                                    <span className={`btn btn-${color} btn-sm w-full`}>
                                        Choose {plan.name}
                                    </span>
                                </div>
                            </button>
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
