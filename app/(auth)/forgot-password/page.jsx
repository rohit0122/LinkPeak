"use client";

import { useState } from "react";
import Link from "next/link";
import { HiEnvelope, HiArrowLeft, HiCheckCircle } from "react-icons/hi2";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                setIsSent(true);
                toast.success("Reset link sent!");
            } else {
                toast.error(data.error || "Something went wrong");
            }
        } catch (error) {
            toast.error("Failed to send reset link");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200/50 p-4">
                <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 overflow-hidden text-center">
                    <div className="h-2 bg-success w-full" />
                    <div className="card-body p-8 flex flex-col items-center">
                        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                            <HiCheckCircle className="text-5xl" />
                        </div>
                        <h1 className="text-2xl font-black mb-2">Check your email</h1>
                        <p className="text-base-content/60 font-medium mb-8">
                            If an account exists for {email}, we've sent instructions to reset your password.
                        </p>
                        <Link href="/login" className="btn btn-ghost btn-block rounded-2xl font-bold">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200/50 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <div className="card-body p-8">
                    <div className="mb-8">
                        <Link href="/login" className="text-sm font-bold text-primary hover:underline flex items-center gap-2 mb-6">
                            <HiArrowLeft /> Back to Login
                        </Link>
                        <h1 className="text-3xl font-black tracking-tighter">Reset Password</h1>
                        <p className="text-base-content/60 font-medium mt-2">Enter your email to receive instructions</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-black uppercase tracking-widest text-[10px] opacity-50">Email Address</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                                    <HiEnvelope className="text-xl" />
                                </div>
                                <input
                                    type="email"
                                    className="input input-bordered w-full pl-12 rounded-2xl font-medium focus:input-primary"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-block rounded-2xl h-14 font-black shadow-xl shadow-primary/20 mt-4"
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner" />
                            ) : (
                                "Send Reset Instructions"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
