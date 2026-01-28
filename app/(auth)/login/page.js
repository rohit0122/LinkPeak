import LoginForm from "@/components/auth/LoginForm";
import { CONFIG } from "@/constants/config";

export const metadata = {
  title: `Login | ${CONFIG.SITE_NAME}`,
  description: `Access your ${CONFIG.SITE_NAME} dashboard to manage your bio links, view analytics, and customize your profile.`,
  alternates: {
    canonical: `${CONFIG.SITE_URL}/login`,
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
