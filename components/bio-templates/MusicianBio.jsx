export function MusicianBio({ bio, links }) {
  return (
    <div className="bg-accent text-base-100 min-h-screen p-8">
      <header className="text-center">
        <h1 className="text-5xl font-bold">{bio.name}</h1>
      </header>

      <div className="mt-10 space-y-5">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.title}
            className="btn btn-lg btn-secondary btn-block text-xl"
          >
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
}
