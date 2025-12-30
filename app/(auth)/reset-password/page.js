import ResetClient from "./ResetClient";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Reset Password | ${CONFIG.SITE_NAME}`,
    description: "Reset your password securely.",
};

export default function ResetPasswordPage() {
    return <ResetClient />;
}
