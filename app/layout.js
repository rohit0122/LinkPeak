import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CONFIG } from "@/constants/config";
import ClientProvider from "@/components/providers/ClientProvider";
import { GoogleAnalytics } from "@next/third-parties/google";


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



export const metadata = {
  title: CONFIG.METATAGS.title,
  description: CONFIG.METATAGS.description,
  keywords: CONFIG.METATAGS.keywords,

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
        url: `${CONFIG.SITE_URL}/linkpeakk-home.webp`,
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
    images: [`${CONFIG.SITE_URL}/linkpeakk-home.webp`],
    keywords: CONFIG.METATAGS.keywords,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="linkPeakTheme">
      <body
        className={`${outfit.variable} ${jakarta.variable} antialiased`}
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
