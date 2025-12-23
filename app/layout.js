import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LinkPeak | The Ultimate Link in Bio Tool",
  description: "Create your personalized bio link page in seconds. Share your world with a single link.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" stroke="currentColor" stroke-width="0" class="w-6 h-6 text-nuetral" viewBox="0 0 256 256"><path stroke="none" d="M152 128a24 24 0 1 1-24-24 24 24 0 0 1 24 24Z" opacity=".2"/><path stroke="none" d="M200 152a31.84 31.84 0 0 0-19.53 6.68l-23.11-18A31.65 31.65 0 0 0 160 128c0-.74 0-1.48-.08-2.21l13.23-4.41A32 32 0 1 0 168 104c0 .74 0 1.48.08 2.21l-13.23 4.41A32 32 0 0 0 128 96a32.59 32.59 0 0 0-5.27.44L115.89 81A32 32 0 1 0 96 88a32.59 32.59 0 0 0 5.27-.44l6.84 15.4a31.92 31.92 0 0 0-8.57 39.64l-25.71 22.84a32.06 32.06 0 1 0 10.63 12l25.71-22.84a31.91 31.91 0 0 0 37.36-1.24l23.11 18A31.65 31.65 0 0 0 168 184a32 32 0 1 0 32-32Zm0-64a16 16 0 1 1-16 16 16 16 0 0 1 16-16ZM80 56a16 16 0 1 1 16 16 16 16 0 0 1-16-16ZM56 208a16 16 0 1 1 16-16 16 16 0 0 1-16 16Zm56-80a16 16 0 1 1 16 16 16 16 0 0 1-16-16Zm88 72a16 16 0 1 1 16-16 16 16 0 0 1-16 16Z"/></svg>',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="linkPeakTheme">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
