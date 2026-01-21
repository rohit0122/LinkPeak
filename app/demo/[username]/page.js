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

export async function generateStaticParams() {
  return [
    { username: 'eliza-miller' },
    { username: 'eco-wanderer' },
  ];
}

import { Suspense } from "react";
import DemoClient from "./DemoClient";

export default async function DemoBioPage({ params }) {
  const { username } = await params;

  if (!username) return notFound();

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen bg-base-100">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>}>
      <DemoClient username={username} />
    </Suspense>
  );
}
