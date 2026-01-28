import VerifyForm from "@/components/auth/VerifyForm";
import { CONFIG } from "@/constants/config";
import { Suspense } from "react";

export const metadata = {
  title: `Verify Email | ${CONFIG.SITE_NAME}`,
  description: `Complete your ${CONFIG.SITE_NAME} registration by verifying your email address. Just one more step to start building your bio link profile.`,
  alternates: {
    canonical: `${CONFIG.SITE_URL}/verify`,
  },
};

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen bg-base-200">
          <div className="card w-full max-w-sm bg-base-100 shadow-xl p-8 items-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      }
    >
      <VerifyForm />
    </Suspense>
  );
}
