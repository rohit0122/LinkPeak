import Link from "next/link";
import { RiUserUnfollowLine } from "react-icons/ri";
import Navbar from "../layout/Navbar";
import NavbarClient from "../layout/NavbarClient";
import Footer from "../layout/Footer";

export default function BioNotFound() {
    return (
        <>
            <NavbarClient />
            <div className="mt-20 flex items-center justify-center bg-base-100 px-4">
                <div className="max-w-sm text-center space-y-6">
                    <RiUserUnfollowLine className="mx-auto text-6xl text-warning" />

                    <h2 className="text-3xl font-semibold">
                        This profile isn't available
                    </h2>

                    <p className="text-base-content/60">
                        The user may have changed their username or removed this page.
                    </p>

                    <Link
                        href="/"
                        className="btn btn-primary btn-wide"
                    >
                        Create Your Own Bio Page
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );
}
