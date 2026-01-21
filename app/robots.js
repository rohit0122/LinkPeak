import { CONFIG } from "@/constants/config";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/why-different", "/contact-us", "/privacy-policy", "/terms-and-conditions", "/cookies-policy", "/*/"],
                disallow: ["/api/", "/dashboard/", "/admin/", "/suspended", "/payment/callback", "/mock-payment"],
            },
            {
                userAgent: ["Googlebot", "Bingbot"],
                allow: ["/", "/*/"],
                disallow: ["/api/", "/dashboard/", "/admin/"],
            }
        ],
        sitemap: `${CONFIG.SITE_URL}/sitemap.xml`,
    };
}

