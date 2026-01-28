import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { CONFIG } from "@/constants/config";
import { Suspense } from "react";

export const metadata = {
  title: `Reset Password | ${CONFIG.SITE_NAME}`,
  description: `Set a new password for your ${CONFIG.SITE_NAME} account. Choose a strong and secure password to keep your profile safe.`,
  alternates: {
    canonical: `${CONFIG.SITE_URL}/reset-password`,
  },
};

export default function ResetPasswordPage() {
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
