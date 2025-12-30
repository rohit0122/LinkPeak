"use client";

import { useState, Suspense } from "react";
import axios from "@/lib/axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CONFIG } from "@/constants/config";
import { RiFileListLine, RiUserLine, RiMoneyDollarCircleLine, RiShieldCheckLine, RiForbidLine, RiCheckLine, RiCloseLine, RiFileTextFill } from "react-icons/ri";

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [agreed, setAgreed] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedPlan = searchParams.get('plan'); // PRO, AGENCY, or null

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

        if (!agreed) {
            return setError("You must agree to the Terms of Service and Privacy Policy to register.");
        }

        setLoading(true);

        try {
            const { data } = await axios.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                plan: selectedPlan, // Pass selected plan from URL
            });

            if (data.success) {
                setSuccess(data.message);
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                setAgreed(false);
            }
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="card w-full max-w-sm bg-base-200">
                <div className="h-2 bg-primary w-full"></div>
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold justify-center mb-4">
                        Join {CONFIG.SITE_NAME}
                    </h2>

                    {selectedPlan && (
                        <div className="alert alert-info text-sm py-3 mb-4">
                            <div>
                                <div className="font-bold">Selected Plan: {selectedPlan}</div>
                                <div className="text-xs opacity-70">Create your account to continue with {selectedPlan} plan</div>
                            </div>
                        </div>
                    )}

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
                                <label className="label" htmlFor="name">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input
                                    id="name"
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
                                <label className="label" htmlFor="email">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    id="email"
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
                                <label className="label" htmlFor="password">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    id="password"
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
                                <label className="label" htmlFor="confirmPassword">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="repeat password"
                                    className="input input-bordered"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-control mt-4">
                                <label className="label cursor-pointer justify-start items-start gap-3">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary checkbox-xs shrink-0 mt-0.5"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                    />
                                    <span className="label-text text-left leading-tight text-xs md:text-sm">
                                        I agree to the <button type="button" onClick={() => setShowTerms(true)} className="link link-primary">Terms of Service</button> and <button type="button" onClick={() => setShowTerms(true)} className="link link-primary">Privacy Policy</button>
                                    </span>
                                </label>
                            </div>

                            <div className="form-control mt-4 ">
                                <button className="btn btn-primary w-full" disabled={loading}>
                                    {loading && <span className="loading loading-spinner"></span>}
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

            {/* Terms Modal */}
            {showTerms && (
                <dialog id="terms_modal" className="modal modal-open" open>
                    <div className="modal-box w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <RiFileTextFill className="text-2xl text-primary" />
                            </div>
                            <h3 className="font-bold text-2xl text-center">Terms of Service & Privacy Policy</h3>
                        </div>

                        <div className="prose prose-sm max-w-none space-y-4">
                            <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                                    <RiFileListLine className="text-xl text-primary shrink-0" />
                                    1. Acceptance of Terms
                                </h4>
                                <p className="mb-0 text-base-content/80 pl-7">By registering, you agree to comply with <strong>{CONFIG.SITE_NAME}'s</strong> Terms of Service. You are responsible for maintaining the confidentiality of your account credentials.</p>
                            </div>

                            <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                                    <RiUserLine className="text-xl text-primary shrink-0" />
                                    2. User Responsibilities
                                </h4>
                                <p className="mb-0 text-base-content/80 pl-7">You agree not to use the service for any illegal or unauthorized purpose. You retain ownership of your content but grant us a license to host and display it.</p>
                            </div>

                            <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                                    <RiMoneyDollarCircleLine className="text-xl text-primary shrink-0" />
                                    3. Subscription & Billing
                                </h4>
                                <p className="mb-0 text-base-content/80 pl-7">Paid subscriptions (PRO, AGENCY) are billed monthly in advance. You can cancel anytime. We do not offer refunds for partial months or unused features.</p>
                            </div>

                            <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                                    <RiShieldCheckLine className="text-xl text-primary shrink-0" />
                                    4. Privacy & Data
                                </h4>
                                <p className="mb-0 text-base-content/80 pl-7">We collect your information to provide the service. We do <strong>not</strong> sell your personal data to third parties. We use localStorage for performance, caching, and session management.</p>
                            </div>

                            <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                                    <RiForbidLine className="text-xl text-primary shrink-0" />
                                    5. Prohibited Content
                                </h4>
                                <p className="mb-0 text-base-content/80 pl-7">We reserve the right to remove content that is illegal, harmful, hateful, or violates our policies at our sole discretion.</p>
                            </div>

                            <div className="divider"></div>

                            <p className="text-center text-sm opacity-70 italic">
                                This is a summary. For full details, please visit our <a href="/terms" target="_blank" className="link link-primary">Terms of Service</a> and <a href="/privacy" target="_blank" className="link link-primary">Privacy Policy</a> pages.
                            </p>
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-primary gap-2" onClick={() => {
                                setAgreed(true);
                                setShowTerms(false);
                            }}>
                                <RiCheckLine className="text-lg" />
                                I Agree
                            </button>
                            <button className="btn gap-2" onClick={() => setShowTerms(false)}>
                                <RiCloseLine className="text-lg" />
                                Close
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setShowTerms(false)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
}

export default function RegisterClient() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}
