"use client";

import Link from "next/link";
import { RiErrorWarningLine, RiCustomerService2Line } from "react-icons/ri";
import SubscriptionStatus from "@/components/dashboard/SubscriptionStatus";
import SubscriptionStatusDiv from "@/components/dashboard/SubscriptionStatusDiv";

export default function SuspendedPage() {
    // We fetch user client-side here or just rely on SubscriptionStatus to fetch its own data
    // For simplicity, we just render the structure

    return (
        <div className="min-h-screen max-w-5xl mx-auto bg-base-200 flex items-center justify-center p-4">
            <div className="card w-full bg-base-100 shadow-xl border-t-8 border-error">
                <div className="card-body items-center text-center">
                    <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4 text-error">
                        <RiErrorWarningLine className="text-4xl" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Access Suspended</h1>
                    <p className="text-base-content/70 mb-6">
                        Your free trial has expired and we haven't received a subscription payment.
                        To continue using your bio page and dashboard, please select a plan below.
                    </p>

                    <div className="w-full mb-6">
                        {/* We use SubscriptionStatus but disable redirect to prevent loop */}
                        <SubscriptionStatusDiv redirectOnExpire={false} />
                        <SubscriptionStatus redirectOnExpire={false} />
                    </div>

                    <div className="divider">Need Help?</div>

                    <Link href="/contact-us" className="btn btn-ghost gap-2">
                        <RiCustomerService2Line className="text-lg" />
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
