"use client";

import { useState } from "react";
import Link from "next/link";
import { CONFIG } from "@/constants/config";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLoaderStore } from "@/stores/loaderStore";
import { useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

function LogoutToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("logged_out") === "true") {
      toast.success("Logged out successfully.", { id: "logout-toast" });
      router.replace("/login");
    }
  }, [searchParams, router]);

  return null;
}

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const hideLoader = useLoaderStore((state) => state.hideLoader);

  useEffect(() => {
    hideLoader();
  }, [hideLoader]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate input with Zod
    const { loginSchema, validateData } = await import("@/lib/validations");
    const validation = validateData(loginSchema, { email, password });

    if (!validation.success) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      toast.error(firstError);
      setLoading(false);
      return;
    }

    try {
      // Use AuthContext's login function
      const result = await login(
        validation.data.email,
        validation.data.password,
        router
      );

      if (!result?.success) {
        const errorMsg = result?.message || "Invalid credentials";
        setError(errorMsg);

        // Override default toast for suspension with custom one
        if (
          errorMsg.includes("Account suspended") ||
          errorMsg.includes("suspended")
        ) {
          // Dismiss the default toast from AuthContext
          toast.dismiss();
          // Show custom toast with contact support link
          toast.error(
            (t) => (
              <div>
                Account suspended.{" "}
                <Link href="/contact-us" className="underline font-bold">
                  Contact Support
                </Link>
              </div>
            ),
            { duration: 6000 }
          );
        }
      }
    } catch (err) {
      const errorMsg = err.message || "An unexpected error occurred";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-base-200/20">
      <Suspense fallback={null}>
        <LogoutToast />
      </Suspense>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-sm bg-base-100 shadow-2xl border border-base-200 overflow-hidden rounded-3xl"
      >
        <div className="h-2 bg-primary w-full"></div>
        <div className="card-body p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-1">
              Welcome Back
            </h2>
            <p className="text-sm opacity-50 font-medium">
              Login to your {CONFIG.SITE_NAME} account
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-error text-xs py-3 rounded-xl mb-6"
                role="alert"
              >
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label htmlFor="login-email" className="label py-1">
                <span className="label-text font-bold text-xs opacity-50 uppercase tracking-widest">Email Address</span>
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all font-medium border-base-300 focus:border-primary h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-control">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="login-password" className="label py-1">
                  <span className="label-text font-bold text-xs opacity-50 uppercase tracking-widest">Password</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs link link-hover opacity-40 hover:opacity-100 hover:text-primary font-bold"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-all font-medium border-base-300 focus:border-primary h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-control mt-8">
              <button
                className="btn btn-primary w-full shadow-lg shadow-primary/20 font-bold h-12"
                disabled={loading}
                aria-live="polite"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <div className="divider opacity-50 my-4 uppercase text-[10px] font-bold tracking-tight">OR</div>

          <p className="text-center text-xs font-medium opacity-80">
            New to {CONFIG.SITE_NAME}?{" "}
            <Link
              href="/register"
              className="link link-primary font-bold"
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
