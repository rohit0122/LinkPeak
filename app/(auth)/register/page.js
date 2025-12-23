"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CONFIG } from "@/constants/config";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);

        try {
            const { data } = await axios.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            if (data.success) {
                setSuccess(data.message);
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
            }
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center bg-base-200 px-4">
            <div className="card w-full max-w-sm bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold justify-center mb-4">
                        Join {CONFIG.SITE_NAME}
                    </h2>

                    {error && (
                        <div className="alert alert-error text-sm py-2">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success text-sm py-2">
                            <span>{success}</span>
                        </div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    className="input input-bordered"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-control mt-2">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="input input-bordered"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-control mt-2">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="min 6 characters"
                                    className="input input-bordered"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-control mt-2">
                                <label className="label">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="repeat password"
                                    className="input input-bordered"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-control mt-6">
                                <button className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center mt-4 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" title="login" className="link link-primary font-semibold">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
