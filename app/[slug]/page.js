import { cache } from "react";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import PublicBioNew from "./PublicBioNew";
import BioNotFound from "@/components/bio-templates/BioNotFound";
import { CONFIG } from "@/constants/config";

// Memoize the data fetch
const getBioPage = cache(async (slug) => {
  try {
    //console.log('slug =>>>>>>>>>>>>>>>>>>>', slug);
    const response = await restClient.get(
      BACKEND_ENDPOINTS.PUBLIC.GET_PAGE(slug)
    );
    // console.log('slug data =>>>>>>>>>>>>>>>>>>>', response.data);
    if (response.data?.success) {
      return response.data.data.page;
    }
  } catch (error) {
    console.error("Failed to fetch bio page", error);
  }
  return null;
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const rawPage = await getBioPage(slug);

  if (!rawPage) return { title: "Page Not Found" };

  const page = rawPage;

  // Use page profile image or default
  const ogImage =
    page.profile_image || `${CONFIG.SITE_URL}/linkpeakk-home.webp`;

  return {
    title: page.seo?.title || `${page.title} | ${CONFIG.SITE_NAME}`,
    description:
      page.seo?.description ||
      page.bio ||
      `Check out ${page.title}'s links on ${CONFIG.SITE_NAME}.`,
    keywords:
      page.seo?.keywords || "link in bio, creator, social links, linkpeak",
    openGraph: {
      type: "profile",
      url: `${CONFIG.SITE_URL}/${slug}`,
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
  const rawPage = await getBioPage(slug);

  if (!rawPage) {
    return <BioNotFound />;
  }

  const normalizedPage = rawPage; //normalizePage(rawPage);
  const normalizedLinks = rawPage.links; // normalizeLinks(rawPage.links);

  // Serialize? Not needed if they are just objects, but good practice if passing to Client Component
  // Since we manually constructed them from JSON, they are serializable.

  return <PublicBioNew page={normalizedPage} links={normalizedLinks} />;
}
