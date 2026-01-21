"use client";

import { RiCheckFill, RiCloseFill } from "react-icons/ri";
import { CONFIG, pricingPlans } from "@/constants/config";
import Link from "next/link";
import { motion } from "framer-motion";


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
                    {pricingPlans.map((plan, index) => (
                        <motion.article
                            key={plan.name}
                            className={`relative card transition-all duration-300 border
                ${plan.popular ? "border-primary shadow-xl scale-[1.02]" : "border-base-300 hover:shadow-lg"}
              `}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: plan.popular ? 1.02 : 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <span
                                    className="badge badge-primary absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-3 font-semibold z-10"
                                    aria-label="Most popular plan"
                                >
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
                                <div className="flex-1 space-y-3 mb-6" role="list">
                                    {plan.features.map((feature, i) => {
                                        const isTrial = feature.name.includes("7-day free trial");
                                        return (
                                            <div
                                                key={i}
                                                className={`flex items-start gap-3 text-sm ${feature.included ? "opacity-100" : "opacity-40"
                                                    } ${isTrial ? "bg-primary/10  p-2 font-medium text-primary" : ""}`}
                                                role="listitem"
                                            >
                                                {feature.included ? (
                                                    <RiCheckFill
                                                        className={`text-success text-lg mt-[2px] ${isTrial ? "text-primary" : ""}`}
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <RiCloseFill className="text-base-content text-lg mt-[2px]" aria-hidden="true" />
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
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

