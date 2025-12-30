"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LoadingContext = createContext(undefined);

export function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(false);

    // Expose setLoading to window for non-React code (like axios interceptor)
    // This is a bridge for legacy code that can't use hooks
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.setGlobalLoading = setLoading;
        }
        return () => {
            if (typeof window !== 'undefined') {
                delete window.setGlobalLoading;
            }
        };
    }, []);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}
