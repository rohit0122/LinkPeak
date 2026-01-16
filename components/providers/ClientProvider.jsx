"use client";
import "@/lib/axiosClientInterceptors";
import { useLoaderStore } from "@/stores/loaderStore";
import { Toaster } from "react-hot-toast";
import CookieConsent from "@/components/shared/CookieConsent";
import GlobalLoading from "@/components/shared/GlobalLoading";

export default function ClientProvider({ children }) {
    const { loading } = useLoaderStore();
    return (
        <>
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
            <CookieConsent />
            <GlobalLoading show={loading} />
        </>
    );
}
