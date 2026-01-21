import { CONFIG } from "@/constants/config";


export const getDemoProfile = (username = 'eliza-miller', theme = 'light') => {
    if (username === 'eliza-miller') {
        return {
            theme: theme,
            title: "Eliza Miller",
            bio: "Digital Creator & Traveler 🏔️ | Sharing my latest journeys and gear.",
            profile_image: "/avatars/avatar-female-eliza.svg",
            template: "classic",
            total_views: 12450,
            likes: 48,
            social_links: {
                instagram: "instagram.com",
                twitter: "twitter.com",
                tiktok: "tiktok.com",
            },
            links: [
                {
                    id: 1,
                    title: "My Travel Guide 🌍",
                    url: `${CONFIG.SITE_URL}/demo/eliza-miller?theme=${theme}`,
                    is_active: true,
                },
                {
                    id: 2,
                    title: "Latest Vlog 📹",
                    url: `${CONFIG.SITE_URL}/demo/eliza-miller?theme=${theme}`,
                    is_active: true,
                },
                {
                    id: 3,
                    title: "Photography Gear 📸",
                    url: `${CONFIG.SITE_URL}/demo/eliza-miller?theme=${theme}`,
                    is_active: true,
                },
            ],
        }
    } else {
        return {
            theme: theme,
            title: "Eco Wanderer 🌿",
            bio: "Sustainable living & ethical travel tips for the modern soul.",
            profile_image: "/avatars/avatar-generic-eco.svg",
            template: "classic",
            total_views: 890,
            likes: 89,
            social_links: {
                instagram: "instagram.com",
                facebook: "facebook.com",
                linkedin: "linkedin.com",
            },
            links: [
                {
                    id: 1,
                    title: "Zero Waste Guide 🌍",
                    url: `${CONFIG.SITE_URL}/demo/eco-wanderer?theme=${theme}`,
                    is_active: true,
                },
                {
                    id: 2,
                    title: "My Ethical Kit 👜",
                    url: `${CONFIG.SITE_URL}/demo/eco-wanderer?theme=${theme}`,
                    is_active: true,
                },
                {
                    id: 3,
                    title: "Eco-stays in Bali 🛖",
                    url: `${CONFIG.SITE_URL}/demo/eco-wanderer?theme=${theme}`,
                    is_active: true,
                },
            ],
        }
    }
}