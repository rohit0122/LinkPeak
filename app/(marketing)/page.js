import dynamic from "next/dynamic";
import { CONFIG } from "@/constants/config";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import LiveDemo from "@/components/marketing/LiveDemo";

export const metadata = {
    title: `${CONFIG.SITE_NAME} | AI-Powered Link in Bio Platform for Creators`,
    description: `Create a professional, high-performance link in bio page in seconds. Use AI to optimize your SEO, track clicks in real-time, and grow your audience on TikTok, Instagram, and YouTube.`,
    alternates: {
        canonical: CONFIG.SITE_URL,
    },
};

const Pricing = dynamic(() => import("@/components/marketing/Pricing"));
const FAQ = dynamic(() => import("@/components/marketing/FAQ"));
const SpotLightBanner = dynamic(() => import("@/components/marketing/SpotLightBanner"));

export default function MarketingPage() {
    return (
        <>
            <Hero />
            <Features />
            <LiveDemo />
            <Pricing />
            <FAQ />
            <SpotLightBanner />
        </>
    );
}
