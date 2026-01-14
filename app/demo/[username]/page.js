import PublicBioNew from "@/app/[slug]/PublicBioNew";
import { notFound } from "next/navigation";
import { CONFIG } from "@/constants/config";

export async function generateMetadata({ params }) {
  const { username } = await params;

  let title = "Demo Bio Page";
  if (username === "eliza-miller") title = "Eliza Miller";
  if (username === "eco-wanderer") title = "Eco Wanderer";

  return {
    title: `${title} | ${CONFIG.SITE_NAME} Demo`,
    description: `Experience a live demo of ${title}'s bio page on ${CONFIG.SITE_NAME}.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function DemoBioPage({ params }) {
  const { username } = await params;

  // Static Data for "Eliza Miller" - updated links to point to the new demo/ link structure
  const elizaPage = {
    _id: "demo_eliza",
    slug: "eliza-miller",
    title: "Eliza Miller",
    bio: "Digital Creator & Traveler 🏔️ | Sharing my latest journeys and gear.",
    profile_image: "/avatars/avatar-female-eliza.svg",
    template: "classic",
    theme: "light",
    views: 12450,
    likes: 842,
    social_links: {
      instagram: "instagram.com",
      twitter: "twitter.com",
      tiktok: "tiktok.com",
    },
  };

  const elizaLinks = [
    {
      _id: "1",
      title: "My Travel Guide 🌍",
      url: `${CONFIG.SITE_URL}/demo/eliza-miller/my-travel-guide`,
      is_active: true,
    },
    {
      _id: "2",
      title: "Latest Vlog 📹",
      url: `${CONFIG.SITE_URL}/demo/eliza-miller/latest-vlog`,
      is_active: true,
    },
    {
      _id: "3",
      title: "Photography Gear 📸",
      url: `${CONFIG.SITE_URL}/demo/eliza-miller/photography-gear`,
      is_active: true,
    },
  ];

  // Static Data for "Eco Wanderer"
  const ecoPage = {
    _id: "demo_eco",
    slug: "eco-wanderer",
    title: "Eco Wanderer 🌿",
    bio: "Sustainable living & ethical travel tips for the modern soul.",
    profile_image: "/avatars/avatar-generic-eco.svg",
    template: "classic",
    theme: "bumblebee", // Note: The LiveDemo component has dynamic theme switching, here we default to light
    views: 890,
    likes: 124,
    social_links: {
      instagram: "instagram.com",
      facebook: "facebook.com",
      linkedin: "linkedin.com",
    },
  };

  const ecoLinks = [
    {
      _id: "1",
      title: "Zero Waste Guide 🌍",
      url: `${CONFIG.SITE_URL}/demo/eco-wanderer/zero-waste-guide`,
      is_active: true,
    },
    {
      _id: "2",
      title: "My Ethical Kit 👜",
      url: `${CONFIG.SITE_URL}/demo/eco-wanderer/my-ethical-kit`,
      is_active: true,
    },
    {
      _id: "3",
      title: "Eco-stays in Bali 🛖",
      url: `${CONFIG.SITE_URL}/demo/eco-wanderer/eco-stays-in-bali`,
      is_active: true,
    },
  ];

  // Select Data
  let pageData = null;
  let linksData = [];

  if (username === "eliza-miller") {
    pageData = elizaPage;
    linksData = elizaLinks;
  } else if (username === "eco-wanderer") {
    pageData = ecoPage;
    linksData = ecoLinks;
  } else {
    return notFound();
  }

  return <PublicBioNew page={pageData} links={linksData} isDemo={true} />;
}
