import LoginClient from "./LoginClient";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Login | ${CONFIG.SITE_NAME}`,
    description: "Log in to your dashboard.",
};

export default function LoginPage() {
    return <LoginClient />;
}
