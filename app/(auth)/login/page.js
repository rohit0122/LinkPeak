"use client";

import { useState } from "react";
import Link from "next/link";
import { CONFIG } from "@/constants/config";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLoaderStore } from "@/stores/loaderStore";
import { useEffect, Suspense } from "react";

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
    <div className="flex justify-center items-center min-h-screen px-4">
      <Suspense fallback={null}>
        <LogoutToast />
      </Suspense>
      <div className="card w-full max-w-sm bg-base-200">
        <div className="h-2 bg-primary w-full"></div>
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
                <Link
                  href="/forgot-password"
                  title="reset password"
                  className="label-text-alt link link-hover"
                >
                  Forgot password?
                </Link>
              </label>
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary w-full" disabled={loading}>
                {loading && <span className="loading loading-spinner"></span>}
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              title="registeration"
              className="link link-primary font-semibold"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
