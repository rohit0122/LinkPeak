import { cache } from "react";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import PublicBioNew from "./PublicBioNew";
import BioNotFound from "@/components/templates/BioNotFound";
import { CONFIG } from "@/constants/config";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

// Memoize the data fetch
const getBioPage = cache(async (slug) => {
  try {
    //console.log('slug =>>>>>>>>>>>>>>>>>>>', slug);
    const response = await restClient.get(
      BACKEND_ENDPOINTS.PUBLIC.GET_PAGE(slug)
    );
    //console.log('slug data =>>>>>>>>>>>>>>>>>>>', response.data);
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
    page.profile_image || `${CONFIG.SITE_SCREENSHOT}`;

  return {
    title: page.seo?.title || `${page.title} | ${CONFIG.SITE_NAME}`,
    description:
      page.seo?.description ||
      page.bio ||
      `Check out ${page.title}'s links on ${CONFIG.SITE_NAME}.`,
    keywords:
      page.seo?.keywords || "link in bio, creator, social links, linkpeak",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${CONFIG.SITE_URL}/${slug}`,
    },
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

  // JSON-LD structured data for Person/ProfilePage
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": rawPage.title,
      "description": rawPage.bio || `${rawPage.title}'s bio page`,
      "image": rawPage.profile_image || `${CONFIG.SITE_SCREENSHOT}`,
      "url": `${CONFIG.SITE_URL}/${slug}`,
      "sameAs": rawPage.links?.filter(link => link.is_active)
        .map(link => link.url) || []
    },
    "about": {
      "@type": "Thing",
      "name": "Link in bio page",
      "description": "Social media bio page for TikTok, Instagram, YouTube, and other platforms"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <PublicBioNew page={rawPage} />
    </>
  );
}
