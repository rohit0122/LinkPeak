import Link from "next/link";
import { HiSparkles, HiCheckCircle, HiChartBar, HiSwatch, HiUserGroup, HiQrCode } from "react-icons/hi2";
import PricingCards from "@/components/pricing/PricingCards";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
    return (
        <div className="font-sans">
            {/* Hero Section */}
            <div className="hero min-h-[70vh] bg-base-200/50">
                <div className="hero-content text-center">
                    <div className="max-w-3xl">
                        <div className="badge badge-primary badge-outline mb-6 font-semibold py-3 px-4">New: AI Title Generator ✨</div>
                        <h1 className="text-6xl font-black mb-8 leading-tight">
                            Optimize Your Bio Link <br />with <span className="text-primary italic underline decoration-wavy underline-offset-8">AI Intelligence</span>
                        </h1>
                        <p className="py-6 text-xl opacity-70 mb-8 max-w-2xl mx-auto leading-relaxed">
                            The only link-in-bio tool with Role-Based Access, AI Optimization, and deep analytics. Built for creators who mean business.
                        </p>
                        <div className="flex gap-4 justify-center items-center">
                            <SignedOut>
                                <Link href="/pricing" className="btn btn-primary btn-lg shadow-xl shadow-primary/30 px-8">
                                    <HiSparkles /> View Plans
                                </Link>
                                <Link href="/sign-up" className="btn btn-outline btn-lg px-8">Sign Up Free</Link>
                            </SignedOut>
                            <SignedIn>
                                <Link href="/dashboard/links" className="btn btn-primary btn-lg shadow-xl shadow-primary/30 px-10 font-bold">
                                    Manage My Links
                                </Link>
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Preview */}
            <div className="py-20 container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold">Why LinkPeak?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="text-4xl mb-4 text-primary"><HiSparkles /></div>
                            <h3 className="card-title">AI Optimization</h3>
                            <p>Let GPT-4o rewrite your titles for higher CTR.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="text-4xl mb-4 text-secondary"><HiCheckCircle /></div>
                            <h3 className="card-title">Role-Based Access</h3>
                            <p>Granular permissions for Teams, Pro, and Free users.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="text-4xl mb-4 text-accent"><HiChartBar /></div>
                            <h3 className="card-title">Deep Analytics</h3>
                            <p>Track clicks, views, and CTR with privacy-first insights.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="text-4xl mb-4 text-info"><HiSwatch /></div>
                            <h3 className="card-title">Custom Branding</h3>
                            <p>Match your brand with custom colors, fonts, and themes.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="text-4xl mb-4 text-warning"><HiUserGroup /></div>
                            <h3 className="card-title">Team Collaboration</h3>
                            <p>Invite team members to manage links with granular permissions.</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 shadow-sm border border-base-300">
                        <div className="card-body items-center text-center">
                            <div className="text-4xl mb-4 text-error"><HiQrCode /></div>
                            <h3 className="card-title">Smart QR Codes</h3>
                            <p>Generate customizable QR codes for your offline marketing.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section Embedded */}
            <div className="py-20 bg-base-200" id="pricing">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold">Choose Your Peak</h2>
                </div>
                <div className="container mx-auto px-4 max-w-6xl">
                    <PricingCards />
                </div>
            </div>
        </div>
    );
}
