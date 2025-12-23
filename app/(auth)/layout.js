import NavbarClient from "@/components/layout/NavbarClient";
import UnifiedNavbar from "@/components/layout/UnifiedNavbar";

export default function AuthLayout({ children }) {
    return (
        <>
            <NavbarClient />
            <div className="pt-24 bg-base-200/50 flex items-center justify-center p-6">
                {children}
            </div>
        </>
    );
}
