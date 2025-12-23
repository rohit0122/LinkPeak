"use client";
import { useState, useEffect } from "react";
import { FiClock, FiZap, FiAlertTriangle } from "react-icons/fi";
import Link from "next/link";
import { CONFIG } from "@/constants/config";
import { calculateTimeLeft } from "@/lib/utils";

export default function SmartPlanAlert({ expiryDate, type = "trial" }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiryDate));

    useEffect(() => {
        const timer = setInterval(() => {
            const updatedTime = calculateTimeLeft(expiryDate);
            setTimeLeft(updatedTime);

            if (updatedTime.totalSeconds <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    // Calculate days for logic (using totalSeconds to be precise)
    const daysRemaining = Math.ceil(timeLeft.totalSeconds / (24 * 3600));

    if (timeLeft.totalSeconds <= 0) return null;

    const isTrial = type === "trial";

    // --- GUARD CLAUSE ---
    // 604800 seconds = 7 days. 
    // If it's a subscription and more than 7 days left, show nothing.
    if (isTrial === false && timeLeft.totalSeconds > 604800) {
        return null;
    }
    // --- Dynamic Styling Logic ---
    let btnClass = "btn-info";
    let alertClass = "alert-info";
    let Icon = FiClock;

    if (timeLeft.totalSeconds <= 86400) { // Less than 24 hours remaining
        // Using your specific Green-700 request for the high-urgency state
        btnClass = "bg-green-700 hover:bg-green-800 border-none text-white";
        alertClass = "alert-warning";
        Icon = FiAlertTriangle;
    } else if (daysRemaining <= 3) {
        btnClass = "btn-primary";
        alertClass = "alert-info";
    } else if (daysRemaining <= 7) {
        btnClass = "btn-secondary";
        alertClass = "alert-info bg-opacity-5";
    }

    return (
        <div className={`alert shadow-sm border-2 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 ${alertClass} border-opacity-20 bg-opacity-10 transition-all`}>

            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full shrink-0 bg-base-100 shadow-inner`}>
                    <Icon className={`w-5 h-5 ${timeLeft.totalSeconds <= 86400 ? 'animate-bounce text-warning' : 'text-info'}`} />
                </div>

                <div className="text-center md:text-left">
                    <h3 className="font-bold text-sm md:text-base tracking-tight flex items-center flex-wrap justify-center md:justify-start gap-1">
                        {isTrial
                            ? CONFIG.TRIAL_MESSAGES.TITLE(timeLeft.hours)
                            : CONFIG.SUBSCRIPTION_MESSAGES.TITLE(daysRemaining)
                        }

                        {/* Always show the H:M:S counter if it's the last 24 hours */}
                        {timeLeft.totalSeconds <= 86400 && (
                            <span className="font-mono bg-base-100 px-2 py-0.5 rounded border border-base-300 ml-1 text-xs md:text-sm tabular-nums shadow-sm">
                                {String(timeLeft.hours).padStart(2, '0')}h:{String(timeLeft.minutes).padStart(2, '0')}m:{String(timeLeft.seconds).padStart(2, '0')}s
                            </span>
                        )}
                    </h3>
                    <p className="text-xs opacity-70 mt-0.5">
                        {isTrial ? CONFIG.TRIAL_MESSAGES.SUBTEXT : CONFIG.SUBSCRIPTION_MESSAGES.SUBTEXT}
                    </p>
                </div>
            </div>

            <div className="w-full md:w-auto flex justify-center md:justify-end">
                <Link
                    href="/dashboard/billing"
                    className={`btn btn-sm w-full md:w-auto shadow-md gap-2 ${btnClass}`}
                >
                    <FiZap className="fill-current w-4 h-4" />
                    {isTrial ? CONFIG.TRIAL_MESSAGES.CTA : CONFIG.SUBSCRIPTION_MESSAGES.CTA}
                </Link>
            </div>
        </div>
    );
}