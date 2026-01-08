import dbConnect from "@/lib/db";
import BioPage from "@/models/BioPage";
import UserModel from "@/models/User";
import LinkModel from "@/models/Link";
import PublicBio from "./PublicBio";
import BioNotFound from "@/components/bio-templates/BioNotFound";
import { CONFIG } from "@/constants/config";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    await dbConnect();
    const page = await BioPage.findOne({ slug: slug.toLowerCase() }).lean();
    if (!page) return <BioNotFound />;

    // Use currentUser's profile image if available, otherwise use site banner
    const ogImage = page.profileImage || `${CONFIG.SITE_URL}/linkpeakk-home.webp`;

    return {
        title: page.seo?.title || `${page.title} | ${CONFIG.SITE_NAME}`,
        description: page.seo?.description || page.bio || `Check out ${page.title}'s links on ${CONFIG.SITE_NAME}.`,
        keywords: page.seo?.keywords || "link in bio, creator, social links, linkpeak",
        openGraph: {
            type: 'profile',
            url: `${CONFIG.SITE_URL}/${slug}`,
            siteName: CONFIG.SITE_NAME,
            title: page.seo?.title || page.title,
            description: page.seo?.description || page.bio,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${page.title}'s Bio Page`,
                }
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: page.seo?.title || page.title,
            description: page.seo?.description || page.bio,
            images: [ogImage],
        }
    };
}

export default async function Page({ params }) {
    const { slug } = await params;

    // ... rest of component
    await dbConnect();
    const page = await BioPage.findOne({ slug: slug.toLowerCase() })
        .populate("userId", "plan")
        .lean();
    if (!page) {
        return <BioNotFound />;
    }

    const links = await LinkModel.find({ pageId: page._id, isActive: true })
        .sort({ order: 1 })
        .lean();

    // Convert ObjectIds to strings for serialization
    const serializedPage = JSON.parse(JSON.stringify(page));
    const serializedLinks = JSON.parse(JSON.stringify(links));

    return <PublicBio page={serializedPage} links={serializedLinks} />;
}
