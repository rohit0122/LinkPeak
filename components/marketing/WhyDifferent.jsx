"use client";

import { CONFIG } from "@/constants/config";
import Link from "next/link";
import Image from "next/image";
import {
    RiSparklingLine,
    RiLineChartLine,
    RiRocketLine,
    RiSearchEyeLine,
    RiFlashlightLine,
    RiPaletteLine,
    RiShieldCheckLine,
    RiArrowRightLine,
    RiCheckLine,
    RiCloseLine,
    RiStarFill,
    RiThunderstormsLine,
} from "react-icons/ri";
import { motion } from "framer-motion";
import { useState } from "react";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function WhyDifferent() {
    const [activeFeature, setActiveFeature] = useState(0);

    const uniqueFeatures = [
        {
            icon: RiSparklingLine,
            title: "Intelligent Search Optimization",
            description: "Your bio page automatically generates perfect metadata that search engines love. Get discovered on Google, Bing, and Yahoo without lifting a finger.",
            benefit: "Rank higher, get found faster",
            color: "text-purple-500",
            bg: "bg-purple-50",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: RiLineChartLine,
            title: "Real-Time Engagement Tracking",
            description: "Watch your audience engage live. Every view, every click, every interaction tracked instantly. No delays, no waiting for reports.",
            benefit: "Know what's working right now",
            color: "text-blue-500",
            bg: "bg-blue-50",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: RiThunderstormsLine,
            title: "Lightning-Fast Performance",
            description: "Your bio page loads instantly, keeping visitors engaged. Built with cutting-edge technology for blazing speed on any device.",
            benefit: "Zero bounce rate from slow loads",
            color: "text-yellow-500",
            bg: "bg-yellow-50",
            gradient: "from-yellow-500 to-orange-500"
        },
        {
            icon: RiPaletteLine,
            title: "Premium Design System",
            description: "Choose from 11+ professionally crafted themes and 5 stunning templates. Your brand deserves better than cookie-cutter designs.",
            benefit: "Stand out, not blend in",
            color: "text-pink-500",
            bg: "bg-pink-50",
            gradient: "from-pink-500 to-rose-500"
        }
    ];

    const comparisonFeatures = [
        { feature: "Intelligent SEO Optimization", linkpeak: true, others: false },
        { feature: "Real-Time Analytics Dashboard", linkpeak: true, others: false },
        { feature: "Live Visitor Tracking", linkpeak: true, others: "Limited" },
        { feature: "Fan Engagement (Likes)", linkpeak: true, others: false },
        { feature: "Premium Themes Included", linkpeak: "11+", others: "2-3" },
        { feature: "Professional Templates", linkpeak: "5", others: "1-2" },
        { feature: "Custom QR Codes", linkpeak: true, others: "Paid" },
        { feature: "Search Engine Visibility", linkpeak: "Optimized", others: "Basic" },
        { feature: "Mobile Performance", linkpeak: "100/100", others: "Variable" },
        { feature: "Free Forever Plan", linkpeak: true, others: "Limited" }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Content Creator",
            avatar: "/avatars/avatar-female.svg",
            quote: "I've tried 5 different link-in-bio tools. This is the only one where I can actually see my traffic grow in real-time. The analytics are incredible!",
            rating: 5
        },
        {
            name: "Marcus Rodriguez",
            role: "Digital Marketer",
            avatar: "/avatars/avatar-male.svg",
            quote: "The search visibility alone is worth it. My bio page now ranks on Google for my name and brand. That never happened with other tools.",
            rating: 5
        },
        {
            name: "Emma Thompson",
            role: "Influencer",
            avatar: "/avatars/avatar-generic-eco.svg",
            quote: "Finally, a tool that looks as professional as my brand. The themes are stunning and the performance is unmatched.",
            rating: 5
        }
    ];

    return (
        <main className="bg-base-100">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20 pb-16">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -mr-40 -mt-40" aria-hidden="true"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -ml-40 -mb-40" aria-hidden="true"></div>

                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="badge badge-primary badge-outline gap-2 p-4 font-bold tracking-widest uppercase mb-8 text-xs h-auto py-2">
                            <RiSparklingLine className="text-lg" />
                            The Future of Link in Bio
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] text-base-content mb-8">
                            Not just another{" "}
                            <span className="text-primary italic">link in bio.</span>
                            <br />
                            A growth engine.
                        </h1>

                        <p className="text-xl md:text-2xl font-medium text-base-content/60 max-w-3xl mx-auto mb-12 leading-relaxed">
                            While others give you a simple list of links, we give you intelligent optimization,
                            real-time insights, and professional design that actually drives results.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="btn btn-primary btn-lg px-8 text-xl font-medium shadow-2xl shadow-primary/20 hover:scale-105 transition-all group"
                            >
                                Start Growing Free
                                <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#comparison"
                                className="btn btn-ghost btn-lg px-8 text-xl font-bold"
                            >
                                See the Difference
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Unique Features Section */}
            <section className="py-24 bg-base-200/50" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-6">
                            What makes us <span className="text-primary italic">different?</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-base-content/60 max-w-3xl mx-auto">
                            Features that actually move the needle for your growth
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {uniqueFeatures.map((feature, index) => (
                            <motion.article
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-base-100 p-8 border border-base-300 hover:border-primary/50 transition-all duration-300 group hover:shadow-xl"
                                onMouseEnter={() => setActiveFeature(index)}
                            >
                                <div className={`w-16 h-16 ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`text-3xl ${feature.color}`} />
                                </div>

                                <h3 className="text-2xl md:text-3xl font-medium mb-4 tracking-tight">
                                    {feature.title}
                                </h3>

                                <p className="text-base-content/70 text-lg leading-relaxed mb-4">
                                    {feature.description}
                                </p>

                                <div className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                                    <RiRocketLine className={feature.color} />
                                    {feature.benefit}
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works - Benefits Section */}
            <section className="py-24 bg-base-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-6">
                            Built for <span className="text-primary italic">serious creators</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-base-content/60 max-w-3xl mx-auto">
                            Every feature designed to maximize your reach and engagement
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <RiSearchEyeLine className="text-4xl text-white" />
                            </div>
                            <h3 className="text-2xl font-medium mb-4">Get Discovered</h3>
                            <p className="text-base-content/70 leading-relaxed">
                                Your bio page is automatically optimized to appear in search results.
                                People searching for your name or brand will find you instantly.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <RiFlashlightLine className="text-4xl text-white" />
                            </div>
                            <h3 className="text-2xl font-medium mb-4">Track Everything</h3>
                            <p className="text-base-content/70 leading-relaxed">
                                See exactly how visitors interact with your links. Real-time data
                                helps you make smarter decisions about your content strategy.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <RiShieldCheckLine className="text-4xl text-white" />
                            </div>
                            <h3 className="text-2xl font-medium mb-4">Look Professional</h3>
                            <p className="text-base-content/70 leading-relaxed">
                                Premium themes and templates that make your brand shine.
                                No coding required, just pick a style and customize.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 bg-base-200/50" id="comparison">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-6">
                            The honest <span className="text-primary italic">comparison</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-base-content/60">
                            See why creators are making the switch
                        </p>
                    </div>

                    <div className="bg-base-100 border border-base-300 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th className="text-left text-lg font-medium py-6">Feature</th>
                                        <th className="text-center text-lg font-medium py-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <RiSparklingLine className="text-primary text-xl" />
                                                {CONFIG.SITE_NAME}
                                            </div>
                                        </th>
                                        <th className="text-center text-lg font-medium py-6 text-base-content/50">
                                            Other Tools
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonFeatures.map((item, index) => (
                                        <tr key={index} className="hover:bg-base-200/50 transition-colors">
                                            <td className="py-4 font-medium">{item.feature}</td>
                                            <td className="text-center py-4">
                                                {typeof item.linkpeak === 'boolean' ? (
                                                    item.linkpeak ? (
                                                        <div className="flex justify-center">
                                                            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                                                                <RiCheckLine className="text-success text-xl" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center">
                                                            <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center">
                                                                <RiCloseLine className="text-error text-xl" />
                                                            </div>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="font-bold text-primary">{item.linkpeak}</span>
                                                )}
                                            </td>
                                            <td className="text-center py-4 text-base-content/50">
                                                {typeof item.others === 'boolean' ? (
                                                    item.others ? (
                                                        <div className="flex justify-center">
                                                            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                                                                <RiCheckLine className="text-success text-xl" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center">
                                                            <div className="w-8 h-8 bg-error/10 rounded-full flex items-center justify-center">
                                                                <RiCloseLine className="text-error text-xl" />
                                                            </div>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="font-medium">{item.others}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-24 bg-base-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-medium tracking-tighter mb-6">
                            Loved by <span className="text-primary italic">creators</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-base-content/60">
                            Join hundreds of creators who&apos;ve made the switch
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.article
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-base-200/50 p-8 border border-base-300"
                            >
                                <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} star rating`}>
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <RiStarFill key={i} className="text-yellow-500 text-xl" />
                                    ))}
                                </div>

                                <blockquote className="text-base-content/80 leading-relaxed mb-6 italic">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>

                                <div className="flex items-center gap-3">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <div className="font-medium">{testimonial.name}</div>
                                        <div className="text-sm text-base-content/60">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" aria-hidden="true"></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter mb-8 leading-tight">
                            Ready to grow faster than ever?
                        </h2>

                        <p className="text-xl md:text-2xl text-base-content/70 mb-12 leading-relaxed">
                            Join {CONFIG.SITE_NAME} free and see the difference intelligent optimization makes.
                            No credit card required.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link
                                href="/register"
                                className="btn btn-primary btn-lg px-10 text-xl font-medium shadow-2xl shadow-primary/30 hover:scale-105 transition-all group"
                            >
                                Get Started Free
                                <RiArrowRightLine className="group-hover:translate-x-1 transition-transform text-2xl" />
                            </Link>
                        </div>

                        <p className="text-sm text-base-content/50">
                            Free forever • No credit card • Setup in 2 minutes
                        </p>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
