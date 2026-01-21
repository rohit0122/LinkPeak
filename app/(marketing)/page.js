import dynamic from "next/dynamic";
import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import LiveDemo from "@/components/marketing/LiveDemo";

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
