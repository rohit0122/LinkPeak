"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Link from "next/link";

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Please wait while we verify your email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link. No token provided.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const { data } = await axios.get(`/auth/verify?token=${token}`);
                if (data.success) {
                    setStatus("success");
                    setMessage(data.message);
                }
            } catch (err) {
                setStatus("error");
                setMessage(err.response?.data?.error || "Verification failed. The link may be expired.");
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="card w-full max-w-sm bg-base-200">
            <div className="card-body items-center text-center">
                <h2 className="card-title text-2xl font-bold mb-4">Email Verification</h2>

                {status === "verifying" && (
                    <div className="flex flex-col items-center">
                        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                        <p>{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <div className="bg-success text-success-content p-4 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="mb-6">{message}</p>
                        <Link href="/login" title="back login" className="btn btn-primary w-full">Go to Login</Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <div className="bg-error text-error-content p-4 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="mb-6">{message}</p>
                        <Link href="/register" title="back register" className="btn btn-outline w-full">Back to Registration</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200 px-4 py-12">
            <Suspense fallback={
                <div className="card w-full max-w-sm bg-base-100 shadow-xl p-8 items-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            }>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
