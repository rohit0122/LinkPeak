import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Toaster } from "sonner";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


export const metadata = {
  title: "LinkPeak - AI Link Wrapper",
  description: "Optimize your bio link with AI",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className="antialiased"
        >
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors position="bottom-right" />
        </body>
      </html>
    </AuthProvider>
  );
}
