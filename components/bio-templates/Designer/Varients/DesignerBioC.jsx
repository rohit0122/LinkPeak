export default function DesignerBioC({ bio, links }) {
  const colors = ["primary", "secondary", "accent", "info"];
  return (
    <section className="bg-base-100 text-base-content min-h-screen p-8">
      <div className="text-center">
        <img
          src={bio.profilePic}
          alt={`${bio.name} profile`}
          loading="lazy"
          className="w-28 h-28 rounded-full mx-auto border-2 border-base-content"
        />
        <h1 className="text-4xl font-bold">{bio.name}</h1>
      </div>

      <div className="mt-8 space-y-4">
        {links.map((l, i) => (
          <a
            key={l.id}
            href={l.href}
            className={`btn btn-${colors[i % colors.length]} btn-block text-lg`}
          >
            {l.icon} {l.title}
          </a>
        ))}
      </div>
    </section>
  );
}
