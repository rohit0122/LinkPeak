import { Suspense } from "react";
import SuccessClient from "@/components/dashboard/SuccessClient";

export default function SuccessPage() {
    return (
        <Suspense fallback={<LoadingState />}>
            <SuccessClient />
        </Suspense>
    );
}

function LoadingState() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary" />
        </div>
    );
}
