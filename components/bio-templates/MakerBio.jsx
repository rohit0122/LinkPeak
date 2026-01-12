export function MakerBio({ bio, links }) {
  return (
    <div className="min-h-screen bg-base-100 p-8 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">{bio.name}</h1>
      </header>

      <ol className="list-decimal list-inside space-y-4">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              aria-label={link.title}
              className="btn btn-accent btn-sm"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
