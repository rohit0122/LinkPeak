import {
  Outfit,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Playfair_Display,
  JetBrains_Mono,
  Fredoka
} from "next/font/google";
import "./globals.css";
import { CONFIG } from "@/constants/config";
import ClientProvider from "@/components/providers/ClientProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/lib/axiosClientInterceptors";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-cyber",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-pop",
  display: "swap",
});



export const metadata = {
  metadataBase: new URL(CONFIG.SITE_URL),
  title: CONFIG.METATAGS.title,
  description: CONFIG.METATAGS.description,
  keywords: CONFIG.METATAGS.keywords,
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
    canonical: CONFIG.SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: CONFIG.SITE_URL,
    siteName: CONFIG.SITE_NAME,
    title: CONFIG.METATAGS.title,
    description: CONFIG.METATAGS.description,
    keywords: CONFIG.METATAGS.keywords,
    images: [
      {
        url: `${CONFIG.SITE_SCREENSHOT}`,
        width: 1200,
        height: 630,
        alt: `${CONFIG.SITE_NAME} - AI-Powered Link in Bio Tool for TikTok, Instagram, YouTube`,
      }
    ],
    article: {
      tag: ["link in bio", "TikTok", "Instagram", "YouTube", "AI", "analytics", "creators", "influencers"]
    }
  },
  twitter: {
    card: 'summary_large_image',
    site: '@linkpeak',
    creator: '@linkpeak',
    title: CONFIG.METATAGS.title,
    description: CONFIG.METATAGS.description,
    images: [`${CONFIG.SITE_SCREENSHOT}`],
    keywords: CONFIG.METATAGS.keywords,
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": CONFIG.SITE_NAME,
    "url": CONFIG.SITE_URL,
    "logo": `${CONFIG.SITE_URL}/linkpeakk-logo.webp`,
    "description": CONFIG.METATAGS.description,
    "email": CONFIG.SUPPORT_EMAIL,
    "sameAs": [
      "https://twitter.com/linkpeak",
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": CONFIG.SITE_NAME,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "0",
      "highPrice": "49",
      "priceCurrency": "USD",
      "offerCount": "3"
    },
    "description": "AI-powered link in bio platform with real-time analytics for TikTok, Instagram, YouTube creators and brands",
    "featureList": [
      "AI-powered SEO optimization",
      "Real-time analytics dashboard",
      "Custom QR codes",
      "Multiple templates and themes",
      "TikTok link in bio",
      "Instagram link in bio",
      "YouTube link in bio",
      "Link tracking and insights"
    ],
    "screenshot": CONFIG.SITE_SCREENSHOT,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": CONFIG.SITE_NAME,
    "url": CONFIG.SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${CONFIG.SITE_URL}/{slug}`
      },
      "query-input": "required name=slug"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a link in bio tool?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A link in bio tool allows you to create a landing page with multiple links for your social media bio. Perfect for TikTok, Instagram, and YouTube where you can only add one link."
        }
      },
      {
        "@type": "Question",
        "name": "Does LinkPeak work with TikTok, Instagram, and YouTube?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! LinkPeakK. is optimized for all major social platforms including TikTok, Instagram, YouTube, Twitter, and more."
        }
      },
      {
        "@type": "Question",
        "name": "What makes LinkPeak different from other link in bio tools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "LinkPeakK. offers AI-powered SEO optimization and real-time analytics that other tools don't provide. Get AI-generated meta tags, live click tracking, and advanced insights."
        }
      }
    ]
  };


  return (
    <html lang="en" data-theme="linkpeak">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body
        className={`${outfit.variable} ${jakarta.variable} ${spaceGrotesk.variable} ${playfair.variable} ${mono.variable} ${fredoka.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
      <GoogleAnalytics gaId="G-YQLKK9K593" />
    </html >
  );
}
