"use client";

import { useState } from "react";
import { RiCloseLine, RiCheckLine, RiVipCrownLine, RiBuilding4Line, RiInformationLine } from "react-icons/ri";
import { CONFIG, pricingPlans } from "@/constants/config";
import { useAuthStore } from "@/stores/useAuthStore";
import axios from "@/lib/httpClient";
import { ENDPOINTS } from "@/constants/endpoints";
import toast from "react-hot-toast";

export default function UpgradePlanModal({ isOpen, onClose }) {
    const { currentUser } = useAuthStore();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleCreatePaymentLink = async (planId) => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                ENDPOINTS.PAYMENT.GET_PAYMENT_URL,
                { planId }
            );
            if (data.success) {
                toast.success("Payment link created");
                window.open(data.data.url, "_blank");
                onClose();
            } else {
                // toast.error(data.message || "Failed to create payment link");
                throw new Error(data.message || "Failed to create payment link");
            }
        } catch (err) {
            toast.error(
                err.message || "Failed to create payment link"
            );
        } finally {
            setLoading(false);
        }
    };

    const plans = pricingPlans
        .filter(plan => plan.name !== "Free")
        .map(plan => {
            const isAgency = plan.name === "Agency";
            const id = plan.name.toUpperCase();
            return {
                id: id,
                name: `${plan.name} Plan`,
                price: plan.price,
                currency: CONFIG.PRICING[id].currency,
                icon: isAgency ? RiBuilding4Line : RiVipCrownLine,
                color: isAgency ? "secondary" : "primary",
                // Exclude last feature (trial message) as per request
                features: plan.features.filter(f => f.included).map(f => f.name).slice(0, -1)
            };
        });

    return (
        <div className="modal modal-open bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="modal-box w-full max-w-3xl p-0 overflow-hidden bg-base-100 border border-base-200 shadow-2xl rounded-lg flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-base-200 flex justify-between items-start bg-base-100 flex-none z-10">
                    <div>
                        <h3 className="font-bold text-xl md:text-2xl tracking-tight">Upgrade Your Plan</h3>
                        <p className="text-sm opacity-60 mt-1 font-medium">Unlock full power with a one-time pass.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-base-200 transition-colors"
                        aria-label="Close modal"
                    >
                        <RiCloseLine className="text-xl opacity-70" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-50/50 overflow-y-auto flex-1">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        const isCurrentPlan = currentUser?.plan === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col border rounded-md p-4 md:p-5 transition-all duration-200 hover:shadow-md ${isCurrentPlan
                                    ? 'border-primary/60 bg-primary/[0.04] ring-1 ring-primary/20'
                                    : 'border-base-300 bg-base-100'
                                    }`}
                            >
                                {isCurrentPlan && (
                                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-content text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-sm whitespace-nowrap">
                                        Current Plan
                                    </div>
                                )}

                                <div className="mb-4 text-center">
                                    <div className={`w-10 h-10 mx-auto rounded-md flex items-center justify-center mb-2 ${plan.id === 'PRO' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                                        }`}>
                                        <Icon className="text-xl" />
                                    </div>
                                    <h4 className="font-bold text-lg mb-0.5">{plan.name}</h4>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className="text-2xl font-bold tracking-tight">{plan.currency}{plan.price}</span>
                                        <span className="text-xs opacity-50 font-bold uppercase tracking-wide">/ 30 days</span>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6 flex-1">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-xs font-medium opacity-80">
                                            <div className={`mt-0.5 p-0.5 rounded-sm ${plan.id === 'PRO' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                                                }`}>
                                                <RiCheckLine className="text-[10px]" />
                                            </div>
                                            <span className="leading-snug">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleCreatePaymentLink(plan.id)}
                                    disabled={loading}
                                    className={`btn w-full btn-md h-10 min-h-0 font-bold border-0 text-white shadow-sm rounded-md hover:opacity-90 ${isCurrentPlan
                                        ? 'bg-primary hover:bg-primary-focus'
                                        : 'bg-secondary hover:bg-secondary-focus'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="loading loading-dots loading-xs" />
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-sm">
                                            {isCurrentPlan ? 'Extend Plan' : `Upgrade to ${plan.name.split(' ')[0]}`}
                                        </span>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 bg-base-100 border-t border-base-200">
                    <div className="bg-primary/5 border border-primary/20 rounded-md p-3 mb-3 text-center">
                        <p className="text-xs font-bold text-base-content/80 flex items-center justify-center gap-2">
                            <RiInformationLine className="text-lg text-primary shrink-0" />
                            <span><span className="text-primary font-bold">Worry-free Upgrade:</span> 30 days are added to your existing plan. You won&apos;t lose any time.</span>
                        </p>
                    </div>

                    <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
                        <RiCheckLine className="text-sm" /> Secure processing by Razorpay • No auto-renewal
                    </p>
                </div>
            </div>

            {/* Backdrop click to close */}
            <div className="modal-backdrop absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
}
