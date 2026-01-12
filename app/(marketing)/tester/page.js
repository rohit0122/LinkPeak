"use client";
import Head from "next/head";
/* Import all templates */
import DesignerBio from "@/components/bio-templates/Designer/DesignerBio";
import { DeveloperBio } from "@/components/bio-templates/DeveloperBio";
import { CoachBio } from "@/components/bio-templates/CoachBio";
import { PhotographerBio } from "@/components/bio-templates/PhotographerBio";
import { WriterBio } from "@/components/bio-templates/WriterBio";
import { AgencyBio } from "@/components/bio-templates/AgencyBio";
import { MakerBio } from "@/components/bio-templates/MakerBio";
import { MusicianBio } from "@/components/bio-templates/MusicianBio";
import { StreamerBio } from "@/components/bio-templates/StreamerBio";
import { EnterpriseBio } from "@/components/bio-templates/EnterpriseBio";

const bioInfo = {
  pageId: "demo",
  profilePic: "https://img.daisyui.com/images/daisyui/mark-rotating.svg",
  name: "John Doe",
  role: "Freelancer Extraordinaire",
  description: "I help brands build beautiful digital products.",
  totalViews: 12345,
  socialHandles: [
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

      <main className="space-y-24 bg-base-100 text-base-content px-6 py-12 max-w-3xl mx-auto">
        <section id="designer">
          <h2 className="text-2xl font-bold mb-4">Designer Template</h2>
          <DesignerBio variant="A" bio={bioInfo} links={links} />
          <DesignerBio variant="B" bio={bioInfo} links={links} />
          <DesignerBio variant="C" bio={bioInfo} links={links} />
          <DesignerBio variant="D" bio={bioInfo} links={links} />
        </section>

        <hr />

        <section id="developer">
          <h2 className="text-2xl font-bold mb-4">Developer Template</h2>
          <DeveloperBio bio={bioInfo} links={links} />
        </section>

        <hr />

        <section id="coach">
          <h2 className="text-2xl font-bold mb-4">Coach Template</h2>
          <CoachBio bio={bioInfo} links={links} />
        </section>

        <hr />

        <section id="photographer">
          <h2 className="text-2xl font-bold mb-4">Photographer Template</h2>
          <PhotographerBio bio={bioInfo} links={links} />
        </section>

        <hr />

        <section id="writer">
          <h2 className="text-2xl font-bold mb-4">Writer Template</h2>
          <WriterBio bio={bioInfo} links={links} />
        </section>

        <hr />

        <section id="agency">
          <h2 className="text-2xl font-bold mb-4">Agency Template</h2>
          <AgencyBio bio={bioInfo} links={links} />
        </section>

        <hr />

        <section id="maker">
          <h2 className="text-2xl font-bold mb-4">Maker Template</h2>
          <MakerBio bio={bioInfo} links={links} />
        </section>

        <hr />

        <section id="musician">
          <h2 className="text-2xl font-bold mb-4">Musician Template</h2>
          <MusicianBio bio={bioInfo} links={links} />
        </section>

        <hr />

        <section id="streamer">
          <h2 className="text-2xl font-bold mb-4">Streamer Template</h2>
          <StreamerBio bio={bioInfo} links={links} />
        </section>

        <hr />

        <section id="enterprise">
          <h2 className="text-2xl font-bold mb-4">Enterprise Template</h2>
          <EnterpriseBio bio={bioInfo} links={links} />
        </section>
      </main>
    </>
  );
}
