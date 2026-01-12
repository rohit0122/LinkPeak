"use client";

export default function ClassicTemplate({ page, links, handleLinkClick }) {
  return (
    <div className="w-full flex flex-col gap-3">
      {links.map((link) => (
        <a
          key={link.id || link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleLinkClick?.(link.id)}
          className="btn btn-outline btn-primary w-full shadow-sm hover:scale-[1.02] transition-transform no-animation h-14  flex items-center justify-center gap-3 px-6"
        >
          {link.icon && <span className="text-xl">{link.icon}</span>}
          <span className="truncate">{link.title}</span>
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
