"use client";

import { useState } from "react";
import axios from "@/lib/httpClient";
import Link from "next/link";
import { CONFIG } from "@/constants/config";
import { RiMailLine, RiArrowLeftLine } from "react-icons/ri";

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
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="card w-full max-w-sm bg-base-200">
                <div className="h-2 bg-primary w-full"></div>
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold justify-center mb-2">
                        Reset Password
                    </h2>
                    <p className="text-center text-sm opacity-60 mb-4">
                        Enter your email and we'll send you a reset link
                    </p>

                    {error && (
                        <div className="alert alert-error text-sm py-2">
                            <span>{error}</span>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-8">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                                    <RiMailLine className="text-3xl text-success" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mb-2">Check Your Email</h3>
                            <p className="text-sm opacity-60 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="text-xs opacity-40 mb-4">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail("");
                                }}
                                className="btn btn-sm btn-outline"
                            >
                                Send Another Link
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email Address</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    className="input input-bordered"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-control mt-6">
                                <button
                                    className="btn btn-primary w-full"
                                    disabled={loading}
                                >
                                    {loading && <span className="loading loading-spinner"></span>}
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="divider text-xs opacity-40">OR</div>

                    <Link href="/login" className="btn btn-neutral btn-outline btn-sm gap-2">
                        <RiArrowLeftLine />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
