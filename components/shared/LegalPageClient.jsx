"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RiShieldKeyholeLine, RiArrowRightSLine } from "react-icons/ri";

export default function LegalPageClient({ title, lastUpdated, sections, children }) {
    return (
        <div className="min-h-screen bg-base-100 py-12">
            <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12">

                {/* Sticky Side Nav */}
                <aside className="lg:w-64 shrink-0 lg:sticky lg:top-24 h-fit hidden lg:block">
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <RiShieldKeyholeLine className="text-xl text-primary" />
                        <span className="font-bold uppercase tracking-widest text-xs opacity-50">Navigation</span>
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
                            className="text-5xl md:text-6xl font-bold mb-4"
                        >
                            {title}
                        </motion.h1>
                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest">
                            Last Updated: {lastUpdated}
                        </p>
                    </header>

                    {/* Content */}
                    <div className="prose prose-neutral prose-lg max-w-none prose-headings:font-bold prose-p:text-base-content/80 prose-li:text-base-content/80 prose-strong:text-base-content">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
