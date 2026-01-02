"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    RiCheckLine,
    RiRocketLine,
    RiSparklingLine,
    RiShieldStarLine,
} from "react-icons/ri";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import { ENDPOINTS } from "@/constants/endpoints";

export default function SuccessClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "PRO";
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const finalizeUpgrade = async () => {
            try {
                await new Promise((r) => setTimeout(r, 3000));

                await axios.patch(ENDPOINTS.ADMIN.USERS, {
                    userId: "ME",
                    updates: { plan: plan.toUpperCase() },
                });

                toast.success(`Success! You've been upgraded to ${plan}`, {
                    duration: 5000,
                    icon: "🔥",
                });
            } catch (error) {
                console.error("Finalization failed:", error);
            } finally {
                setLoading(false);
            }
        };

        finalizeUpgrade();
    }, [plan]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="relative flex justify-center">
                    <div className="w-32 h-32 bg-primary flex items-center justify-center text-primary-content shadow-2xl shadow-primary/40">
                        {loading ? (
                            <RiRocketLine className="text-6xl animate-bounce" />
                        ) : (
                            <RiCheckLine className="text-6xl animate-in zoom-in duration-500" />
                        )}
                    </div>

                    {!loading && (
                        <>
                            <RiSparklingLine className="absolute -top-4 -right-4 text-4xl text-warning animate-pulse" />
                            <RiShieldStarLine className="absolute -bottom-4 -left-4 text-4xl text-primary animate-pulse" />
                        </>
                    )}
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-medium tracking-tighter uppercase">
                        {loading ? "Processing..." : "You're Elite!"}
                    </h1>
                    <p className="text-base-content/40 font-medium">
                        {loading
                            ? "We're securing your new features..."
                            : `Welcome to the ${plan} Tier.`}
                    </p>
                </div>

                {!loading && (
                    <div className="flex flex-col gap-3 py-8">
                        <Link
                            href="/dashboard"
                            className="btn btn-primary btn-lg shadow-xl"
                        >
                            Take me to Dashboard
                        </Link>
                    </div>
                )}

                {loading && (
                    <div className="w-full h-1 bg-base-300 rounded-full overflow-hidden mt-8">
                        <div className="h-full bg-primary animate-progress origin-left" />
                    </div>
                )}
            </div>
        </div>
    );
}
