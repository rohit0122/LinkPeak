import Link from "next/link";
import { RiArrowLeftLine, RiUser3Line, RiArticleLine, RiShareBoxLine } from "react-icons/ri";
import { CONFIG } from "@/constants/config";

export async function generateMetadata({ params }) {
    const { username, linkSlug } = await params;

    // Format the slugs into readable text
    const formattedUser = username.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const formattedTitle = linkSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${formattedTitle} by ${formattedUser} | ${CONFIG.SITE_NAME} Demo`,
        description: `Check out ${formattedTitle} by ${formattedUser}. This is a demo content page hosted on ${CONFIG.SITE_NAME}.`,
        openGraph: {
            title: `${formattedTitle} by ${formattedUser}`,
            description: `Read more about ${formattedTitle} on ${CONFIG.SITE_NAME}`,
            type: 'article',
        },
        robots: {
            index: false, // Don't index demo pages
            follow: false,
        }
    };
}

export default async function DemoContentPage({ params }) {
    const { username, linkSlug } = await params;

    // Helper to format slugs to title case
    const formatSlug = (s) => {
        return s
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const userTitle = formatSlug(username);
    const contentTitle = formatSlug(linkSlug);

    // Simulated bio link for the back button (assuming username is the slug)
    const bioLink = `/demo/${username}`;

    return (
        <div className="min-h-screen bg-base-100 flex flex-col font-sans">
            {/* SEO: Hidden semantic header */}
            <h1 className="sr-only">{contentTitle} by {userTitle} - {CONFIG.SITE_NAME} Demo Page</h1>

            {/* Navigation Bar */}
            <nav className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-200 px-4 md:px-8">
                <div className="flex-1">
                    <Link href={bioLink} className="btn btn-neutral btn-outline gap-2 normal-case btn-sm md:btn-md font-medium">
                        <RiArrowLeftLine />
                        <span className="hidden sm:inline">Back to</span> {userTitle}'s Bio
                    </Link>
                </div>
                <div className="flex-none">
                    <Link href="/register" className="btn btn-primary btn-sm md:btn-md">
                        Get your {CONFIG.SITE_NAME} today!
                    </Link>
                </div>
            </nav>

            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                {/* Header Section */}
                <header className="mb-12 text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6 text-sm text-primary font-bold tracking-wider uppercase opacity-80">
                        <span className="flex items-center gap-1">
                            <RiUser3Line /> {userTitle}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <RiArticleLine /> Demo Content
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-base-content mb-6 leading-tight">
                        {contentTitle}
                    </h2>

                    <p className="text-xl md:text-2xl text-base-content/60 leading-relaxed max-w-2xl mx-auto md:mx-0">
                        This is a demonstration page representing external content linked from a {CONFIG.SITE_NAME} bio page.
                    </p>
                </header>

                {/* Mock Content Placeholder */}
                <article className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-a:text-primary">
                    <div className="bg-base-200/50 rounded-3xl p-8 md:p-12 border border-base-200 shadow-sm space-y-6">
                        {/* Placeholder Lines */}
                        <div className="h-6 bg-base-300/50 rounded-full w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-base-300/50 rounded-full w-full animate-pulse"></div>
                        <div className="h-4 bg-base-300/50 rounded-full w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-base-300/50 rounded-full w-4/5 animate-pulse"></div>

                        <div className="py-8">
                            <div className="h-64 md:h-96 w-full bg-base-300/30 rounded-2xl flex items-center justify-center flex-col gap-4 text-base-content/40 border-2 border-dashed border-base-300/50">
                                <RiShareBoxLine className="text-6xl" />
                                <p className="font-medium text-lg">External Content Placeholder</p>
                            </div>
                        </div>

                        <div className="h-4 bg-base-300/50 rounded-full w-full animate-pulse"></div>
                        <div className="h-4 bg-base-300/50 rounded-full w-11/12 animate-pulse"></div>
                        <div className="h-4 bg-base-300/50 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                </article>

                {/* Promotional CTA */}
                <section className="mt-20">
                    <div className="card bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-xl overflow-hidden relative">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                        <div className="card-body items-center text-center py-16 px-6 relative z-10">
                            <h3 className="text-3xl font-bold mb-4">
                                Like what you see?
                            </h3>
                            <p className="text-lg opacity-80 mb-8 max-w-lg">
                                Create your own beautiful bio page and link to your content just like {userTitle}. It takes less than a minute.
                            </p>
                            <Link href="/register" className="btn btn-primary btn-lg px-8 shadow-lg hover:scale-105 transition-transform">
                                Start Your Page Free
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
                <div>
                    <p className="font-bold text-lg">{CONFIG.SITE_NAME} Demo Network</p>
                    <p>Showcasing the power of connected content.</p>
                </div>
            </footer>
        </div>
    );
}
