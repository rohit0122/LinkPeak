"use client";

import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { Suspense } from 'react';

function SignUpContent() {
    const searchParams = useSearchParams();
    const role = searchParams.get("role") || "FREE_USER";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] container mx-auto bg-base-100 shadow-2xl rounded-3xl overflow-hidden my-10 border border-base-300">
            {/* Left: Sign Up Form */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-base-100">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-black mb-2 text-primary">Join LinkPeak</h2>
                    <p className="text-base-content/60 mb-8 font-medium">Create your AI-optimized bio link in seconds.</p>

                    <div className="alert alert-info py-3 text-sm mb-8 flex justify-center border-none bg-primary/10 text-primary font-bold">
                        <span>🚀 Joining as: <strong className="uppercase">{role.replace('_', ' ')}</strong></span>
                    </div>

                    <div className="flex justify-center w-full">
                        <SignUp
                            forceRedirectUrl="/dashboard"
                            fallbackRedirectUrl="/dashboard"
                            unsafeMetadata={{ role: role }}
                        />
                    </div>
                </div>
            </div>

            {/* Right: Marketing Visual */}
            <div className="hidden lg:flex relative bg-neutral overflow-hidden group">
                <img
                    src="/auth-visual.png"
                    alt="LinkPeak Dashboard"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-secondary/40 mix-blend-multiply"></div>
                <div className="relative z-10 flex flex-col justify-center p-16 text-neutral-content bg-black/20 backdrop-blur-sm w-full h-full">
                    <h3 className="text-4xl font-black mb-6 leading-tight">Empower Your Digital Presence with AI.</h3>
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                            <div className="p-2 bg-primary rounded-lg text-primary-content mt-1">✨</div>
                            <div>
                                <h4 className="font-bold text-xl uppercase tracking-wider">AI Optimization</h4>
                                <p className="opacity-80">Let GPT-4o optimize your link titles for max CTR.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="p-2 bg-secondary rounded-lg text-secondary-content mt-1">📊</div>
                            <div>
                                <h4 className="font-bold text-xl uppercase tracking-wider">Deep Analytics</h4>
                                <p className="opacity-80">Track every interaction with professional insights.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="p-2 bg-accent rounded-lg text-accent-content mt-1">🎨</div>
                            <div>
                                <h4 className="font-bold text-xl uppercase tracking-wider">Custom Branding</h4>
                                <p className="opacity-80">Beautiful glassmorphism themes that match your style.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="py-20 flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>}>
            <SignUpContent />
        </Suspense>
    );
}
