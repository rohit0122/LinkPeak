export function WriterBio({ bio, links }) {
  return (
    <div className="bg-white text-base-content min-h-screen p-8 max-w-prose mx-auto">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold">{bio.name}</h1>
      </header>

      {bio.description && (
        <p className="text-lg italic text-muted text-center">
          {bio.description}
        </p>
      )}

      <div className="mt-8 space-y-6">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.title}
            className="block text-primary text-xl hover:underline"
          >
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
}
