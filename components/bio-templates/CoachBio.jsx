export function CoachBio({ bio, links }) {
  return (
    <div className="min-h-screen p-8 bg-base-200 text-base-content">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold">{bio.name}</h1>
        {bio.role && <p className="text-xl text-secondary">{bio.role}</p>}
      </header>

      {bio.description && (
        <p className="mt-2 text-muted text-center">{bio.description}</p>
      )}

      <main className="mt-10 space-y-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.title}
            className="btn btn-primary btn-block text-lg"
          >
            {link.title}
          </a>
        ))}
      </main>
    </div>
  );
}
