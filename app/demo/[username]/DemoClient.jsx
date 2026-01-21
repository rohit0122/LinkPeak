"use client";

import { useSearchParams } from "next/navigation";
import { getDemoProfile } from "@/constants/demoProfile";
import DemoTemplate from "@/components/shared/DemoTemplate";

export default function DemoClient({ username }) {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme") || "light";

    const pageData = getDemoProfile(username, theme);

    if (!pageData) return null;

    return (
        <DemoTemplate
            demoData={pageData}
            className="w-screen h-[732px] max-w-sm"
            isPreviewDisable={true}
        />
    );
}
