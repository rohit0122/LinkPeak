"use client";

import { useState, useEffect } from "react";
import { CONFIG } from "@/constants/config";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("lpkSiteCookieConsent");
        if (!consent) {
            // Delay slightly to prevent hydration issues and allow animation
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAction = (action) => {
        // Store user preference
        localStorage.setItem("lpkSiteCookieConsent", action);

        // Hide banner
        setIsVisible(false);

        // You could add logic here to initialize/block tracking scripts based on 'action'
        // action values: 'all', 'essential', 'declined'
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-7xl mx-auto bg-base-100/95 backdrop-blur-md border border-base-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-6 md:p-8 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-12">

                {/* Text Content */}
                <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        🍪 Cookie Settings
                    </h3>
                    <p className="text-sm opacity-80 leading-relaxed max-w-4xl">
                        We use cookies to improve your experience on our website, show ads and content that match your interests, and understand how people use our site to make it better.
                        By clicking <span className="font-semibold">“Accept All”</span> you agree {CONFIG.SITE_NAME} can store cookies on your device and process data in accordance with our Cookie Policy and Privacy Policy.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                    <button
                        onClick={() => handleAction('essential')}
                        className="btn btn-primary btn-outline btn-sm font-medium"
                    >
                        Essential Only
                    </button>
                    <button
                        onClick={() => handleAction('declined')}
                        className="btn btn-outline btn-sm font-medium"
                    >
                        Decline
                    </button>
                    <button
                        onClick={() => handleAction('all')}
                        className="btn btn-primary btn-sm px-6 font-medium"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
