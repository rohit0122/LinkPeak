export function EnterpriseBio({ bio, links }) {
  return (
    <div className="min-h-screen bg-base-200 p-8 text-center">
      <h1 className="text-3xl font-bold">{bio.name}</h1>

      <p className="text-sm text-muted mt-1">
        Total Views: <strong>{bio.totalViews}</strong>
      </p>

      <div className="flex justify-center gap-4 mt-4">
        {bio.socialHandles?.map((s) => (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            className="badge badge-accent"
          >
            {s.label}
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            aria-label={link.title}
            className="btn btn-outline btn-primary"
          >
            {link.title}
          </a>
        ))}
      </div>
    </div>
  );
}
