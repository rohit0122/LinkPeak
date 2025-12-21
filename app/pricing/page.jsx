import PricingCards from "@/components/pricing/PricingCards";

export default function PricingPage() {
    return (
        <div className="py-20 px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl mb-12 max-w-2xl mx-auto opacity-80">
                Start for free, upgrade for power. All plans include 30-day money back guarantee.
            </p>

            <div className="max-w-6xl mx-auto">
                <PricingCards />
            </div>
        </div>
    );
}
