import { cache } from "react";
import restClient from "@/lib/restClient";
import { BACKEND_ENDPOINTS } from "@/constants/endpoints";
import PublicBioNew from "./PublicBioNew";
import BioNotFound from "@/components/templates/BioNotFound";
import { CONFIG } from "@/constants/config";

// Force dynamic rendering (No ISR) for blinking fast freshness
export const dynamic = "force-dynamic";

// Deduplicate API calls for Metadata & Parsing
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

  const userKeywords = page.seo?.keywords ? `${page.seo.keywords}, ` : "";
  const platformKeywords = `link in bio, creator, social links, ${CONFIG.SITE_NAME}, bio page, ${slug}, ${page.title}`;

  return {
    title: page.seo?.title || `${page.title} | ${CONFIG.SITE_NAME}`,
    description: page.seo?.description || page.bio || `Check out ${page.title}'s links on ${CONFIG.SITE_NAME}.`,
    keywords: `${userKeywords}${platformKeywords}`,
    icons: {
      icon: siteIcon,
      shortcut: siteIcon,
      apple: siteIcon,
    },
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
  const page = await getBioPage(slug);

  if (!page) {
    return <BioNotFound />;
  }

  const activeLinks = (page.links || []).filter(link => link.is_active);

  // Expanded JSON-LD for 100% SEO Compliance
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": page.title,
        "description": page.bio || `${page.title}'s bio page`,
        "image": page.profile_image || `${CONFIG.SITE_URL}${CONFIG.DEFAULT_PROFILE_IMAGE}`,
        "url": `${CONFIG.SITE_URL}/${slug}`,
        "sameAs": activeLinks.map(link => link.url)
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": CONFIG.SITE_NAME,
            "item": CONFIG.SITE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": page.title,
            "item": `${CONFIG.SITE_URL}/${slug}`
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${page.title}'s Social Links`,
      "description": `List of all important links for ${page.title}`,
      "itemListElement": activeLinks.map((link, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": link.url,
        "name": link.title
      }))
    }
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PublicBioNew page={page} />
    </>
  );
}
