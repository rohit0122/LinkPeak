import Navbar from "@/components/layout/Navbar";
import NavbarClient from "@/components/layout/NavbarClient";
import UnifiedNavbar from "@/components/layout/UnifiedNavbar";

export default function MarketingLayout({ children }) {
    return (
        <>
            <NavbarClient />
            {children}
        </>
    );
}
