"use client";

import Link from "next/link";
import { RiErrorWarningLine, RiCustomerService2Line } from "react-icons/ri";
import SubscriptionStatusDiv from "@/components/dashboard/SubscriptionStatusDiv";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SuspendedPage() {
    const { isAuthenticated } = useAuthStore();
    // We fetch isAuthenticated client-side here or just rely on SubscriptionStatus to fetch its own data
    // For simplicity, we just render the structure

    return (
        <div className="min-h-screen max-w-5xl mx-auto flex items-center justify-center p-4">
            <div className="card w-full bg-base-100 shadow-xl border-t-8 border-error">
                <div className="card-body items-center text-center">
                    <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4 text-error">
                        <RiErrorWarningLine className="text-4xl" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Access Suspended</h1>
                    <p className="text-base-content/70 mb-6">
                        Your free trial has expired and we haven&apos;t received a subscription payment.
                        To continue using your bio page and dashboard, {isAuthenticated ? "please select a plan below." : "connect support with your account details."}
                    </p>

                    <div className="w-full mb-6">
                        {/* We use SubscriptionStatus but disable redirect to prevent loop */}
                        <SubscriptionStatusDiv redirectOnExpire={false} />
                    </div>

                    <div className="divider">Need Help?</div>

                    <Link href="/contact-us" className="btn btn-neutral btn-outline gap-2">
                        <RiCustomerService2Line className="text-lg" />
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
