export const dynamic = "force-dynamic";

import NavbarClient from "@/components/layout/NavbarClient";
import Footer from "@/components/layout/Footer";
import { getAuthUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BioPage from "@/models/BioPage";

async function getUserData() {
    try {
        const session = await getAuthUser();
        // If no session, return nulls immediately
        if (!session) return { currentUser: null, page: null };

        await dbConnect();

        // Fetch User (lean for performance)
        const currentUser = await User.findById(session.id)
            .select("name email role plan")
            .lean();

        if (!currentUser) return { currentUser: null, page: null };

        // Fetch BioPage (lean)
        const page = await BioPage.findOne({ userId: currentUser._id })
            .select("slug profileImage")
            .lean();

        // Serialize ObjectIds for passing to client component
        if (currentUser._id) currentUser._id = currentUser._id.toString();
        if (page && page._id) page._id = page._id.toString();
        if (page && page.userId) page.userId = page.userId.toString();

        return { currentUser, page: page || null };
    } catch (error) {
        console.error("Layout server-side auth error:", error);
        return { currentUser: null, page: null };
    }
}

export default async function MarketingLayout({ children }) {
    const { currentUser, page } = await getUserData();

    return (
        <div className="flex flex-col min-h-screen">
            <NavbarClient currentUser={currentUser} page={page} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
