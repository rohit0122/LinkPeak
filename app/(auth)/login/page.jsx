"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { HiEnvelope, HiLockClosed, HiArrowRight } from "react-icons/hi2";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await login(email, password);
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200/50 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <div className="card-body p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tighter">Welcome Back</h1>
                        <p className="text-base-content/60 font-medium">Log in to your peak overview</p>
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

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-black uppercase tracking-widest text-[10px] opacity-50">Password</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                                    <HiLockClosed className="text-xl" />
                                </div>
                                <input
                                    type="password"
                                    className="input input-bordered w-full pl-12 rounded-2xl font-medium focus:input-primary"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-1">
                                <Link href="/forgot-password" size="sm" className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary btn-block rounded-2xl h-14 font-black shadow-xl shadow-primary/20 mt-4 group"
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner" />
                            ) : (
                                <>
                                    Enter Dashboard <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm font-medium text-base-content/60">
                        New to LinkPeak?{" "}
                        <Link href="/register" className="text-primary font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
