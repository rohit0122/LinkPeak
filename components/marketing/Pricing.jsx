import { RiCheckFill, RiCloseFill } from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import { useState } from "react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";

const plans = [
    {
        name: "Free",
        price: 0,
        description: "Perfect for beginners getting started.",
        popular: false,
        features: [
            { name: `${CONFIG.PLAN_LIMITS.FREE.pages} Bio Page`, included: true },
            { name: "1 Template (Classic Only)", included: true },
            { name: `${CONFIG.PLAN_LIMITS.FREE.links} Links`, included: true },
            { name: `${CONFIG.PLAN_LIMITS.FREE.analyticsDays} Days Analytics`, included: true },
            { name: "Basic QR Code", included: true },
            { name: "Standard Themes", included: true },
            { name: "AI AI Features", included: false },
            { name: "Custom QR Code (Logo)", included: false },
        ]
    },
    {
        name: "Pro",
        price: 9,
        description: "For creators ready to grow their audience.",
        popular: true,
        features: [
            { name: `${CONFIG.PLAN_LIMITS.PRO.pages} Bio Page`, included: true },
            { name: "3 Templates (Classic, Grid, Hero)", included: true },
            { name: "Unlimited Links", included: true },
            { name: `${CONFIG.PLAN_LIMITS.PRO.analyticsDays} Days Analytics`, included: true },
            { name: "Custom QR Code (Logo, Color)", included: true },
            { name: "All Premium Themes", included: true },
            { name: "AI Link Title Suggestions", included: true },
            { name: "AI SEO Optimization", included: true },
        ]
    },
    {
        name: "Agency",
        price: 49,
        description: "Manage multiple brands and clients.",
        popular: false,
        features: [
            { name: `${CONFIG.PLAN_LIMITS.AGENCY.pages} Bio Pages`, included: true },
            { name: "All 5 Templates (Social, Modern)", included: true },
            { name: "Unlimited Links", included: true },
            { name: "Lifetime Analytics", included: true },
            { name: "Custom QR Code (Logo, Color)", included: true },
            { name: "All Premium Themes", included: true },
            { name: "AI SEO & Titles", included: true },
            { name: "White Labeling", included: true },
        ]
    }
];

export default function Pricing({ billingCycle }) {
    const [loadingPlan, setLoadingPlan] = useState(null);

    const handleUpgrade = async (planName) => {
        if (planName === 'Free') {
            // Free plan - redirect to signup with FREE parameter
            window.location.href = '/register?plan=FREE';
            return;
        }

        setLoadingPlan(planName);

        try {
            // Check if user is logged in by trying to get subscription status
            const { data: statusData } = await axios.get("/subscriptions");

            // User is logged in - create payment link
            const { data } = await axios.post("/subscriptions/create-payment-link", {
                planId: planName.toUpperCase()
            });

            if (data.success) {
                // Open payment link in new tab
                window.open(data.data.url, "_blank");
                toast.success("Payment link created! Check the new tab.");
            }
        } catch (error) {
            // User not logged in or error - redirect to signup with plan
            if (error.response?.status === 401) {
                window.location.href = `/register?plan=${planName.toUpperCase()}`;
            } else {
                toast.error(error.response?.data?.error || "Failed to create payment link");
            }
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <section id="pricing" className="py-24 bg-base-200/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4">Pricing Plans</h2>
                    <p className="text-xl opacity-60">Simple, transparent, and built to scale with you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`card bg-base-100 shadow-xl border-2 transition-all hover:scale-[1.02] ${plan.popular ? 'border-primary' : 'border-base-300'
                                }`}
                        >
                            {plan.popular && (
                                <div className="badge badge-primary absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold p-4">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className="card-body p-8 flex flex-col h-full">
                                <h3 className="text-2xl font-bold">{plan.name}</h3>
                                <p className="text-sm opacity-60 mb-6">{plan.description}</p>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-medium">${plan.price}</span>
                                    <span className="text-xl opacity-40">/mo</span>
                                </div>

                                <div className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className={`flex items-center gap-3 ${feature.included ? 'opacity-100' : 'opacity-30'}`}>
                                            {feature.included ? (
                                                <RiCheckFill className="text-success text-xl shrink-0" />
                                            ) : (
                                                <RiCloseFill className="text-base-content text-xl shrink-0" />
                                            )}
                                            <span className="text-sm font-medium">{feature.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleUpgrade(plan.name)}
                                    className={`btn btn-block ${plan.popular ? 'btn-primary shadow-lg shadow-primary/20' : 'btn-outline'}`}
                                    disabled={loadingPlan === plan.name}
                                    suppressHydrationWarning={true}
                                >
                                    {loadingPlan === plan.name ? <span className="loading loading-spinner"></span> : (plan.name === 'Free' ? 'Get Started' : 'Upgrade Now')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
