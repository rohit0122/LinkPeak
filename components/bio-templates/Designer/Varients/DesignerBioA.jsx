export default function DesignerBioA({ bio, links }) {
  return (
    <section className="bg-base-300 text-base-content min-h-screen p-8">
      <div className="text-center space-y-4">
        <img
          src={bio.profilePic}
          alt={`${bio.name} profile`}
          loading="lazy"
          className="w-28 h-28 rounded-full mx-auto border-4 border-primary animate-pulse"
        />
        <h1 className="text-4xl font-extrabold text-primary">{bio.name}</h1>
        {bio.description && (
          <p className="text-base-content opacity-90">{bio.description}</p>
        )}
      </div>
      <div className="mt-8 space-y-4">
        {links.map((l) => (
          <a
            key={l.id}
            href={l.href}
            aria-label={l.title}
            className="btn btn-primary btn-lg w-full transition hover:scale-105"
          >
            {l.icon} {l.title}
          </a>
        ))}
      </div>
    </section>
  );
}
