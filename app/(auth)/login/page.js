"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CONFIG } from "@/constants/config";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await axios.post("/auth/login", { email, password });
            if (data.success) {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center bg-base-200 px-4">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold justify-center mb-4">
                        Login to {CONFIG.SITE_NAME}
                    </h2>

                    {error && (
                        <div className="alert alert-error text-sm py-2">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
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

                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className="input input-bordered"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="label">
                                <Link href="/forgot-password" title="reset password" className="label-text-alt link link-hover">
                                    Forgot password?
                                </Link>
                            </label>
                        </div>

                        <div className="form-control mt-6">
                            <button className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </form>

                    <p className="text-center mt-4 text-sm">
                        Don't have an account?{" "}
                        <Link href="/register" title="registeration" className="link link-primary font-semibold">
                            Register now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
