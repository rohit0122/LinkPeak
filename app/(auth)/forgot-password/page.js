"use client";

import { useState } from "react";
import axios from "@/lib/httpClient";
import Link from "next/link";
import { CONFIG } from "@/constants/config";
import { RiMailLine, RiArrowLeftLine, RiMailSendLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await axios.post("/auth/forgot-password", { email });
            if (data.success) {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 bg-base-200/20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card w-full max-w-sm bg-base-100 shadow-2xl border border-base-200 overflow-hidden rounded-3xl"
            >
                <div className="h-2 bg-primary w-full"></div>
                <div className="card-body p-8 sm:p-10">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4"
                            >
                                <div className="flex justify-center mb-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.2, 1] }}
                                        transition={{ duration: 0.5 }}
                                        className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center"
                                    >
                                        <RiMailSendLine className="text-4xl text-success" />
                                    </motion.div>
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Check Your Email</h2>
                                <p className="text-base-content/70 mb-8 leading-relaxed font-medium">
                                    We&apos;ve sent a password reset link to <br />
                                    <strong className="text-base-content">{email}</strong>
                                </p>
                                <button
                                    onClick={() => {
                                        setSuccess(false);
                                        setEmail("");
                                    }}
                                    className="btn btn-neutral btn-sm opacity-60 hover:opacity-100 font-bold"
                                >
                                    Try a different email
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold mb-1">
                                        Reset Password
                                    </h2>
                                    <p className="text-sm opacity-50 font-medium">
                                        Enter your email for the recovery link
                                    </p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="alert alert-error text-xs py-3 rounded-xl mb-6"
                                        >
                                            <span>{error}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="form-control">
                                        <label htmlFor="reset-email" className="label py-1">
                                            <span className="label-text font-bold text-xs opacity-50 uppercase tracking-widest">Email Address</span>
                                        </label>
                                        <input
                                            id="reset-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all font-medium border-base-300 focus:border-primary h-12"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-control mt-8">
                                        <button
                                            className="btn btn-primary w-full shadow-lg shadow-primary/20 font-bold h-12"
                                            disabled={loading}
                                        >
                                            {loading ? <span className="loading loading-spinner"></span> : "Send Reset Link"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="divider opacity-50 my-4 uppercase text-[10px] font-bold tracking-tight">OR</div>

                    <p className="text-center text-xs font-medium opacity-80">
                        Remembered your password?{" "}
                        <Link href="/login" className="link link-primary font-bold">
                            Login here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
