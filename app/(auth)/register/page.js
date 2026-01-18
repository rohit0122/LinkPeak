"use client";

import { useState, Suspense, use, useEffect } from "react";
import axios from "@/lib/httpClient";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { CONFIG } from "@/constants/config";
import {
  RiFileListLine,
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
  RiForbidLine,
  RiCheckLine,
  RiCloseLine,
  RiFileTextFill,
  RiMailCheckLine,
  RiCustomerService2Line,
  RiInformationLine,
} from "react-icons/ri";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLoaderStore } from "@/stores/loaderStore";

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
  // const [success, setSuccess] = useState(""); // Removed string state
  const [isSuccess, setIsSuccess] = useState(false); // Added boolean state for UI switching
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { register } = useAuthStore(); // Destructure register from useAuthStore
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(
    searchParams.get("plan") || "FREE"
  );
  const hideLoader = useLoaderStore((state) => state.hideLoader);

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!agreed) {
      return setError(
        "You must agree to the Terms of Service and Privacy Policy to register."
      );
    }

    setLoading(true);

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        selectedPlan,
        router
      );

      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setAgreed(false);
      } else {
        // Error is handled by toast in AuthContext, but we set it here for display if needed
        setError(result.error);
      }
    } catch (err) {
      // Should be caught inside register, but safety net
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: "FREE",
      name: "Free",
      price: "0",
      description: "Perfect for personal bios",
      features: ["5 Bio Links", "Classic Layout", "7-Day Insights"],
      color: "neutral",
    },
    {
      id: "PRO",
      name: "Pro",
      price: "9",
      description: "Best for creators",
      features: ["Unlimited Links", "10+ Pro Themes", "90-Day Insights", "Custom QR Share"],
      color: "primary",
      recommended: true,
      trial: "7 Days Free Trial"
    },
    {
      id: "AGENCY",
      name: "Agency",
      price: "49",
      description: "For professional brands",
      features: ["10 Bio Projects", "All Premium Themes", "Lifetime Insights", "Priority Support"],
      color: "secondary",
      trial: "7 Days Free Trial"
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-12 bg-base-300/30">
      <div className={`w-full ${isSuccess ? 'max-w-sm' : 'max-w-4xl'} transition-all`}>
        {isSuccess ? (
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="h-2 bg-success w-full"></div>
            <div className="card-body text-center p-8">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <RiMailCheckLine className="text-4xl text-green-600" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">Account Created!</h2>
              <p className="text-base-content/70 mb-6 leading-relaxed">
                Welcome to {CONFIG.SITE_NAME}! We&apos;ve sent a verification link to your registered email.
                Please check your inbox (and spam folder) to activate your account.
              </p>

              <div className="flex flex-col gap-3">
                <Link href="/login" className="btn btn-primary w-full shadow-lg">
                  Proceed to Login
                </Link>
                <Link href="/contact-us" className="btn btn-neutral btn-outline btn-sm gap-2">
                  <RiCustomerService2Line />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left: Plan Selector */}
            <div className="flex-1 space-y-4">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Choose Your Power</h1>
                <p className="opacity-60 text-sm">Select the plan that fits your growth journey.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`flex flex-col p-4 border-2 transition-all text-left relative overflow-hidden group ${selectedPlan === plan.id
                      ? `border-${plan.color} bg-base-100 ring-4 ring-${plan.color}/10 shadow-xl`
                      : "border-base-300 bg-base-100/50 hover:border-base-content/20"
                      }`}
                  >
                    <div className="flex flex-col w-full">
                      {plan.recommended && (
                        <div className="inline-flex self-start px-1.5 py-0.5 bg-primary text-primary-content text-[7px] font-black uppercase tracking-[0.2em] font-heading mb-1.5 shadow-sm">
                          MOST POPULAR
                        </div>
                      )}

                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col">
                          <span className={`text-xs font-black uppercase tracking-widest text-${plan.color} font-heading`}>
                            {plan.name}
                          </span>
                          <p className="text-[10px] opacity-40 font-medium leading-tight">{plan.description}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-2xl font-medium tracking-tighter font-heading text-base-content">${plan.price}</span>
                            <span className="text-[9px] opacity-40 font-bold uppercase">/mo</span>
                          </div>
                          {plan.trial && (
                            <span className={`text-[8px] font-black text-${plan.color} animate-pulse bg-${plan.color}/10 px-1.5 py-0.5 mt-0.5`}>
                              {plan.trial}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>


                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <RiCheckLine className={`text-sm text-${plan.color}`} />
                          <span className="text-[10px] font-bold opacity-80">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Radio Indicator */}
                    <div className={`absolute bottom-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === plan.id ? `bg-${plan.color} border-${plan.color}` : "border-base-300"
                      }`}>
                      {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Registration Form */}
            <div className="w-full lg:w-[400px] shrink-0">
              <div className="card bg-base-100 shadow-2xl border border-base-300 sticky top-12">
                <div className="h-2 bg-primary w-full"></div>
                <div className="card-body p-8">
                  <div className="flex flex-col mb-2 md:flex-row md:justify-between md:items-center md:mb-6">
                    <h2 className="card-title text-2xl font-bold">Create Account</h2>
                    <div className="badge badge-success badge-sm gap-1 py-3 px-3 rounded-none font-bold text-[10px]">
                      <RiShieldCheckLine /> NO CC REQUIRED
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="alert alert-error text-xs py-3 rounded-xl">
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-bold text-xs opacity-60">Full Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. John Doe"
                        className="input input-bordered focus:input-primary transition-all w-full"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-bold text-xs opacity-60">Professional Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className="input input-bordered focus:input-primary transition-all w-full"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="new-email"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-bold text-xs opacity-60">Secret Password</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="input input-bordered focus:input-primary transition-all w-full"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text font-bold text-xs opacity-60">Confirm Password</span>
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        className="input input-bordered focus:input-primary transition-all w-full"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                      />
                    </div>

                    <div className="form-control pt-2">
                      <label className="label cursor-pointer justify-start items-start gap-3">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm shrink-0"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <span className="label-text text-left leading-tight text-xs">
                          I agree to the{" "}
                          <button type="button" onClick={() => setShowTerms(true)} className="link link-primary font-bold">Terms</button>
                          {" "}and{" "}
                          <button type="button" onClick={() => setShowTerms(true)} className="link link-primary font-bold">Privacy Policy</button>
                        </span>
                      </label>
                    </div>

                    <button className="btn btn-primary btn-md w-full mt-4 shadow-lg shadow-primary/20 font-bold text-base h-12" disabled={loading}>
                      {loading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        `Join with ${selectedPlan} Plan`
                      )}
                    </button>

                    <p className="text-center mt-6 text-xs font-medium opacity-60">
                      Already using {CONFIG.SITE_NAME}?{" "}
                      <Link href="/login" className="link link-primary font-bold">
                        Login here
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showTerms && (
        <dialog id="terms_modal" className="modal modal-open" open>
          <div className="modal-box w-11/12 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <RiFileTextFill className="text-2xl text-primary" />
              </div>
              <h3 className="font-bold text-2xl text-center">
                Terms of Service & Privacy Policy
              </h3>
            </div>

            <div className="prose prose-sm max-w-none space-y-4">
              <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                  <RiFileListLine className="text-xl text-primary shrink-0" />
                  1. Acceptance of Terms
                </h4>
                <p className="mb-0 text-base-content/80 pl-7">
                  By registering, you agree to comply with{" "}
                  <strong>{CONFIG.SITE_NAME}&apos;s</strong> Terms of Service. You
                  are responsible for maintaining the confidentiality of your
                  account credentials.
                </p>
              </div>

              <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                  <RiUserLine className="text-xl text-primary shrink-0" />
                  2. User Responsibilities
                </h4>
                <p className="mb-0 text-base-content/80 pl-7">
                  You agree not to use the service for any illegal or
                  unauthorized purpose. You retain ownership of your content but
                  grant us a license to host and display it.
                </p>
              </div>

              <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                  <RiMoneyDollarCircleLine className="text-xl text-primary shrink-0" />
                  3. Subscription & Billing
                </h4>
                <p className="mb-0 text-base-content/80 pl-7">
                  Paid subscriptions (PRO, AGENCY) are billed monthly in
                  advance. You can cancel anytime. We do not offer refunds for
                  partial months or unused features.
                </p>
              </div>

              <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                  <RiShieldCheckLine className="text-xl text-primary shrink-0" />
                  4. Privacy & Data
                </h4>
                <p className="mb-0 text-base-content/80 pl-7">
                  We collect your information to provide the service. We do{" "}
                  <strong>not</strong> sell your personal data to third parties.
                  We use localStorage for performance, caching, and session
                  management.
                </p>
              </div>

              <div className="bg-base-200 p-5 rounded-xl border border-base-300">
                <h4 className="mt-0 font-bold text-base text-base-content mb-2 flex items-center gap-2">
                  <RiForbidLine className="text-xl text-primary shrink-0" />
                  5. Prohibited Content
                </h4>
                <p className="mb-0 text-base-content/80 pl-7">
                  We reserve the right to remove content that is illegal,
                  harmful, hateful, or violates our policies at our sole
                  discretion.
                </p>
              </div>

              <div className="divider"></div>

              <p className="text-center text-sm opacity-70 italic">
                This is a summary. For full details, please visit our{" "}
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  className="link link-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="link link-primary"
                >
                  Privacy Policy
                </Link>{" "}
                pages.
              </p>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary gap-2"
                onClick={() => {
                  setAgreed(true);
                  setShowTerms(false);
                }}
              >
                <RiCheckLine className="text-lg" />I Agree
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

export default function RegisterPage() {

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-base-200">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
