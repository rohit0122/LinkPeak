"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { ENDPOINTS } from "@/constants/endpoints";
import { CONFIG } from "@/constants/config";
import { RiCheckLine, RiCloseLine, RiErrorWarningLine, RiLoader4Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function PaymentCallbackClient() {
    const params = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const submit = async () => {
            const payStatus = params.get("razorpay_payment_link_status");
            const paymentId = params.get("razorpay_payment_id");
            const linkId = params.get("razorpay_payment_link_id");
            const signature = params.get("razorpay_signature");

            if (payStatus === "cancelled") {
                setStatus("cancelled");
                return;
            }

            if (!paymentId || !linkId || !signature) {
                if (payStatus) setStatus("error");
                return;
            }

            try {
                const res = await axios.post(ENDPOINTS.PAYMENT.CALLBACK, {
                    razorpay_payment_id: paymentId,
                    razorpay_payment_link_id: linkId,
                    razorpay_payment_link_status: payStatus,
                    razorpay_payment_link_reference_id: params.get("razorpay_payment_link_reference_id") || "",
                    razorpay_signature: signature,
                    userId:
                        JSON.parse(localStorage.getItem("lpkSiteCurrentUser") || "{}")?.id ||
                        params.get("currentUser"),
                    planId: params.get("plan"),
                });

                if (res.data.success) {
                    setStatus("success");
                    setTimeout(() => {
                        router.replace("/dashboard");
                    }, 3000);
                } else {
                    setStatus("error");
                }
            } catch (err) {
                console.error("Callback verification failed:", err);
                setStatus("error");
            }
        };

        submit();
    }, [params, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200/50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200 overflow-hidden rounded-3xl"
            >
                <div className={`h-2 w-full transition-colors duration-500 ${status === 'loading' ? 'bg-primary animate-pulse' :
                    status === 'success' ? 'bg-success' :
                        status === 'error' ? 'bg-error' : 'bg-warning'
                    }`}></div>

                <div className="card-body p-8 sm:p-10 text-center">
                    <AnimatePresence mode="wait">
                        {status === "loading" && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-6 py-8"
                            >
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full border-4 border-primary/10 flex items-center justify-center">
                                        <RiLoader4Line className="text-4xl text-primary animate-spin" />
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 bg-primary rounded-full"
                                    ></motion.div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-2">Verifying Payment</h2>
                                    <p className="text-sm opacity-50 font-medium max-w-[240px] mx-auto">
                                        Securely confirming your transaction with the provider...
                                    </p>
                                </div>
                                <div className="sr-only" aria-live="polite">Verifying your payment, please wait.</div>
                            </motion.div>
                        )}

                        {status === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <RiCheckLine className="text-5xl" />
                                </motion.div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2">Payment Secured! 🎉</h2>
                                <p className="text-sm opacity-60 font-medium mb-8">
                                    Your premium features are now unlocked. Welcome to the elite level of {CONFIG.SITE_NAME}.
                                </p>
                                <div className="flex flex-col items-center gap-3">
                                    <span className="loading loading-dots loading-sm text-success"></span>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Redirecting to Dashboard</p>
                                </div>
                                <div className="sr-only" aria-live="assertive">Success! Payment verified. Redirecting you now.</div>
                            </motion.div>
                        )}

                        {(status === "error" || status === "cancelled") && (
                            <motion.div
                                key="failure"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-8"
                            >
                                <div className={`w-20 h-20 ${status === 'error' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    {status === 'error' ? <RiCloseLine className="text-5xl" /> : <RiErrorWarningLine className="text-5xl" />}
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2">
                                    {status === 'error' ? 'Verification Failed' : 'Payment Cancelled'}
                                </h2>
                                <p className="text-sm opacity-60 font-medium mb-10 leading-relaxed">
                                    {status === 'error'
                                        ? "We encountered a glitch while verifying your payment. If money was deducted, our team will resolve it within 24 hours."
                                        : "The payment session was closed. No changes have been made to your account."}
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button onClick={() => router.replace("/dashboard")} className="btn btn-primary shadow-lg shadow-primary/20 font-bold h-12 rounded-2xl">
                                        {status === 'error' ? 'Back to Dashboard' : 'Try Again'}
                                    </button>
                                    <Link href="/contact-us" className="btn btn-ghost btn-sm font-bold opacity-50 hover:opacity-100">
                                        Contact Support
                                    </Link>
                                </div>
                                <div className="sr-only" aria-live="assertive">
                                    {status === 'error' ? 'Error: Verification failed.' : 'Payment was cancelled.'}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
