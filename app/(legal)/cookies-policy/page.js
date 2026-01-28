"use client";

import Link from "next/link";
import { CONFIG } from "@/constants/config";
import { motion } from "framer-motion";
import { RiShieldLine, RiArrowRightSLine } from "react-icons/ri";

export default function CookiesPage() {
    const sections = [
        { id: "what", title: "1. What Are Cookies?" },
        { id: "how", title: "2. How We Use Them" },
        { id: "essential", title: "2.1 Essential Storage" },
        { id: "analytics", title: "2.2 Analytics" },
        { id: "thirdparty", title: "3. Third-Party Cookies" },
        { id: "managing", title: "4. Managing Storage" },
        { id: "updates", title: "5. Updates to Policy" },
        { id: "contact", title: "6. Contact Us" },
    ];

    return (
        <div className="min-h-screen bg-base-100 py-12">
            <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12">

                {/* Sticky Side Nav */}
                <aside className="lg:w-64 shrink-0 lg:sticky lg:top-24 h-fit hidden lg:block">
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <RiShieldLine className="text-xl text-primary" />
                        <span className="font-extrabold uppercase tracking-widest text-xs opacity-50">Cookie Navigation</span>
                    </div>
                    <nav className="space-y-1">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="flex items-center justify-between group p-2 rounded-lg hover:bg-base-200 transition-all text-sm font-medium opacity-60 hover:opacity-100"
                            >
                                {section.title}
                                <RiArrowRightSLine className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </a>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 max-w-3xl">
                    {/* Header */}
                    <header className="mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-extrabold mb-4"
                        >
                            Cookie Policy
                        </motion.h1>
                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest">
                            Last Updated: January 31, 2026
                        </p>
                    </header>

                    {/* Content */}
                    <div className="prose prose-neutral prose-lg max-w-none prose-headings:font-extrabold prose-p:text-base-content/80 prose-li:text-base-content/80 prose-strong:text-base-content prose-th:bg-base-200 prose-th:p-4 prose-td:p-4">
                        <section id="what" className="mb-12 scroll-mt-24">
                            <h2 className="text-3xl font-extrabold mb-6">1. What Are Cookies?</h2>
                            <p>
                                Cookies are small text files stored on your device when you visit a website. They help websites
                                remember your preferences and improve your experience.
                            </p>
                            <p className="bg-primary/5 p-6 rounded-2xl border border-primary/10 font-medium mt-6">
                                <strong className="text-primary">Note:</strong> {CONFIG.SITE_NAME} primarily uses <strong>localStorage</strong> (a modern browser storage
                                technology) instead of traditional cookies. localStorage works similarly but offers better performance
                                and does not increase network payload on every request.
                            </p>
                        </section>

                        <section id="how" className="mb-12 scroll-mt-24">
                            <h2 className="text-3xl font-extrabold mb-6">2. How We Use Cookies and Local Storage</h2>
                            <p>We use browser storage technologies for the following purposes:</p>
                        </section>

                        <section id="essential" className="mb-12 scroll-mt-24">
                            <h3 className="text-2xl font-bold mb-4">2.1 Essential Storage (Required)</h3>
                            <p>These are necessary for the Service to function:</p>
                            <div className="overflow-x-auto mt-6 rounded-2xl border border-base-200">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th>Type</th>
                                            <th>Name</th>
                                            <th>Purpose</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Cookie</td>
                                            <td className="font-mono text-sm">lpkSiteToken</td>
                                            <td>Primary authentication (HTTP-Only)</td>
                                            <td>30 Days</td>
                                        </tr>
                                        <tr>
                                            <td>LocalStorage</td>
                                            <td className="font-mono text-sm">lpkAuthStorage</td>
                                            <td>Maintains session state and user profile</td>
                                            <td>Persistent</td>
                                        </tr>
                                        <tr>
                                            <td>LocalStorage</td>
                                            <td className="font-mono text-sm">lpkSiteCookieConsent</td>
                                            <td>Remembers your cookie preferences</td>
                                            <td>Persistent</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="analytics" className="mb-12 scroll-mt-24">
                            <h3 className="text-2xl font-bold mb-4">2.2 Analytics and Engagement Storage</h3>
                            <p>These help us understand how visitors interact with bio pages:</p>
                            <div className="overflow-x-auto mt-6 rounded-2xl border border-base-200">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th>Type</th>
                                            <th>Name</th>
                                            <th>Purpose</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Cookie</td>
                                            <td className="font-mono text-sm">_ga, _ga_*</td>
                                            <td>Google Analytics usage tracking</td>
                                            <td>2 Years</td>
                                        </tr>
                                        <tr>
                                            <td>LocalStorage</td>
                                            <td className="font-mono text-sm">liked_*</td>
                                            <td>Tracks your &quot;likes&quot; to prevent duplicates</td>
                                            <td>Persistent</td>
                                        </tr>
                                        <tr>
                                            <td>LocalStorage</td>
                                            <td className="font-mono text-sm">viewed_*, click_*</td>
                                            <td>Prevents duplicate view/click counts per session</td>
                                            <td>Session</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section id="thirdparty" className="mb-12 scroll-mt-24">
                            <h2 className="text-3xl font-extrabold mb-6">3. Third-Party Cookies</h2>
                            <p>
                                We use minimal third-party services that may set their own cookies:
                            </p>
                            <ul>
                                <li>
                                    <strong>Payment Processors (Razorpay):</strong> May set cookies during payment processing
                                    for fraud prevention and security.
                                </li>
                                <li>
                                    <strong>Analytics (Google):</strong> Google Analytics sets cookies to track general site usage.
                                </li>
                            </ul>
                            <p className="mt-6 font-bold text-base-content underline decoration-primary decoration-4 underline-offset-4">
                                We do NOT use third-party advertising or marketing trackers.
                            </p>
                        </section>

                        <section id="managing" className="mb-12 scroll-mt-24">
                            <h2 className="text-3xl font-extrabold mb-6">4. Managing Cookies and Local Storage</h2>
                            <h3 className="text-xl font-bold mb-4 mt-8">4.1 Browser Settings</h3>
                            <p>
                                You can control and delete cookies and localStorage through your browser settings:
                            </p>
                            <ul>
                                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and site data</li>
                                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site data</li>
                            </ul>

                            <h3 className="text-xl font-bold mb-4 mt-8">4.2 Clear {CONFIG.SITE_NAME} Data</h3>
                            <p>
                                To clear only {CONFIG.SITE_NAME}&apos;s stored data:
                            </p>
                            <ol>
                                <li>Open your browser&apos;s Developer Tools (F12)</li>
                                <li>Go to the &quot;Application&quot; or &quot;Storage&quot; tab</li>
                                <li>Find &quot;Local Storage&quot; → &quot;{CONFIG.SITE_URL}&quot;</li>
                                <li>Click &quot;Clear All&quot; or delete individual items</li>
                            </ol>
                        </section>

                        <section id="updates" className="mb-12 scroll-mt-24">
                            <h2 className="text-3xl font-extrabold mb-6">5. Updates to This Policy</h2>
                            <p>
                                We may update this Cookie Policy from time to time. The &quot;Last Updated&quot; date at the top indicates when changes were made.
                            </p>
                        </section>

                        <section id="contact" className="mb-24 scroll-mt-24">
                            <h2 className="text-3xl font-extrabold mb-6">6. Contact Us</h2>
                            <p>
                                If you have questions about our use of cookies and localStorage, contact us:
                            </p>
                            <p className="mt-4 flex items-baseline gap-2">
                                <span className="font-bold">Email:</span>
                                <a href={`mailto:${CONFIG.SUPPORT_EMAIL}`} className="text-primary hover:underline font-extrabold underline-offset-4 decoration-2">
                                    {CONFIG.SUPPORT_EMAIL}
                                </a>
                            </p>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
