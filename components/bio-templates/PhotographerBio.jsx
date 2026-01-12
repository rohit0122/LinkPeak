export function PhotographerBio({ bio, links }) {
  return (
    <div className="bg-base-100 min-h-screen p-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold">{bio.name}</h1>
        {bio.description && (
          <p className="mt-2 text-muted max-w-md mx-auto">{bio.description}</p>
        )}
      </header>

      <div className="columns-2 md:columns-3 gap-4 mt-6 space-y-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.title}
            className="break-inside-avoid transform hover:scale-105 transition"
          >
            <img
              src={link.icon}
              alt={`${link.title} preview`}
              loading="lazy"
              className="rounded-lg"
            />
            <span className="sr-only">{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
