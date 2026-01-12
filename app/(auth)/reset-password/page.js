"use client";

import { useState, useEffect, Suspense, use } from "react";
import axios from "@/lib/httpClient";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CONFIG } from "@/constants/config";
import { RiCheckLine, RiErrorWarningLine } from "react-icons/ri";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const lpkSiteToken = searchParams.get("lpkSiteToken");

  useEffect(() => {
    if (!lpkSiteToken) {
      setTokenValid(false);
      setError("Invalid or missing reset lpkSiteToken");
    }
  }, [lpkSiteToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/auth/reset-password", {
        lpkSiteToken,
        password,
      });

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200 px-4 py-12">
        <div className="card w-full max-w-sm bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
                <RiErrorWarningLine className="text-3xl text-error" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Invalid Reset Link</h2>
            <p className="text-sm opacity-60 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link href="/forgot-password" className="btn btn-primary">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="card w-full max-w-sm bg-base-200">
        <div className="h-2 bg-primary w-full"></div>
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold justify-center mb-2">
            Set New Password
          </h2>
          <p className="text-center text-sm opacity-60 mb-4">
            Enter your new password below
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
                  <RiCheckLine className="text-3xl text-success" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-sm opacity-60 mb-4">
                Your password has been updated successfully.
              </p>
              <p className="text-xs opacity-40">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  placeholder="min 6 characters"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <input
                  type="password"
                  placeholder="repeat password"
                  className="input input-bordered"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control mt-6">
                <button className="btn btn-primary w-full" disabled={loading}>
                  {loading && <span className="loading loading-spinner"></span>}
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage(props) {
  const searchParams = use(props.searchParams);
  const params = use(props.params);
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-base-200">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
