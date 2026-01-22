"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiHomeLine, RiSearchLine, RiGhostLine } from "react-icons/ri";
import { CONFIG } from "@/constants/config";
import { motion, AnimatePresence } from "framer-motion";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-base-200/50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full relative z-10"
            >
                <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden rounded-3xl">
                    <div className="h-2 bg-primary w-full"></div>
                    <div className="card-body p-8 sm:p-12 items-center text-center">
                        {/* 404 Icon Section */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                            className="relative mb-6"
                        >
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                            <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <RiGhostLine className="text-5xl text-primary" />
                            </div>
                        </motion.div>

                        {/* Title Section */}
                        <div className="space-y-2 mb-8">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-7xl font-bold text-primary/30"
                            >
                                404
                            </motion.h1>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-bold"
                            >
                                Lost in Space?
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm opacity-50 font-medium max-w-[280px] mx-auto leading-relaxed"
                            >
                                The page you&apos;re looking for has moved to a new universe or never existed.
                            </motion.p>
                        </div>

                        {/* Search Hint / Bio Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="w-full bg-base-200/50 rounded-2xl p-4 flex items-center gap-4 text-left border border-base-300/50 mb-8"
                        >
                            <div className="w-10 h-10 rounded-xl bg-base-100 flex items-center justify-center shadow-sm">
                                <RiSearchLine className="text-lg opacity-40" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-0.5">Quick Tip</h4>
                                <p className="text-xs font-bold leading-tight">Double check the username or link URL</p>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-col gap-3 w-full"
                        >
                            <Link
                                href="/"
                                className="btn btn-primary w-full shadow-lg shadow-primary/20 font-bold h-12 rounded-2xl"
                            >
                                <RiHomeLine className="text-xl" />
                                Return Home
                            </Link>
                            <button
                                onClick={() => router.back()}
                                className="btn btn-neutral btn-outline w-full font-bold opacity-60 hover:opacity-100 transition-all"
                            >
                                <RiArrowLeftLine className="text-xl" />
                                Go Back
                            </button>
                        </motion.div>

                        {/* Footer Branding */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-10 pt-6 border-t border-base-200 w-full"
                        >
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">
                                {CONFIG.SITE_NAME}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
