"use client";
import "@/lib/axiosClientInterceptors";
import { useLoaderStore } from "@/stores/loaderStore";
import { RiCheckboxCircleFill, RiErrorWarningFill, RiInformationFill, RiLoader4Line } from "react-icons/ri";
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
                reverseOrder={false}
                gutter={16}
                containerClassName="mt-6"
                toastOptions={{
                    duration: 4000,
                    className: "!rounded-none !bg-base-100/95 !backdrop-blur-3xl !backdrop-saturate-200 !border !border-base-content/10 !px-5 !py-4 !font-semibold !tracking-tight !text-base-content !shadow-2xl transition-all",
                    success: {
                        className: "!rounded-none !bg-linear-to-b !from-success/10 !to-base-100/95 !backdrop-blur-3xl !border-t-4 !border-t-success !px-5 !py-4 !font-semibold !shadow-xl !shadow-success/20",
                        icon: <RiCheckboxCircleFill className="text-success" size={24} />,
                    },
                    error: {
                        className: "!rounded-none !bg-linear-to-b !from-error/10 !to-base-100/95 !backdrop-blur-3xl !border-t-4 !border-t-error !px-5 !py-4 !font-semibold !shadow-xl !shadow-error/20",
                        icon: <RiErrorWarningFill className="text-error" size={24} />,
                    },
                    loading: {
                        className: "!rounded-none !bg-base-100/95 !backdrop-blur-3xl !border !border-base-content/10 !px-5 !py-4 !font-semibold",
                        icon: <RiLoader4Line className="text-primary animate-spin" size={24} />,
                    },
                    blank: {
                        className: "!rounded-none !bg-linear-to-b !from-info/10 !to-base-100/95 !backdrop-blur-3xl !border-t-4 !border-t-info !px-5 !py-4 !font-semibold !shadow-xl !shadow-info/20",
                    }
                }}
            />
            <CookieConsent />
            <GlobalLoading show={loading} />
        </>
    );
}
