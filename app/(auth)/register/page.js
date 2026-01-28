import RegisterForm from "@/components/auth/RegisterForm";
import { CONFIG } from "@/constants/config";
import { Suspense } from "react";

export const metadata = {
  title: `Register | ${CONFIG.SITE_NAME}`,
  description: `Join ${CONFIG.SITE_NAME} today and create your powerful AI-driven bio link page in seconds. Free and premium plans available.`,
  alternates: {
    canonical: `${CONFIG.SITE_URL}/register`,
  },
};

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
