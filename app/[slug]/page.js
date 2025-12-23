import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import BioPage from "@/models/BioPage";
import LinkModel from "@/models/Link";
import PublicBio from "./PublicBio";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    await dbConnect();
    const page = await BioPage.findOne({ slug: slug.toLowerCase() }).lean();

    if (!page) return { title: "Page Not Found | LinkPeak" };

    return {
        title: page.seo?.title || `${page.title} | LinkPeak Bio`,
        description: page.seo?.description || page.bio || `Check out ${page.title}'s links on LinkPeak.`,
        keywords: page.seo?.keywords || "link in bio, creator, social links, linkpeak",
        openGraph: {
            title: page.seo?.title || page.title,
            description: page.seo?.description || page.bio,
            images: [page.profileImage || "https://linkpeak.io/og-image.jpg"],
        },
        twitter: {
            card: "summary_large_image",
            title: page.seo?.title || page.title,
            description: page.seo?.description || page.bio,
            images: [page.profileImage || "https://linkpeak.io/og-image.jpg"],
        }
    };
}

export default async function Page({ params }) {
    const { slug } = await params;

    // ... rest of component
    await dbConnect();
    const page = await BioPage.findOne({ slug: slug.toLowerCase() }).lean();

    if (!page) {
        return notFound();
    }

    const links = await LinkModel.find({ pageId: page._id, isActive: true })
        .sort({ order: 1 })
        .lean();

    // Convert ObjectIds to strings for serialization
    const serializedPage = JSON.parse(JSON.stringify(page));
    const serializedLinks = JSON.parse(JSON.stringify(links));

    return <PublicBio page={serializedPage} links={serializedLinks} />;
}
