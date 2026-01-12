"use client";

import { RiShareBoxLine } from "react-icons/ri";

export default function SocialTemplate({ page, links, handleLinkClick }) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-1 w-full gap-2">
        {links.map((link) => (
          <a
            key={link.id || link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick?.(link.id)}
            className="group flex items-center justify-between p-5 bg-base-100 border-b border-base-200 hover:bg-base-200 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-base-200 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors text-xl">
                {link.icon || <RiShareBoxLine />}
              </div>
              <span className="font-bold text-lg">{link.title}</span>
            </div>
            <div className="badge badge-sm badge-outline opacity-30 mt-1">
              LINK
            </div>
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
