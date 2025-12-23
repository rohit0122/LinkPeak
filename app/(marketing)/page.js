"use client";

import { useState } from "react";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import LiveDemo from "@/components/marketing/LiveDemo";
import Pricing from "@/components/marketing/Pricing";
import FAQ from "@/components/marketing/FAQ";
import { RiArrowRightLine, RiTwitterFill, RiInstagramFill, RiGithubFill } from "react-icons/ri";
import { CONFIG } from "@/constants/config";

export default function MarketingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main>
                <Hero />

                {/* Features Section */}
                <Features />

                {/* Live Demo Section */}
                <LiveDemo />

                <Pricing />

                <FAQ />

                {/* Call to Action */}
                <section className="py-24 bg-primary text-primary-content overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="grid grid-cols-10 h-full">
                            {Array.from({ length: 100 }).map((_, i) => (
                                <div key={i} className="border border-primary-content h-20 w-full"></div>
                            ))}
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h2 className="text-5xl md:text-7xl font-medium tracking-tighter mb-8 leading-none">
                            Ready to claim <br />your spotlight?
                        </h2>
                        <p className="text-xl md:text-2xl opacity-80 mb-12 font-medium">
                            Join thousands of creators who are taking their digital identity to the next level.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <a href="/register" className="btn btn-lg bg-base-100 text-primary border-none hover:bg-base-200 shadow-2xl px-12 text-2xl font-medium">
                                Create Your Page <RiArrowRightLine />
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-base-100 py-20 border-t border-base-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-1">
                            <h3 className="text-3xl font-medium tracking-tighter mb-6">
                                {CONFIG.SITE_NAME}<span className="text-primary italic">.</span>
                            </h3>
                            <p className="opacity-50 font-medium leading-relaxed mb-8">
                                Empowering creators with the world's most beautiful and data-driven bio pages.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="btn btn-square btn-ghost text-2xl hover:text-primary"><RiTwitterFill /></a>
                                <a href="#" className="btn btn-square btn-ghost text-2xl hover:text-primary"><RiInstagramFill /></a>
                                <a href="#" className="btn btn-square btn-ghost text-2xl hover:text-primary"><RiGithubFill /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium uppercase tracking-widest text-xs opacity-30 mb-6">Product</h4>
                            <ul className="space-y-4 font-bold">
                                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#demo" className="hover:text-primary transition-colors">Interactive Demo</a></li>
                                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium uppercase tracking-widest text-xs opacity-30 mb-6">Legal</h4>
                            <ul className="space-y-4 font-bold">
                                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-medium uppercase tracking-widest text-xs opacity-30 mb-6">Newsletter</h4>
                            <p className="text-sm opacity-50 mb-6 font-medium">Get the latest tips on growing your digital presence.</p>
                            <div className="join w-full">
                                <input className="input input-bordered join-item flex-1 bg-base-200" placeholder="your@email.com" />
                                <button className="btn btn-primary join-item">Join</button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-base-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold opacity-30">
                        <p>© 2025 {CONFIG.SITE_NAME}. All rights reserved.</p>
                        <p>Handcrafted by Antigravity AI.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
