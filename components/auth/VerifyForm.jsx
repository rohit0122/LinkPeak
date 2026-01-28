"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/httpClient";
import Link from "next/link";
import { ENDPOINTS } from "@/constants/endpoints";
import { RiCheckLine, RiCloseLine } from "react-icons/ri";

export default function VerifyForm() {
    const searchParams = useSearchParams();
    const lpkVerifyToken = searchParams.get("lpkVerifyToken");
    const [status, setStatus] = useState(lpkVerifyToken ? "verifying" : "error");
    const [message, setMessage] = useState(
        lpkVerifyToken
            ? "Please wait while we verify your email..."
            : "Invalid verification link. No token provided."
    );

    useEffect(() => {
        if (!lpkVerifyToken) return;

        const verifyEmail = async () => {
            try {
                const { data } = await axios.post(`${ENDPOINTS.AUTH.VERIFY}`, {
                    lpkVerifyToken: lpkVerifyToken,
                });
                if (data.success) {
                    setStatus("success");
                    setMessage(data.message);
                }
            } catch (err) {
                setStatus("error");
                setMessage(
                    err.response?.data?.error ||
                    "Verification failed. The link may be expired."
                );
            }
        };

        verifyEmail();
    }, [lpkVerifyToken]);

    return (
        <div className="flex justify-center items-center min-h-screen px-4 bg-base-200/20">
            <div className="card w-full max-w-sm bg-base-100 shadow-2xl border border-base-200 overflow-hidden rounded-3xl">
                <div className="h-2 bg-primary w-full"></div>
                <div className="card-body p-8 sm:p-10 items-center text-center">
                    <h2 className="text-3xl font-bold mb-8">
                        Email Verification
                    </h2>

                    {status === "verifying" && (
                        <div className="flex flex-col items-center py-4">
                            <span className="loading loading-spinner loading-lg text-primary mb-6"></span>
                            <p className="font-medium opacity-70">{message}</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
                                <RiCheckLine className="text-4xl text-success" />
                            </div>
                            <p className="mb-8 font-medium text-base-content/70">{message}</p>
                            <Link
                                href="/login"
                                className="btn btn-primary w-full shadow-lg shadow-primary/20 font-bold h-12"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
                                <RiCloseLine className="text-4xl text-error" />
                            </div>
                            <p className="mb-8 font-medium text-base-content/70">{message}</p>
                            <Link
                                href="/register"
                                className="btn btn-neutral btn-outline w-full font-bold h-12"
                            >
                                Back to Registration
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
