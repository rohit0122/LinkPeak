import { RiCheckFill, RiCloseFill } from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import Link from "next/link";

const plans = [
    {
        name: "Free",
        price: 0,
        description:
            "Absolutely Free — create your first bio page, share links, and start tracking basic click stats — no payment needed, perfect for getting started right away.",
        popular: false,
        features: [
            { name: `${CONFIG.PLAN_LIMITS.FREE.pages} Bio Page`, included: true },
            { name: "1 Template (Classic Only)", included: true },
            { name: `${CONFIG.PLAN_LIMITS.FREE.links} Links`, included: true },
            { name: `${CONFIG.PLAN_LIMITS.FREE.analyticsDays} Days Analytics`, included: true },
            { name: "Basic QR Code", included: true },
            { name: "Standard Themes", included: true },
            { name: "AI Features", included: false },
            { name: "Custom QR Code (Logo)", included: false },
        ],
    },
    {
        name: "Pro",
        price: 9,
        description:
            "Just $9/month — get custom SEO titles, analytics, AI suggestions, and unlock more clicks & higher engagement.",
        popular: true,
        features: [
            { name: `${CONFIG.PLAN_LIMITS.PRO.pages} Bio Page`, included: true },
            { name: "8 Designer Templates (Bento, Hero, Glass...)", included: true },
            { name: "Unlimited Links", included: true },
            { name: `${CONFIG.PLAN_LIMITS.PRO.analyticsDays} Days Analytics`, included: true },
            { name: "Custom QR Code (Logo, Color)", included: true },
            { name: "10 Curated Identity Themes", included: true },
            { name: "AI Link Title Suggestions", included: true },
            { name: "AI SEO Optimization", included: true },
            { name: "Enjoy a generous 7-day free trial — no credit card required.", included: true },
        ],
    },
    {
        name: "Agency",
        price: 49,
        description:
            "Just $49/month — get 10 branded bio pages, lifetime analytics, white-labeling, AI-optimized SEO & titles, custom QR codes, and manage multiple clients effortlessly with one dashboard.",
        popular: false,
        features: [
            { name: `${CONFIG.PLAN_LIMITS.AGENCY.pages} Bio Pages`, included: true },
            { name: "All 15+ Templates (Social, Modern...)", included: true },
            { name: "Unlimited Links", included: true },
            { name: "Lifetime Analytics", included: true },
            { name: "Custom QR Code (Logo, Color)", included: true },
            { name: "All 18+ Premium Themes", included: true },
            { name: "AI Enhanced Bio Page SEO & Titles", included: true },
            { name: "White Labeling", included: true },
            { name: "Enjoy a generous 7-day free trial — no credit card required.", included: true },
        ],
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="bg-base-200/60 py-16 sm:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-3">
                        Pricing Plans
                    </h2>
                    <p className="text-base sm:text-lg opacity-60">
                        Simple, transparent, and built to scale with you.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative card transition-all duration-300 border
                ${plan.popular ? "border-primary shadow-xl scale-[1.02]" : "border-base-300 hover:shadow-lg"}
              `}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <span className="badge badge-primary absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-3 font-semibold z-10">
                                    MOST POPULAR
                                </span>
                            )}

                            <div className="card-body p-6 sm:p-8 flex flex-col h-full">
                                {/* Plan name + price */}
                                <div className="mb-4">
                                    <h3 className="text-xl sm:text-2xl font-semibold leading-tight uppercase">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-4xl sm:text-5xl font-medium">${plan.price}</span>
                                        <span className="text-base opacity-50">/mo</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p
                                    className="text-sm opacity-60 mb-6 leading-snug line-clamp-2"
                                    title={plan.description}
                                >
                                    {plan.description}
                                </p>

                                {/* Features */}
                                <div className="flex-1 space-y-3 mb-6">
                                    {plan.features.map((feature, i) => {
                                        const isTrial = feature.name.includes("7-day free trial");
                                        return (
                                            <div
                                                key={i}
                                                className={`flex items-start gap-3 text-sm ${feature.included ? "opacity-100" : "opacity-40"
                                                    } ${isTrial ? "bg-primary/10  p-2 font-medium text-primary" : ""}`}
                                            >
                                                {feature.included ? (
                                                    <RiCheckFill
                                                        className={`text-success text-lg mt-[2px] ${isTrial ? "text-primary" : ""}`}
                                                    />
                                                ) : (
                                                    <RiCloseFill className="text-base-content text-lg mt-[2px]" />
                                                )}
                                                <span className="leading-snug">{feature.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* CTA */}
                                <Link
                                    href={`/register?plan=${plan.name.toUpperCase()}`}
                                    className={`btn btn-block h-12 text-base
                    ${plan.popular ? "btn-primary shadow-md shadow-primary/20" : "btn-outline"}
                  `}
                                >
                                    {plan.name === "Free" ? "Get Started" : "Upgrade Now"}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
