import ContactClient from "./ContactClient";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Contact Us | ${CONFIG.SITE_NAME}`,
    description: "Have questions? Get in touch with our support team.",
};

export default function ContactUsPage() {
    return <ContactClient />;
}
