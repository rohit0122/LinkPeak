import PaymentCallbackClient from "@/components/payment/PaymentCallbackClient";
import { Suspense } from "react";

export default function PaymentCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            }
        >
            <PaymentCallbackClient />
        </Suspense>
    );
}
