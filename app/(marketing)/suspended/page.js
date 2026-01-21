"use client";

import Link from "next/link";
import { RiErrorWarningLine, RiCustomerService2Line, RiArrowRightSLine } from "react-icons/ri";
import SubscriptionStatusDiv from "@/components/dashboard/SubscriptionStatusDiv";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion } from "framer-motion";
import { CONFIG } from "@/constants/config";

export default function SuspendedPage() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen bg-base-200/50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full"
            >
                <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden rounded-3xl">
                    <div className="h-2 bg-error w-full"></div>
                    <div className="card-body p-8 sm:p-12 items-center text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                            className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6 text-error border border-error/20"
                        >
                            <RiErrorWarningLine className="text-4xl" />
                        </motion.div>

                        <div className="mb-8">
                            <h1 className="text-4xl font-bold mb-3">Access Suspended</h1>
                            <p className="text-sm opacity-50 font-medium max-w-sm mx-auto leading-relaxed">
                                Your account trial has expired or requires a subscription update to remain active.
                                {isAuthenticated ? " Please reactivate your plan below." : " Please contact support to restore access."}
                            </p>
                        </div>

                        <div className="w-full mb-10 overflow-hidden rounded-2xl border border-base-200 shadow-sm">
                            {/* We use SubscriptionStatus but disable redirect to prevent loop */}
                            <SubscriptionStatusDiv redirectOnExpire={false} />
                        </div>

                        <div className="divider opacity-10 uppercase text-[10px] font-bold tracking-widest mb-8">Navigation</div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <Link href="/contact-us" className="btn btn-neutral w-full sm:flex-1 h-12 rounded-2xl font-bold gap-2">
                                <RiCustomerService2Line className="text-xl" />
                                Support Center
                            </Link>
                            <Link href="/" className="btn btn-ghost w-full sm:flex-1 h-12 rounded-2xl font-bold gap-2 opacity-60 hover:opacity-100">
                                Back to Home
                                <RiArrowRightSLine className="text-xl" />
                            </Link>
                        </div>

                        {/* Footer Branding */}
                        <div className="mt-12 pt-6 border-t border-base-200 w-full">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">
                                {CONFIG.SITE_NAME} SECURITY
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
