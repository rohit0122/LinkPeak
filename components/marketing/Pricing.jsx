"use client";

import { RiCheckFill, RiCloseFill } from "react-icons/ri";
import { CONFIG, pricingPlans, pricingUSPs } from "@/constants/config";
import Link from "next/link";
import { motion } from "framer-motion";


export default function Pricing() {
    return (
        <section id="pricing" className="bg-base-200/60 py-16 sm:py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* World-Class USP Section: Framing the Value */}
                <div className="text-center mb-16 sm:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            The End of Subscription Fatigue
                        </h2>
                        <p className="text-lg sm:text-xl opacity-70 max-w-3xl mx-auto leading-relaxed">
                            No sneaky auto-debits. No complex cancellation traps. <br className="hidden sm:block" />
                            Just world-class bio pages, active exactly when you need them.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
                        {pricingUSPs.map((usp, index) => (
                            <motion.div
                                key={usp.title}
                                className="p-6 sm:p-8 rounded-3xl bg-base-100 border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 group"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex items-start gap-5">
                                    <div className={`w-16 h-16 shrink-0 rounded-2xl ${usp.color} flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-inner`}>
                                        {usp.icon}
                                    </div>
                                    <div className="text-left space-y-2">
                                        <h4 className="text-xl font-bold leading-tight">{usp.title}</h4>
                                        <p className="text-sm opacity-60 leading-relaxed font-medium">
                                            {usp.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Separator / Lead-in to Pricing */}
                <div className="flex items-center justify-center gap-4 mb-12 opacity-80">
                    <div className="h-px w-12 bg-base-content"></div>
                    <span className="text-sm font-bold uppercase tracking-[0.3em]">Select Your Access Level</span>
                    <div className="h-px w-12 bg-base-content"></div>
                </div>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 items-stretch">
                    {pricingPlans.map((plan, index) => (
                        <motion.article
                            key={plan.name}
                            className={`relative card transition-all duration-300 border bg-base-100
                                ${plan.popular ? "border-primary shadow-2xl scale-[1.02] z-10" : "border-base-300 hover:shadow-lg"}
                            `}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <span
                                    className="badge badge-primary badge-md xl:badge-xl absolute -top-3 left-1/2 -translate-x-1/2 font-bold z-20 shadow-lg"
                                    aria-label="Most popular plan"
                                >
                                    MOST POPULAR
                                </span>
                            )}

                            <div className="card-body p-6 sm:p-7 flex flex-col h-full">
                                {/* Plan name + price */}
                                <div className="mb-4">
                                    <h3 className="text-xl sm:text-2xl font-bold leading-tight uppercase tracking-tight">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-4xl sm:text-5xl font-extrabold tracking-tighter">${plan.price}</span>
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.name === "Free" ? "text-success" : "text-primary"}`}>
                                                {plan.name === "Free" ? "Free Forever" : "One-Time"}
                                            </span>
                                            <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                                {plan.name === "Free" ? "No Card" : "30-Day Access"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm opacity-60 mb-4 leading-relaxed font-medium line-clamp-2" title={plan.description}>
                                    {plan.description}
                                </p>

                                {/* Features */}
                                <div className="flex-1 space-y-2 mb-6" role="list">
                                    {plan.features.map((feature, i) => {
                                        const isTrial = feature.name.includes("7-day free trial");
                                        return (
                                            <div
                                                key={i}
                                                className={`flex items-start gap-3 text-sm font-medium ${feature.included ? "opacity-100" : "opacity-30"
                                                    } ${isTrial ? "bg-primary/5 p-2 rounded-xl ring-1 ring-primary/10 text-primary" : ""}`}
                                                role="listitem"
                                            >
                                                {feature.included ? (
                                                    <RiCheckFill
                                                        className={`text-success text-xl mt-px ${isTrial ? "text-primary" : ""}`}
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <RiCloseFill className="text-base-content text-xl mt-px" aria-hidden="true" />
                                                )}
                                                <span className="leading-snug">{feature.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* CTA */}
                                <div className="mt-auto">
                                    <Link
                                        href={`/register?plan=${plan.name.toUpperCase()}`}
                                        className={`btn btn-block h-12 text-base font-bold transition-all duration-300
                                            ${plan.popular ? "btn-primary shadow-xl shadow-primary/20 hover:scale-[1.02]" : "btn-outline border-2 hover:bg-base-200"}
                                        `}
                                    >
                                        {plan.name === "Free" ? "Start Free" : "Unlock Access"}
                                    </Link>
                                    <div className="text-[10px] text-center opacity-40 mt-3 font-bold uppercase tracking-widest">
                                        {plan.name === "Free" ? "Perfect for standard link sharing" : "Plan reverts to Free tier on expiry"}
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Trust/Support Footer */}
                <div className="mt-20 text-center">
                    <p className="text-sm opacity-50 font-medium">
                        Used by 1,000+ creators worldwide. <br className="sm:hidden" />
                        Need help? <Link href="/#faq" className="underline text-primary hover:opacity-100 transition-opacity">Check our FAQ</Link> or contact support.
                    </p>
                </div>
            </div>
        </section >
    );
}
