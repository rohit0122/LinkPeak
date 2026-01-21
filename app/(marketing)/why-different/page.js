import WhyDifferent from "@/components/marketing/WhyDifferent";
import { CONFIG } from "@/constants/config";

export const metadata = {
    title: `Why ${CONFIG.SITE_NAME} is Different - AI-Powered Link in Bio with Real-Time Analytics`,
    description: `Discover why ${CONFIG.SITE_NAME} stands out from other link in bio tools. Get intelligent SEO optimization, real-time analytics, and premium features that actually drive growth. See the honest comparison.`,
    keywords: [
        "link in bio comparison",
        "best link in bio tool",
        "AI link in bio",
        "link in bio with analytics",
        "SEO optimized link in bio",
        "real-time link tracking",
        "professional bio page",
        "link in bio alternative",
        "smart link in bio",
        "link in bio features"
    ],
    openGraph: {
        title: `Why ${CONFIG.SITE_NAME} is Different - AI-Powered Link in Bio`,
        description: "Intelligent SEO optimization, real-time analytics, and premium features that other link in bio tools don't offer. See the difference.",
        type: "website",
        url: `${CONFIG.SITE_URL}/why-different`,
        siteName: CONFIG.SITE_NAME,
        images: [
            {
                url: `${CONFIG.SITE_SCREENSHOT}`,
                width: 1200,
                height: 630,
                alt: `${CONFIG.SITE_NAME} - Why We're Different`,
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `Why ${CONFIG.SITE_NAME} is Different - AI-Powered Link in Bio`,
        description: "Intelligent SEO optimization, real-time analytics, and premium features that other link in bio tools don't offer.",
        images: [`${CONFIG.SITE_SCREENSHOT}`],
    },
    alternates: {
        canonical: `${CONFIG.SITE_URL}/why-different`,
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
};

export default function WhyDifferentPage() {
    const comparisonSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `Why ${CONFIG.SITE_NAME} is Different`,
        "description": "Comparison of LinkPeak's AI-powered link in bio features with other tools, highlighting intelligent SEO optimization and real-time analytics.",
        "url": `${CONFIG.SITE_URL}/why-different`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Intelligent SEO Optimization",
                    "description": "Automatic metadata generation for search engine visibility"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Real-Time Analytics",
                    "description": "Live tracking of views, clicks, and engagement"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Premium Design System",
                    "description": "11+ professional themes and 5 stunning templates"
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Lightning-Fast Performance",
                    "description": "Optimized for instant loading on any device"
                }
            ]
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What makes LinkPeak different from other link in bio tools?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "LinkPeak offers intelligent SEO optimization that automatically generates perfect metadata for search engines, real-time analytics for instant engagement tracking, and 11+ premium themes with professional templates. Unlike other tools, your bio page is optimized to rank in search results and provides live visitor tracking."
                }
            },
            {
                "@type": "Question",
                "name": "Does LinkPeak help with SEO and search engine visibility?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! LinkPeak automatically optimizes your bio page for search engines with intelligent metadata generation. Your page is designed to appear in Google, Bing, and Yahoo search results when people search for your name or brand."
                }
            },
            {
                "@type": "Question",
                "name": "What analytics features does LinkPeak provide?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "LinkPeak provides real-time analytics including live view tracking, click tracking, unique visitor counts, and engagement metrics. You can see exactly how visitors interact with your links as it happens, with no delays or waiting for reports."
                }
            },
            {
                "@type": "Question",
                "name": "Is LinkPeak free to use?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! LinkPeak offers a free forever plan with access to core features including SEO optimization, real-time analytics, custom QR codes, and multiple premium themes. No credit card required to get started."
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <WhyDifferent />
        </>
    );
}
