import NavbarClient from "@/components/layout/NavbarClient";
import UnifiedNavbar from "@/components/layout/UnifiedNavbar";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({ children }) {
    return (
        <>
            <NavbarClient />
            <div className="min-h-screen pt-24 bg-base-200/50 flex items-center justify-center p-6">
                {children}
            </div>
            <Footer />
        </>
    );
}
