import RegisterClient from "./RegisterClient";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Register | ${CONFIG.SITE_NAME}`,
    description: "Create your free account today.",
};

export default function RegisterPage() {
    return <RegisterClient />;
}
