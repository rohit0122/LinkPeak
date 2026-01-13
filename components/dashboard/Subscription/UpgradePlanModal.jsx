import { RiFlashlightFill, RiStarFill } from "react-icons/ri";

export default function UpgradePlanModal({
    isOpen,
    onClose,
    onSelectPlan,
}) {
    if (!isOpen) return null;

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
                    {/* PRO */}
                    <button
                        onClick={() => onSelectPlan("PRO")}
                        className="group border rounded-xl p-5 text-left hover:border-primary 
                       hover:bg-primary/5 transition-all"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <RiFlashlightFill className="text-primary text-xl" />
                            <h4 className="font-semibold text-lg">PRO</h4>
                        </div>

                        <div className="text-xs text-base-content/70 mb-3 space-y-1">
                            <p>✅ 5 Pro Templates & 10 Themes</p>
                            <p>✅ 1000 Links & 90 Days Analytics</p>
                        </div>

                        <div className="font-bold text-2xl">$9/month</div>

                        <div className="mt-4">
                            <span className="btn btn-primary btn-sm w-full">
                                Choose PRO
                            </span>
                        </div>
                    </button>

                    {/* AGENCY */}
                    <button
                        onClick={() => onSelectPlan("AGENCY")}
                        className="group border rounded-xl p-5 text-left hover:border-secondary 
                       hover:bg-secondary/5 transition-all"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <RiStarFill className="text-secondary text-xl" />
                            <h4 className="font-semibold text-lg">AGENCY</h4>
                        </div>

                        <div className="text-xs text-base-content/70 mb-3 space-y-1">
                            <p>✅ All 15+ Templates & Themes</p>
                            <p>✅ Lifetime Analytics & White Label</p>
                        </div>

                        <div className="font-bold text-2xl">$49/month</div>
                        <div className="mt-4">
                            <span className="btn btn-secondary btn-sm w-full">
                                Choose AGENCY
                            </span>
                        </div>
                    </button>
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
