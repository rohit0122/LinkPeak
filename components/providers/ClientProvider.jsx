"use client";

import { LoaderProvider, useLoader } from "@/context/LoaderContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import CookieConsent from "@/components/shared/CookieConsent";
import GlobalLoading from "@/components/shared/GlobalLoading";

function FullScreenLoaderWrapper() {
    const { loading } = useLoader();
    return <GlobalLoading show={loading} />;
}

export default function ClientProvider({ children }) {
    return (
        <LoaderProvider>
            <AuthProvider>
                {children}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: "white",
                            color: "#1f2937",
                            padding: "0.75rem 1.25rem",
                            borderRadius: "0.75rem",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                            fontWeight: 500,
                        },
                    }}
                />
            </AuthProvider>
            <FullScreenLoaderWrapper />
            <CookieConsent />
        </LoaderProvider>
    );
}
