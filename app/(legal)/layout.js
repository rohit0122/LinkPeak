import NavbarClient from "@/components/layout/NavbarClient";
import Footer from "@/components/layout/Footer";

export default async function LegalLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarClient />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
