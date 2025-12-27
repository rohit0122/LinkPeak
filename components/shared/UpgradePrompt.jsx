import Link from "next/link";

export default function UpgradePrompt({ feature, currentPlan = "FREE" }) {
    const prompts = {
        analytics: {
            title: "Unlock 90-Day Analytics",
            description: "See which links perform best over time and optimize your content strategy.",
            benefits: [
                "📊 Track trends over 90 days",
                "📈 Identify top-performing links",
                "🎯 Optimize for better engagement"
            ],
            requiredPlan: "PRO",
            price: "$9/mo"
        },
        unlimited_links: {
            title: "Unlimited Links",
            description: "Add as many links as you want without restrictions.",
            benefits: [
                "🔗 Unlimited link creation",
                "🎨 Custom link styling",
                "📱 Mobile-optimized display"
            ],
            requiredPlan: "PRO",
            price: "$9/mo"
        },
        multiple_pages: {
            title: "Multiple Bio Pages",
            description: "Create separate bio pages for different audiences or brands.",
            benefits: [
                "📄 Up to 5 bio pages",
                "🎭 Different themes per page",
                "🔄 Easy page switching"
            ],
            requiredPlan: "AGENCY",
            price: "$49/mo"
        },
        qr_code: {
            title: "Custom QR Codes",
            description: "Generate branded QR codes for your bio pages and links.",
            benefits: [
                "📱 Downloadable QR codes",
                "🎨 Custom colors & logos",
                "📊 Track QR scans"
            ],
            requiredPlan: "PRO",
            price: "$9/mo"
        }
    };

    const prompt = prompts[feature] || prompts.analytics;

    return (
        <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
            <div className="card-body">
                <div className="flex items-start gap-3">
                    <div className="text-4xl">🔒</div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{prompt.title}</h3>
                        <p className="text-sm opacity-80 mb-4">{prompt.description}</p>

                        <ul className="space-y-2 mb-4">
                            {prompt.benefits.map((benefit, i) => (
                                <li key={i} className="text-sm flex items-center gap-2">
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-3">
                            <Link href="/#pricing" className="btn btn-primary btn-sm">
                                Upgrade to {prompt.requiredPlan} - {prompt.price}
                            </Link>
                            <span className="text-xs opacity-60">Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
