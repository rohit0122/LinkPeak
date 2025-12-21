"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { HiEnvelope, HiLockClosed, HiUser, HiArrowRight } from "react-icons/hi2";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await register(email, password, name);
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200/50 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
                <div className="h-2 bg-secondary w-full" />
                <div className="card-body p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tighter">Join Peak</h1>
                        <p className="text-base-content/60 font-medium">Start optimizing your bio link</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-black uppercase tracking-widest text-[10px] opacity-50">Full Name</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-secondary transition-colors">
                                    <HiUser className="text-xl" />
                                </div>
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-12 rounded-2xl font-medium focus:input-secondary"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-black uppercase tracking-widest text-[10px] opacity-50">Email Address</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-secondary transition-colors">
                                    <HiEnvelope className="text-xl" />
                                </div>
                                <input
                                    type="email"
                                    className="input input-bordered w-full pl-12 rounded-2xl font-medium focus:input-secondary"
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
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-secondary transition-colors">
                                    <HiLockClosed className="text-xl" />
                                </div>
                                <input
                                    type="password"
                                    className="input input-bordered w-full pl-12 rounded-2xl font-medium focus:input-secondary"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-secondary btn-block rounded-2xl h-14 font-black shadow-xl shadow-secondary/20 mt-4 group"
                        >
                            {isSubmitting ? (
                                <span className="loading loading-spinner" />
                            ) : (
                                <>
                                    Create Free Account <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm font-medium text-base-content/60">
                        Already have an account?{" "}
                        <Link href="/login" className="text-secondary font-bold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
