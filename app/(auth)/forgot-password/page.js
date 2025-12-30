import ForgotClient from "./ForgotClient";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Forgot Password | ${CONFIG.SITE_NAME}`,
    description: "Reset your password securely.",
};

export default function ForgotPasswordPage() {
    return <ForgotClient />;
}
