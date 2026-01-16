"use client";

import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import LiveDemo from "@/components/marketing/LiveDemo";
import Pricing from "@/components/marketing/Pricing";
import FAQ from "@/components/marketing/FAQ";
import { SpotLightBanner } from "@/components/marketing/SpotLightBanner";

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
