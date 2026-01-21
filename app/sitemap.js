import { CONFIG } from "@/constants/config";

export default async function sitemap() {
    const baseUrl = CONFIG.SITE_URL;

    // Static marketing and legal pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/why-different`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact-us`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-and-conditions`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/cookies-policy`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.4,
        },
        {
            url: `${baseUrl}/register`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.4,
        },
    ];

    // Dynamic bio pages - will be crawled via robots.txt Allow directive
    // Individual bio pages are already SEO-optimized with proper metadata
    // Search engines will discover them through:
    // 1. Internal links from the home page
    // 2. External social media links
    // 3. Direct crawling via robots.txt Allow: /*/

    // Note: For large-scale deployments with 1000+ bio pages, consider adding
    // a dedicated backend endpoint (GET /api/v1/public/sitemap-pages) that returns
    // all active public bio pages with their slugs and last_modified dates

    return staticPages;
}
