export const dynamic = "force-dynamic";

import NavbarClient from "@/components/layout/NavbarClient";
import Footer from "@/components/layout/Footer";

export default function MarketingLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarClient />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
