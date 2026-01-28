import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Forgot Password | ${CONFIG.SITE_NAME}`,
    description: `Recover your ${CONFIG.SITE_NAME} account. Enter your email address and we'll send you a link to reset your password.`,
    alternates: {
        canonical: `${CONFIG.SITE_URL}/forgot-password`,
    },
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
