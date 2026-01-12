export default function DesignerBioD({ bio, links }) {
  return (
    <section className="bg-neutral text-neutral-content min-h-screen p-8">
      <div className="text-center">
        <img
          src={bio.profilePic}
          alt={`${bio.name} profile`}
          loading="lazy"
          className="w-28 h-28 rounded-full mx-auto border-4 border-secondary"
        />
        <h1 className="text-4xl font-bold text-secondary">{bio.name}</h1>
      </div>

      <div className="mt-8 space-y-4">
        {links.map((l) => (
          <a
            key={l.id}
            href={l.href}
            className="btn btn-outline btn-secondary btn-block text-lg"
          >
            {l.icon} {l.title}
          </a>
        ))}
      </div>
    </section>
  );
}
