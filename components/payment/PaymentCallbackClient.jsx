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
            try {
                const res = await axios.post("/api/payment/callback", {
                    razorpay_payment_id: params.get("razorpay_payment_id"),
                    razorpay_payment_link_id: params.get("razorpay_payment_link_id"),
                    razorpay_signature: params.get("razorpay_signature"),
                    userId:
                        JSON.parse(localStorage.getItem("site_user") || "{}")?.id ||
                        params.get("user"),
                    planId: params.get("plan"),
                });

                if (res.data.success) {
                    setStatus("success");
                    router.replace("/dashboard"); // ✅ better for payment callbacks
                } else {
                    setStatus("error");
                }
            } catch (err) {
                setStatus("error");
            }
        };

        submit();
    }, [params, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md w-full">
                {status === "loading" && (
                    <span className="loading loading-spinner loading-lg"></span>
                )}

                {status === "success" && (
                    <>
                        <h2 className="text-2xl font-bold text-success">
                            Payment Successful 🎉
                        </h2>
                        <p className="mt-2 opacity-70">
                            Your PRO subscription is now active.
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h2 className="text-2xl font-bold text-error">
                            Payment Failed ❌
                        </h2>
                        <p className="mt-2 opacity-70">
                            If money was deducted, please contact support.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
