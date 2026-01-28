import { cache } from "react";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import PublicBioTrial from "./PublicBioTrial";
import BioNotFound from "@/components/templates/BioNotFound";
import { CONFIG } from "@/constants/config";

// Revalidate every 60 seconds (ISR caching for performance)
export const revalidate = 60;

// Deduplicate API calls
const getBioPage = cache(async (slug) => {
    try {
        const { data } = await restClient.get(BACKEND_ENDPOINTS.PUBLIC.GET_PAGE(slug));
        return data?.success ? data.data.page : null;
    } catch (error) {
        return null;
    }
});

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = await getBioPage(slug);

    if (!page) return { title: "Page Not Found" };

    const ogImage = page.profile_image || `${CONFIG.SITE_URL}${CONFIG.DEFAULT_PROFILE_IMAGE}`;
    const siteIcon = `${CONFIG.SITE_URL}${CONFIG.DEFAULT_PROFILE_IMAGE}`;

    return {
        title: page.seo?.title || `${page.title} | ${CONFIG.SITE_NAME}`,
        description: page.seo?.description || page.bio || `Check out ${page.title}'s links on ${CONFIG.SITE_NAME}.`,
        keywords: page.seo?.keywords || "link in bio, creator, social links, linkpeak",
        icons: {
            icon: siteIcon,
            shortcut: siteIcon,
            apple: siteIcon,
        },
        robots: {
            index: false, // Prevent indexing of trial pages
            follow: false,
        },
        alternates: {
            canonical: `${CONFIG.SITE_URL}/trial/${slug}`,
        },
        openGraph: {
            type: "profile",
            url: `${CONFIG.SITE_URL}/trial/${slug}`,
            siteName: CONFIG.SITE_NAME,
            title: page.seo?.title || page.title,
            description: page.seo?.description || page.bio,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${page.title}'s Bio Page`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: page.seo?.title || page.title,
            description: page.seo?.description || page.bio,
            images: [ogImage],
        },
    };
}

export default async function Page({ params }) {
    const { slug } = await params;
    const page = await getBioPage(slug);

    if (!page) {
        return <BioNotFound />;
    }

    // Uses the TRIAL component with Live Polling
    return (
        <>
            <PublicBioTrial page={page} />
        </>
    );
}
