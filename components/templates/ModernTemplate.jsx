"use client";

import { RiArrowRightLine } from "react-icons/ri";

export default function ModernTemplate({ page, links, handleLinkClick }) {
  return (
    <div className="w-full space-y-4">
      {links.map((link) => (
        <a
          key={link.id || link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleLinkClick?.(link.id)}
          className="card bg-base-100 shadow-xl image-full border-none before:! hover:before:brightness-110 ! hover:scale-[1.02] transition-transform overflow-hidden group"
        >
          <div className="card-body p-6 flex flex-row items-center justify-between z-10">
            <div className="flex items-center gap-4">
              {link.icon && (
                <div className="text-3xl filter drop-shadow-lg scale-110">
                  {link.icon}
                </div>
              )}
              <div>
                <h2 className="card-title text-primary-content font-medium">
                  {link.title}
                </h2>
                <p className="text-sm text-primary-content/70 font-medium">
                  Click to explore
                </p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-content group-hover:translate-x-1 transition-transform">
              <RiArrowRightLine className="text-xl" />
            </div>
          </div>
          {/* Background tint overlay */}
          <div className="absolute inset-0 bg-primary/80 opacity-90"></div>
        </a>
      ))}

      {links.length === 0 && (
        <div className="text-center opacity-40 mt-10">
          <p className="text-sm italic">No links live yet...</p>
        </div>
      )}
    </div>
  );
}
