import BioPageRepository from "@/lib/repositories/BioPageRepository";
import LinkRepository from "@/lib/repositories/LinkRepository";
import PublicBioView from "@/components/shared/PublicBioView";
import BioNotFound from "@/components/bio-templates/BioNotFound";
import { CONFIG } from "@/constants/config";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const page = await BioPageRepository.findBySlugLean(slug);
    if (!page) return { title: "Page Not Found" };

    // Use user's profile image if available, otherwise use site banner
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

    const page = await BioPageRepository.findBySlugLean(slug);
    if (!page) {
        return <BioNotFound />;
    }

    // Fetch active links using pageId
    const links = await LinkRepository.findByPageId(page._id);
    const activeLinks = (links || []).filter(l => l.isActive);

    // Convert ObjectIds to strings for serialization safely
    const serializedPage = JSON.parse(JSON.stringify(page));
    const serializedLinks = JSON.parse(JSON.stringify(activeLinks));

    return <PublicBioView page={serializedPage} links={serializedLinks} />;
}
