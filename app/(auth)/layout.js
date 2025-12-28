import NavbarClient from "@/components/layout/NavbarClient";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({ children }) {
    return (
        <>
            <NavbarClient />
            <div className="bg-base-200/50 flex items-center justify-center">
                {children}
            </div>
            <Footer />
        </>
    );
}
