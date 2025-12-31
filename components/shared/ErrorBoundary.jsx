"use client";

import React from "react";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to monitoring service (Sentry, etc.)
        console.error("Error Boundary caught:", error, errorInfo);

        // You can add Sentry logging here:
        // Sentry.captureException(error, { extra: errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-base-200">
                    <div className="card bg-base-100 shadow-xl p-8 max-w-md">
                        <div className="text-center">
                            <div className="text-6xl mb-4">💥</div>
                            <h2 className="text-2xl font-bold text-error mb-2">
                                Oops! Something went wrong
                            </h2>
                            <p className="text-sm opacity-70 mb-6">
                                We've been notified and are working on a fix.
                            </p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btn btn-primary btn-sm"
                                >
                                    Reload Page
                                </button>
                                <button
                                    onClick={() => window.location.href = "/dashboard"}
                                    className="btn btn-neutral btn-outline btn-sm"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                            {process.env.NODE_ENV === "development" && this.state.error && (
                                <details className="mt-4 text-left">
                                    <summary className="cursor-pointer text-xs opacity-50">
                                        Error Details (Dev Only)
                                    </summary>
                                    <pre className="text-xs mt-2 p-2 bg-base-200 rounded overflow-auto">
                                        {this.state.error.toString()}
                                    </pre>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
