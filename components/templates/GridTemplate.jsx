"use client";

import { RiLayoutGridLine } from "react-icons/ri";

export default function GridTemplate({ page, links, handleLinkClick }) {
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {links.map((link) => (
        <a
          key={link.id || link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleLinkClick?.(link.id)}
          className="aspect-square bg-base-100 border-2 border-primary/20 hover:border-primary  flex flex-col items-center justify-center p-4 text-center gap-2 transition-all hover:scale-105 shadow-sm"
        >
          <div className="w-12 h-12  bg-primary/10 flex items-center justify-center text-primary mb-2 text-2xl">
            {link.icon || <RiLayoutGridLine className="text-xl" />}
          </div>
          <span className="font-bold text-sm leading-tight line-clamp-2">
            {link.title}
          </span>
        </a>
      ))}
      {links.length === 0 && (
        <div className="col-span-2 text-center opacity-40 mt-10">
          <p className="text-sm italic">No links live yet...</p>
        </div>
      )}
    </div>
  );
}
