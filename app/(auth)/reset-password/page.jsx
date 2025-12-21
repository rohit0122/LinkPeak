"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HiLockClosed, HiCheckCircle, HiArrowRight, HiShieldCheck } from "react-icons/hi2";
import { toast } from "sonner";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid reset link");
            router.push("/login");
        }
    }, [token, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });
            const data = await res.json();
            if (data.success) {
                setIsSuccess(true);
                toast.success("Password reset successful!");
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                toast.error(data.error || "Reset failed");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="card-body p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                    <HiCheckCircle className="text-5xl" />
                </div>
                <h1 className="text-2xl font-black mb-2">Password Updated!</h1>
                <p className="text-base-content/60 font-medium mb-8">
                    Your password has been reset successfully. Redirecting you to login...
                </p>
                <Link href="/login" className="btn btn-primary btn-block rounded-2xl font-bold">
                    Go to Login Now
                </Link>
            </div>
        );
    }

    return (
        <div className="card-body p-8">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                    <HiShieldCheck className="text-3xl" />
                </div>
                <h1 className="text-3xl font-black tracking-tighter">Set New Password</h1>
                <p className="text-base-content/60 font-medium">Almost there! Create a strong new password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-black uppercase tracking-widest text-[10px] opacity-50">New Password</span>
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
                            minLength={8}
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-black uppercase tracking-widest text-[10px] opacity-50">Confirm New Password</span>
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-base-content/30 group-focus-within:text-primary transition-colors">
                            <HiLockClosed className="text-xl" />
                        </div>
                        <input
                            type="password"
                            className="input input-bordered w-full pl-12 rounded-2xl font-medium focus:input-primary"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
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
                            Reset Password <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200/50 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
                <div className="h-2 bg-primary w-full" />
                <Suspense fallback={
                    <div className="card-body p-8 flex items-center justify-center min-h-[400px]">
                        <span className="loading loading-spinner loading-lg text-primary" />
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
