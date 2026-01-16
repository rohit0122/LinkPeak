import PublicBioNew from "@/app/[slug]/PublicBioNew";
import { notFound } from "next/navigation";
import { CONFIG } from "@/constants/config";
import { ecoDemoProfile, elizaDemoProfile } from "@/constants/demoProfile";

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

  // Select Data
  let pageData = null;

  if (username === "eliza-miller") {
    pageData = elizaDemoProfile;
  } else if (username === "eco-wanderer") {
    pageData = ecoDemoProfile();
  } else {
    return notFound();
  }

  return <PublicBioNew page={pageData} isDemo={true} />;
}
