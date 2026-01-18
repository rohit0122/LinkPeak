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
        alt: `${CONFIG.SITE_NAME} - Link in Bio Tool`,
      }
    ],
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

  return (
    <html lang="en" data-theme="linkpeak">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
