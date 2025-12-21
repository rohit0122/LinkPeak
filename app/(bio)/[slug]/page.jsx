import connectDB from "@/lib/db/connect";
import BioPage from "@/lib/db/models/BioPage";
import Link from "@/lib/db/models/Link";
import UserModel from "@/lib/db/models/User";

import MinimalBioCard from "@/components/bio/MinimalBioCard";
import CreatorBioCard from "@/components/bio/CreatorBioCard";
import ProfessionalBioCard from "@/components/bio/ProfessionalBioCard";
import ViewTracker from "@/components/bio/ViewTracker";

import { notFound } from "next/navigation";
import Script from "next/script";

/* -------------------- METADATA -------------------- */
export async function generateMetadata({ params }) {
    const { slug } = await params;
    await connectDB();
    const page = await BioPage.findOne({ slug: slug.toLowerCase() });

    if (!page) {
        return { title: "User Not Found | LinkPeak" };
    }

    return {
        title: `${page.title} – LinkPeak`,
        description:
            page.bio ||
            `View all of ${page.title}'s important links in one place.`,
        openGraph: {
            title: page.title,
            description: page.bio,
            images: page.avatarUrl ? [page.avatarUrl] : [],
            type: "profile",
        },
        twitter: {
            card: "summary_large_image",
            title: page.title,
            description: page.bio,
        },
    };
}

/* -------------------- CARD RESOLVER -------------------- */
function resolveBioCard(theme) {
    switch (theme) {
        case "creator":
            return CreatorBioCard;
        case "professional":
            return ProfessionalBioCard;
        default:
            return MinimalBioCard;
    }
}

/* -------------------- PAGE -------------------- */
export default async function PublicBioPage({ params }) {
    const { slug } = await params;

    await connectDB();

    const page = await BioPage.findOne({ slug: slug.toLowerCase() });
    if (!page) return notFound();

    const [user, links] = await Promise.all([
        UserModel.findOne({ clerkId: page.ownerId }),
        Link.find({ pageId: page._id, isActive: true }).sort({
            priorityScore: -1,
        }),
    ]);

    const CardComponent = resolveBioCard(page.themeConfig?.name || "minimal");

    // Determine dark mode: checking appearance if it exists, or themeConfig
    const isDark = page.appearance?.mode === "dark" || page.themeConfig?.backgroundColor === "#000000";

    const finalAvatar =
        page.avatarUrl ||
        user?.imageUrl ||
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
            "@type": "Person",
            name: page.title,
            description: page.bio,
            image: finalAvatar,
            url: `https://linkpeak.top/${page.slug}`,
            sameAs: links.map((l) => l.url),
        },
    };

    const bgStyle = page.themeConfig?.backgroundColor || (isDark ? "#0b0f19" : "#f9fafb");
    const textStyle = page.themeConfig?.textColor || (isDark ? "#e2e8f0" : "#0f172a");

    return (
        <div
            className="min-h-screen flex justify-center selection:bg-primary/20"
            style={{ backgroundColor: bgStyle, color: textStyle }}
        >
            <Script
                id="structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <ViewTracker slug={slug} />

            <div className="w-full max-w-[420px] px-5 py-20 space-y-16">
                {/* HEADER */}
                <header className="flex flex-col items-center text-center space-y-6">
                    <img
                        src={finalAvatar}
                        alt={page.title}
                        className="w-28 h-28 rounded-3xl object-cover shadow-md"
                        crossOrigin="anonymous"
                    />

                    <div>
                        <h1 className="text-2xl font-semibold">{page.title}</h1>
                        <p className="text-sm text-slate-500">@{page.slug}</p>
                    </div>

                    {page.bio && (
                        <p
                            className={`text-sm max-w-xs ${isDark ? "text-slate-400" : "text-slate-600"
                                }`}
                        >
                            {page.bio}
                        </p>
                    )}
                </header>

                {/* LINKS */}
                <main className="space-y-4">
                    {links.map((link) => (
                        <CardComponent
                            key={link._id.toString()}
                            id={link._id.toString()}
                            title={link.title}
                            url={link.url}
                            icon={link.icon}
                            isPriority={link.priorityScore > 0}
                            isDark={isDark}
                            themeColor={page.themeConfig?.buttonColor}
                        />
                    ))}

                    {links.length === 0 && (
                        <div className="border border-dashed rounded-xl p-12 text-center text-sm text-slate-400">
                            No links yet.
                        </div>
                    )}
                </main>

                {/* FOOTER */}
                <footer className="text-center text-xs text-slate-400">
                    Powered by <span className="font-medium">LinkPeak</span>
                </footer>
            </div>
        </div>
    );
}
