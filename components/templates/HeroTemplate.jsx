"use client";

import { RiFlashlightLine, RiArrowRightUpLine } from "react-icons/ri";

export default function HeroTemplate({ page, links, handleLinkClick }) {
  const heroLink = links[0];
  const otherLinks = links.slice(1);

  return (
    <div className="w-full space-y-4">
      {heroLink && (
        <a
          href={heroLink.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleLinkClick?.(heroLink.id)}
          className="relative block group w-full p-8 bg-primary text-primary-content  shadow-2xl shadow-primary/30 hover:scale-[1.03] transition-all overflow-hidden mb-8"
        >
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="badge badge-secondary/80 font-bold p-3 animate-pulse">
              FEATURED
            </div>
            <div className="flex items-center gap-4">
              {heroLink.icon && (
                <span className="text-4xl">{heroLink.icon}</span>
              )}
              <h2 className="text-3xl font-medium leading-none">
                {heroLink.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 font-bold opacity-80">
              Check it out <RiFlashlightLine />
            </div>
          </div>
          <RiArrowRightUpLine className="absolute top-6 right-6 text-4xl opacity-20 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </a>
      )}

      <div className="space-y-3">
        {otherLinks.map((link) => (
          <a
            key={link.id || link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick?.(link.id)}
            className="btn btn-ghost btn-lg w-full bg-base-200/50 hover:bg-base-200  flex justify-between px-6 no-animation h-16"
          >
            <div className="flex items-center gap-3">
              {link.icon && <span className="text-xl">{link.icon}</span>}
              <span className="font-bold">{link.title}</span>
            </div>
            <RiArrowRightUpLine className="opacity-40" />
          </a>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center opacity-40 mt-10">
          <p className="text-sm italic">No links live yet...</p>
        </div>
      )}
    </div>
  );
}
