"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

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

            // 🛑 Handle Cancellation/Failure early
            if (payStatus === "cancelled") {
                setStatus("cancelled");
                return;
            }

            if (!paymentId || !linkId || !signature) {
                // If we are on this page but missing keys, it's either an error or direct access
                if (payStatus) setStatus("error");
                return;
            }

            try {
                const res = await axios.post("/api/payment/callback", {
                    razorpay_payment_id: paymentId,
                    razorpay_payment_link_id: linkId,
                    razorpay_signature: signature,
                    userId:
                        JSON.parse(localStorage.getItem("site_user") || "{}")?.id ||
                        params.get("user"),
                    planId: params.get("plan"),
                });

                if (res.data.success) {
                    setStatus("success");
                    // Keep success message briefly then redirect
                    setTimeout(() => {
                        router.replace("/dashboard");
                    }, 2500);
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
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md w-full">
                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="text-sm opacity-60">Verifying your payment, please don't close this window...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-success">
                            Payment Successful 🎉
                        </h2>
                        <p className="mt-2 opacity-70">
                            Your subscription is now active. Redirecting you to the dashboard...
                        </p>
                    </div>
                )}

                {status === "error" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-error">
                            Verification Failed ❌
                        </h2>
                        <p className="mt-2 opacity-70">
                            We couldn't verify your payment. If money was deducted, please wait 5 minutes or contact support.
                        </p>
                        <button onClick={() => router.replace("/dashboard")} className="btn btn-ghost btn-sm mt-6">Return to Dashboard</button>
                    </div>
                )}

                {status === "cancelled" && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-warning">
                            Payment Cancelled ⚠️
                        </h2>
                        <p className="mt-2 opacity-70">
                            The payment process was cancelled. No charges were made.
                        </p>
                        <button onClick={() => router.replace("/dashboard")} className="btn btn-primary btn-sm mt-6">Try Again</button>
                    </div>
                )}
            </div>
        </div>
    );
}
