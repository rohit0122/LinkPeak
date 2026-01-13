"use client";
import BrutalistTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/BrutalistTemplate";
import ClassicTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/ClassicTemplate";
import DarkNeonTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/DarkNeonTemplate";
import ElegantSerifTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/ElegantSerifTemplate";
import GlassmorphismTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/GlassmorphismTemplate";
import GradientMeshTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/GradientMeshTemplate";
import BentoTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/BentoTemplate";
import TilesTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/TilesTemplate";
import HeroTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/HeroTemplate";
import MinimalistTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/MinimalistTemplate";
import StackTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/StackTemplate";
import SleekTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/SleekTemplate";
import NeoBrutalismTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/NeoBrutalismTemplate";
import InfluencerTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/InfluencerTemplate";
import SoftPastelTemplate from "@/components/templates/upgradedTemplates/templatesWithBio/SoftPastelTemplate";
import Head from "next/head";
/* Import all templates */

const bioInfo = {
  pageId: "demo",
  profile_image: "https://img.daisyui.com/images/daisyui/mark-rotating.svg",
  title: "John Doe",
  role: "user",
  plan: "pro",
  bio: "I help brands build beautiful digital products.",
  views: 12345,
  social_links: [
    { label: "Twitter", href: "https://twitter.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
};

const links = [
  {
    id: "1",
    title: "Portfolio",
    href: "https://portfolio.example",
    icon: "🎨",
  },
  {
    id: "2",
    title: "GitHub",
    href: "https://github.com",
    icon: "🐙",
  },
  {
    id: "3",
    title: "Contact",
    href: "mailto:hello@example.com",
    icon: "✉️",
  },
];

export default function PreviewPage() {
  return (
    <>
      {/* SEO */}
      <Head>
        <title>{bioInfo.name} | Link in Bio Templates Preview</title>
        <meta name="description" content={bioInfo.description} />
      </Head>

      <main className="space-y-24 bg-base-100 text-base-content px-6 py-12 max-w-3xl mx-auto" data-theme="dark">
        <section id="designer">
          <h2 className="text-2xl font-bold mb-4">Designer Template</h2>
          <MinimalistTemplate page={bioInfo} links={links} />
        </section>

        <hr />

        <section id="developer">
          <h2 className="text-2xl font-bold mb-4">Developer Template</h2>
          <BrutalistTemplate page={bioInfo} links={links} />
        </section>

        <hr />

        <section id="coach">
          <h2 className="text-2xl font-bold mb-4">Coach Template</h2>
          <DarkNeonTemplate page={bioInfo} links={links} />
        </section>

        <hr />

        <section id="photographer">
          <h2 className="text-2xl font-bold mb-4">Photographer Template</h2>
          <ElegantSerifTemplate page={bioInfo} links={links} />
        </section>

        <hr />

        <section id="writer">
          <h2 className="text-2xl font-bold mb-4">Writer Template</h2>
          <GlassmorphismTemplate page={bioInfo} links={links} />
        </section>

        <hr />

        <section id="agency">
          <h2 className="text-2xl font-bold mb-4">Agency Template</h2>
          <GradientMeshTemplate page={bioInfo} links={links} />
        </section>

        <hr />

        <section id="maker">
          <h2 className="text-2xl font-bold mb-4">Maker Template (Tiles)</h2>
          <TilesTemplate page={bioInfo} links={links} />
        </section>

        <hr />

        <section id="musician">
          <h2 className="text-2xl font-bold mb-4">Musician Template (Stack)</h2>
          <StackTemplate page={bioInfo} links={links} />
        </section>

        <hr />

        <section id="streamer">
          <h2 className="text-2xl font-bold mb-4">Streamer Template</h2>
          <NeoBrutalismTemplate page={bioInfo} links={links} />
        </section>

        <hr />

        <section id="enterprise">
          <h2 className="text-2xl font-bold mb-4">Enterprise Template</h2>
          <SoftPastelTemplate page={bioInfo} links={links} />
        </section>

        <section id="classsinc">
          <h2 className="text-2xl font-bold mb-4">Classic</h2>
          <ClassicTemplate page={bioInfo} links={links} />
        </section>

        <section id="hero">
          <h2 className="text-2xl font-bold mb-4">Hero</h2>
          <HeroTemplate page={bioInfo} links={links} />
        </section>

        <section id="grid">
          <h2 className="text-2xl font-bold mb-4">Bento</h2>
          <BentoTemplate page={bioInfo} links={links} />
        </section>

        <section id="modern">
          <h2 className="text-2xl font-bold mb-4">Sleek</h2>
          <SleekTemplate page={bioInfo} links={links} />
        </section>

        <section id="social">
          <h2 className="text-2xl font-bold mb-4">Influencer</h2>
          <InfluencerTemplate page={bioInfo} links={links} />
        </section>
      </main>
    </>
  );
}
