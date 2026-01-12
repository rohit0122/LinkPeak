export function AgencyBio({ bio, links }) {
  return (
    <div className="bg-base-200 min-h-screen p-8 space-y-6">
      <header className="text-center">
        <h1 className="text-5xl font-bold">{bio.name}</h1>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.title}
            className="flex items-center gap-4 bg-base-100 shadow-lg p-6 rounded-lg hover:bg-primary hover:text-base-100 transition"
          >
            {link.icon && <span className="text-3xl">{link.icon}</span>}
            <span className="text-xl font-semibold">{link.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
