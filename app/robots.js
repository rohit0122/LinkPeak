import { CONFIG } from "@/constants/config";

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/api/', '/admin/', '/auth/'],
        },
        sitemap: `${CONFIG.SITE_URL}/sitemap.xml`,
    }
}
