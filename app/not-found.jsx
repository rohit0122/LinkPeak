"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiHomeLine, RiSearchLine, RiLinkM } from "react-icons/ri";
import { CONFIG } from "@/constants/config";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>

            <div className="max-w-2xl w-full relative z-10">
                <div className="card bg-base-100 shadow-2xl">
                    <div className="card-body items-center text-center p-8 md:p-12">
                        {/* 404 Icon */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                            <div className="relative w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                                <RiLinkM className="text-6xl text-primary animate-pulse" />
                            </div>
                        </div>

                        {/* 404 Text */}
                        <div className="mb-6">
                            <h1 className="text-8xl md:text-9xl font-bold text-primary/20 tracking-tighter leading-none mb-2">
                                404
                            </h1>
                            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
                                Page Not Found
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="max-w-md mb-8 space-y-3">
                            <p className="text-lg text-base-content/70">
                                Oops! This link seems to be broken or doesn&apos;t exist yet.
                            </p>
                            <div className="divider my-4">OR</div>
                            <p className="text-base text-base-content/60">
                                You may have accidentally landed on the wrong page. This URL might be a placeholder we haven&apos;t created yet.
                            </p>
                        </div>

                        {/* Suggestions */}
                        <div className="alert alert-info mb-8 text-left">
                            <RiSearchLine className="text-2xl flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-bold mb-1">Looking for a bio page?</p>
                                <p className="opacity-80">Make sure you have the correct username or slug in the URL.</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => router.back()}
                                className="btn btn-outline btn-primary gap-2"
                            >
                                <RiArrowLeftLine className="text-xl" />
                                Go Back
                            </button>
                            <Link
                                href="/"
                                className="btn btn-primary gap-2"
                            >
                                <RiHomeLine className="text-xl" />
                                Back to Home
                            </Link>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-8 pt-6 border-t border-base-300 w-full">
                            <p className="text-xs text-base-content/40">
                                Need help? Visit our{" "}
                                <Link href="/" className="link link-primary font-semibold">
                                    homepage
                                </Link>{" "}
                                or create your own bio page with {CONFIG.SITE_NAME}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="hidden md:block absolute -left-20 top-20 opacity-20">
                    <div className="w-16 h-16 rounded-full bg-primary animate-bounce" style={{ animationDuration: '3s' }}></div>
                </div>
                <div className="hidden md:block absolute -right-16 bottom-20 opacity-20">
                    <div className="w-12 h-12 rounded-full bg-secondary animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                </div>
            </div>
        </div>
    );
}
