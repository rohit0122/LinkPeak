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
import { motion, AnimatePresence } from "framer-motion";

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
        window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="flex justify-center items-center min-h-screen px-4 py-20 bg-base-200/30">
      <div className={`w-full ${isSuccess ? 'max-w-md' : 'max-w-5xl'} transition-all duration-500`}>
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-success to-emerald-400 w-full"></div>
              <div className="card-body text-center p-10">
                <div className="flex justify-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center"
                  >
                    <RiMailCheckLine className="text-5xl text-success" />
                  </motion.div>
                </div>

                <h2 className="text-3xl font-bold mb-4">Account Created!</h2>
                <p className="text-base-content/70 mb-8 leading-relaxed font-medium">
                  Welcome to {CONFIG.SITE_NAME}! We&apos;ve sent a verification link to your registered email.
                  Please check your inbox to activate your account.
                </p>

                <div className="flex flex-col gap-4">
                  <Link href="/login" className="btn btn-primary w-full shadow-lg shadow-primary/20 font-bold h-12">
                    Proceed to Login
                  </Link>
                  <Link href="/contact-us" className="btn btn-ghost btn-sm gap-2 font-bold opacity-60 hover:opacity-100 transition-opacity">
                    <RiCustomerService2Line className="text-lg" />
                    Contact Support
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row gap-10 items-stretch"
            >
              {/* Left: Plan Selector */}
              <div className="flex-1 space-y-6">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-2">Choose Your Power</h1>
                  <p className="opacity-50 font-medium">Select the plan that fits your growth journey.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                  {plans.map((plan, i) => (
                    <motion.button
                      key={plan.id}
                      type="button"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`flex flex-col p-6 border-2 transition-all text-left relative overflow-hidden rounded-2xl group ${selectedPlan === plan.id
                        ? `border-${plan.color} bg-base-100 ring-4 ring-${plan.color}/5 shadow-xl`
                        : "border-base-300 bg-base-100/40 hover:border-base-content/20"
                        }`}
                    >
                      <div className="flex flex-col w-full mb-4">
                        {plan.recommended && (
                          <div className="inline-flex self-start px-2 py-0.5 bg-primary text-primary-content text-[8px] font-bold uppercase tracking-widest mb-3 rounded-full">
                            MOST POPULAR
                          </div>
                        )}

                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold uppercase tracking-widest text-${plan.color}`}>
                              {plan.name}
                            </span>
                            <p className="text-xs opacity-50 font-medium leading-tight">{plan.description}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold text-base-content">${plan.price}</span>
                              <span className="text-xs opacity-40 font-bold">/MO</span>
                            </div>
                            {plan.trial && (
                              <span className={`text-[10px] font-black text-${plan.color} animate-pulse bg-${plan.color}/10 px-2 py-0.5 rounded-full mt-1 uppercase`}>
                                {plan.trial}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>


                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <RiCheckLine className={`text-lg text-${plan.color}`} />
                            <span className="text-xs font-bold opacity-70">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === plan.id ? `bg-${plan.color} border-${plan.color}` : "border-base-300"
                        }`}>
                        {selectedPlan === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-white animate-scale"></div>}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Right: Registration Form */}
              <div className="w-full lg:w-[450px] shrink-0">
                <div className="card bg-base-100 shadow-2xl border border-base-200 sticky top-12 rounded-3xl overflow-hidden">
                  <div className="h-2 bg-primary w-full"></div>
                  <div className="card-body p-8 sm:p-10">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold mb-1">Create Account</h2>
                      <div className="inline-flex items-center gap-1.5 text-success font-bold text-[10px] uppercase tracking-widest">
                        <RiShieldCheckLine className="text-base" /> No Credit Card Required
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="alert alert-error text-xs py-3 rounded-xl">
                          <span>{error}</span>
                        </div>
                      )}

                      <div className="form-control">
                        <label htmlFor="reg-name" className="label py-1">
                          <span className="label-text font-bold text-xs opacity-50 uppercase tracking-widest">Full Name</span>
                        </label>
                        <input
                          id="reg-name"
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          className="input input-bordered focus:input-primary transition-all w-full bg-base-200/50 border-base-300 font-medium h-12"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-bold text-xs opacity-50 uppercase tracking-widest">Email Address</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          className="input input-bordered focus:input-primary transition-all w-full bg-base-200/50 border-base-300 font-medium h-12"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          autoComplete="new-email"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-bold text-xs opacity-50 uppercase tracking-widest">Password</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="••••••••"
                          className="input input-bordered focus:input-primary transition-all w-full bg-base-200/50 border-base-300 font-medium h-12"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          autoComplete="new-password"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label py-1">
                          <span className="label-text font-bold text-xs opacity-50 uppercase tracking-widest">Confirm Password</span>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="••••••••"
                          className="input input-bordered focus:input-primary transition-all w-full bg-base-200/50 border-base-300 font-medium h-12"
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
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showTerms && (
            <dialog id="terms_modal" className="modal modal-open" open>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="modal-box w-11/12 max-w-4xl max-h-[85vh] p-0 overflow-hidden rounded-3xl border border-base-200 shadow-2xl bg-base-100"
              >
                <div className="h-2 bg-primary w-full"></div>
                <div className="p-8 sm:p-12 overflow-y-auto max-h-[calc(85vh-8px)]">
                  <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                      <RiFileTextFill className="text-3xl text-primary" />
                    </div>
                    <h3 className="font-black text-3xl sm:text-4xl text-center">
                      Terms & Privacy
                    </h3>
                    <p className="text-xs opacity-40 font-bold uppercase tracking-widest mt-2">Legal Information Centre</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="bg-base-200/50 p-6 rounded-2xl border border-base-300/50 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <RiFileListLine className="text-xl" />
                        </div>
                        <h4 className="font-black text-sm uppercase">1. Acceptance</h4>
                      </div>
                      <p className="text-xs text-base-content/70 font-medium leading-relaxed">
                        By registering, you agree to comply with <strong>{CONFIG.SITE_NAME}&apos;s</strong> Terms of Service. You are responsible for maintaining your account security.
                      </p>
                    </div>

                    <div className="bg-base-200/50 p-6 rounded-2xl border border-base-300/50 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <RiUserLine className="text-xl" />
                        </div>
                        <h4 className="font-black text-sm uppercase">2. Use of Service</h4>
                      </div>
                      <p className="text-xs text-base-content/70 font-medium leading-relaxed">
                        You retain ownership of your content but grant us a license to host and display it. No illegal or unauthorized use of our platform is permitted.
                      </p>
                    </div>

                    <div className="bg-base-200/50 p-6 rounded-2xl border border-base-300/50 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <RiMoneyDollarCircleLine className="text-xl" />
                        </div>
                        <h4 className="font-black text-sm uppercase">3. Billing</h4>
                      </div>
                      <p className="text-xs text-base-content/70 font-medium leading-relaxed">
                        Paid subscriptions are billed in advance. You can cancel anytime through your dashboard settings. No refunds for partial months.
                      </p>
                    </div>

                    <div className="bg-base-200/50 p-6 rounded-2xl border border-base-300/50 hover:border-primary/30 transition-all group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <RiShieldCheckLine className="text-xl" />
                        </div>
                        <h4 className="font-black text-sm uppercase">4. Privacy</h4>
                      </div>
                      <p className="text-xs text-base-content/70 font-medium leading-relaxed">
                        We prioritize your data security. We do <strong>not</strong> sell your personal information. We use minimal tracking for service optimization.
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center mb-10">
                    <p className="text-sm font-medium mb-4">
                      This is a simplified summary of our legal policies.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                      <Link href="/terms-and-conditions" target="_blank" className="link link-primary font-bold">Full Terms of Service</Link>
                      <span className="opacity-20">•</span>
                      <Link href="/privacy-policy" target="_blank" className="link link-primary font-bold">Full Privacy Policy</Link>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="btn btn-primary flex-1 shadow-lg shadow-primary/20 font-bold h-14 rounded-2xl gap-2"
                      onClick={() => {
                        setAgreed(true);
                        setShowTerms(false);
                      }}
                    >
                      <RiCheckLine className="text-xl" />
                      I Agree & Accept
                    </button>
                    <button
                      className="btn btn-neutral btn-outline flex-1 h-14 rounded-2xl font-bold"
                      onClick={() => setShowTerms(false)}
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </motion.div>
              <form method="dialog" className="modal-backdrop bg-base-900/60 backdrop-blur-sm">
                <button onClick={() => setShowTerms(false)}>close</button>
              </form>
            </dialog>
          )}
        </AnimatePresence>
      </div>
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
