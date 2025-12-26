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
        if (!session) return { user: null, page: null };

        await dbConnect();

        // Fetch User (lean for performance)
        const user = await User.findById(session.id)
            .select("name email role plan")
            .lean();

        if (!user) return { user: null, page: null };

        // Fetch BioPage (lean)
        const page = await BioPage.findOne({ userId: user._id })
            .select("slug profileImage")
            .lean();

        // Serialize ObjectIds for passing to client component
        if (user._id) user._id = user._id.toString();
        if (page && page._id) page._id = page._id.toString();
        if (page && page.userId) page.userId = page.userId.toString();

        return { user, page: page || null };
    } catch (error) {
        console.error("LegalLayout layout auth error:", error);
        return { user: null, page: null };
    }
}

export default async function LegalLayout({ children }) {
    const { user, page } = await getUserData();
    return (
        <div className="flex flex-col min-h-screen">
            <NavbarClient user={user} page={page} />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
